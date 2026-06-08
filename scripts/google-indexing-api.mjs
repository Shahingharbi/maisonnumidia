#!/usr/bin/env node
// Google Indexing API — auto-submit URLs to Google for re-indexing.
// Usage:
//   node scripts/google-indexing-api.mjs --url=https://maisonnumidia.store/   (test 1 URL)
//   node scripts/google-indexing-api.mjs                                       (daily batch up to 200 URLs)
//   node scripts/google-indexing-api.mjs --dry-run                             (no API call, preview only)
//
// Credentials path: .credentials/google-indexing.json (gitignored)
//   or env var GOOGLE_INDEXING_CREDENTIALS_JSON (full JSON string, for Vercel/CI)

import fs from "fs";
import path from "path";
import crypto from "crypto";

const CREDENTIALS_PATH = process.env.GOOGLE_INDEXING_CREDENTIALS_FILE
  || "./.credentials/google-indexing.json";
const CREDENTIALS_JSON = process.env.GOOGLE_INDEXING_CREDENTIALS_JSON;
const SCOPE = "https://www.googleapis.com/auth/indexing https://www.googleapis.com/auth/siteverification https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const PUBLISH_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const VERIFY_TOKEN_URL = "https://www.googleapis.com/siteVerification/v1/token";
const VERIFY_INSERT_URL = "https://www.googleapis.com/siteVerification/v1/webResource";
const VERIFY_LIST_URL = "https://www.googleapis.com/siteVerification/v1/webResource";
const SITE = "https://maisonnumidia.store/";
const LOG_PATH = "./data/indexing-log.json";
const SITEMAP_URL = "https://maisonnumidia.store/sitemap.xml";
const DAILY_QUOTA = 200;
const RATE_LIMIT_MS = 150;
const INSPECT_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const SITES_URL = "https://searchconsole.googleapis.com/webmasters/v3/sites";
const INDEX_STALE_DAYS = 7;   // re-vérifier le statut d'indexation au-delà de X jours
const INSPECT_BUDGET = 1500;  // quota URL Inspection = 2000/jour, marge de sécurité

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: creds.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const header = { alg: "RS256", typ: "JWT" };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto.createSign("RSA-SHA256").update(signingInput).sign(creds.private_key);
  const encodedSig = signature
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const jwt = `${signingInput}.${encodedSig}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function getVerificationToken(accessToken, method = "FILE") {
  const res = await fetch(VERIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      verificationMethod: method,
      site: { identifier: SITE, type: "SITE" },
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Verification token request failed: ${res.status} ${text}`);
  }
  return JSON.parse(text);
}

async function insertVerification(accessToken, method = "FILE") {
  const res = await fetch(`${VERIFY_INSERT_URL}?verificationMethod=${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site: { identifier: SITE, type: "SITE" },
    }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function listVerifications(accessToken) {
  const res = await fetch(VERIFY_LIST_URL, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function publishUrl(accessToken, url) {
  const res = await fetch(PUBLISH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function getUrlMetadata(accessToken, url) {
  const endpoint = `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodeURIComponent(url)}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

async function listSites(accessToken) {
  const res = await fetch(SITES_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  return data.siteEntry || [];
}

// Trouve la propriété Search Console du site (préfère la propriété domaine).
async function resolveProperty(accessToken) {
  try {
    const sites = await listSites(accessToken);
    const mn = sites.map((s) => s.siteUrl).filter((u) => /maisonnumidia/.test(u));
    return mn.find((u) => u.startsWith("sc-domain:")) || mn[0] || null;
  } catch {
    return null;
  }
}

// Statut d'indexation réel d'une URL via l'API URL Inspection de GSC.
// Résilient : une panne réseau passagère renvoie {ok:false} au lieu de crasher le run.
async function inspectIndexStatus(accessToken, siteUrl, url) {
  try {
    const res = await fetch(INSPECT_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inspectionUrl: url, siteUrl }),
    });
    if (!res.ok) return { ok: false, status: res.status, state: null };
    const data = await res.json().catch(() => ({}));
    const r = (data.inspectionResult && data.inspectionResult.indexStatusResult) || {};
    return { ok: true, status: 200, state: r.coverageState || "unknown" };
  } catch {
    return { ok: false, status: 0, state: null };
  }
}

// "indexée" = coverageState contient "indexed" sans "not indexed".
function isIndexed(state) {
  return typeof state === "string" && /indexed/i.test(state) && !/not indexed/i.test(state);
}

async function fetchSitemap() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

function loadCredentials() {
  if (CREDENTIALS_JSON) {
    return JSON.parse(CREDENTIALS_JSON);
  }
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      `Credentials file not found at ${CREDENTIALS_PATH}. Set GOOGLE_INDEXING_CREDENTIALS_JSON env var or place the JSON at this path.`
    );
  }
  return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
}

function loadLog() {
  if (!fs.existsSync(LOG_PATH)) {
    return { submitted: {}, runs: [], lastRun: null };
  }
  try {
    const data = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
    return {
      submitted: data.submitted || {},
      runs: data.runs || [],
      lastRun: data.lastRun || null,
    };
  } catch {
    return { submitted: {}, runs: [], lastRun: null };
  }
}

function saveLog(log) {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

const args = process.argv.slice(2);
const TEST_URL = args.find((a) => a.startsWith("--url="))?.slice(6);
const DRY_RUN = args.includes("--dry-run");
const LIMIT_ARG = args.find((a) => a.startsWith("--limit="));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.slice(8), 10) : DAILY_QUOTA;
const VERIFY_INIT = args.includes("--verify-init");
const VERIFY_DO = args.includes("--verify");
const VERIFY_LIST = args.includes("--verify-list");
const VERIFY_METHOD = args.find((a) => a.startsWith("--method="))?.slice(9) || "FILE";
const CHECK_STATUS = args.find((a) => a.startsWith("--check="))?.slice(8);
const INSPECT_LIMIT_ARG = args.find((a) => a.startsWith("--inspect-limit="));
const INSPECT_LIMIT = INSPECT_LIMIT_ARG ? parseInt(INSPECT_LIMIT_ARG.slice(16), 10) : INSPECT_BUDGET;

async function main() {
  const creds = loadCredentials();
  console.log(`Service Account: ${creds.client_email}`);
  console.log(`Project: ${creds.project_id}`);

  console.log("Requesting access token...");
  const token = await getAccessToken(creds);
  console.log("Access token: OK\n");

  // ---------- Site Verification: list current ownerships ----------
  if (VERIFY_LIST) {
    console.log("Listing current Site Verification ownerships for this SA...");
    const result = await listVerifications(token);
    console.log(`HTTP ${result.status}`);
    console.log(result.body);
    return;
  }

  // ---------- Site Verification: get token (FILE or META) ----------
  if (VERIFY_INIT) {
    console.log(`Requesting Site Verification token (method: ${VERIFY_METHOD})...`);
    const data = await getVerificationToken(token, VERIFY_METHOD);
    console.log("\n=== VERIFICATION TOKEN RECEIVED ===");
    console.log(JSON.stringify(data, null, 2));
    if (VERIFY_METHOD === "FILE") {
      console.log(`\nNext step: place a file at /public/${data.token} with content:`);
      console.log(`  google-site-verification: ${data.token}`);
      console.log("Then run: node scripts/google-indexing-api.mjs --verify --method=FILE");
    } else if (VERIFY_METHOD === "META") {
      console.log(`\nNext step: add this meta tag to the <head> of the homepage:`);
      console.log(`  <meta name="google-site-verification" content="${data.token.replace(/^.*content="?([^"]+)".*$/s, "$1")}" />`);
      console.log("Then run: node scripts/google-indexing-api.mjs --verify --method=META");
    }
    return;
  }

  // ---------- Site Verification: insert (validate ownership) ----------
  if (VERIFY_DO) {
    console.log(`Requesting Google to verify ownership via ${VERIFY_METHOD}...`);
    const result = await insertVerification(token, VERIFY_METHOD);
    console.log(`HTTP ${result.status}`);
    console.log(result.body);
    if (result.status === 200) {
      console.log("\n✓ SUCCESS — Service Account is now a verified owner.");
      console.log("  Try the indexing API now: node scripts/google-indexing-api.mjs --url=https://maisonnumidia.store/");
    } else {
      console.log("\n✗ Verification failed. Common causes:");
      console.log("  - File not yet deployed (wait for Vercel build, ~1-2 min)");
      console.log("  - File path wrong (must be /public/{token}, accessible at https://maisonnumidia.store/{token})");
      console.log("  - Site Verification API not enabled on GCP project");
    }
    return;
  }

  // ---------- Check status of a previously submitted URL ----------
  if (CHECK_STATUS) {
    console.log(`Checking metadata for: ${CHECK_STATUS}`);
    const result = await getUrlMetadata(token, CHECK_STATUS);
    console.log(`HTTP ${result.status}`);
    console.log(result.body);
    return;
  }

  // ---------- Single URL test mode ----------
  if (TEST_URL) {
    console.log(`Test mode — submitting: ${TEST_URL}`);
    if (DRY_RUN) {
      console.log("DRY RUN — no API call");
      return;
    }
    const result = await publishUrl(token, TEST_URL);
    console.log(`HTTP ${result.status}`);
    console.log(result.body);
    if (result.status === 200) {
      console.log("\n✓ SUCCESS — Google has accepted the URL for re-indexing.");
    } else if (result.status === 403) {
      console.log("\n✗ 403 — Service Account is not recognized as Owner of the site.");
      console.log("  Solution: add SA email to GSC as Owner, OR use Site Verification API.");
    } else {
      console.log("\n✗ Unexpected response.");
    }
    return;
  }

  // ---------- Daily batch mode ----------
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  const allUrls = await fetchSitemap();
  console.log(`Found ${allUrls.length} URLs in sitemap\n`);

  const log = loadLog();
  const today = new Date().toISOString().split("T")[0];
  let runEntry = log.runs.find((r) => r.date === today);
  if (!runEntry) {
    runEntry = { date: today, urls: [], errors: [] };
    log.runs.push(runEntry);
  }
  const todaySubmitted = runEntry.urls.length;
  const remaining = Math.max(0, Math.min(LIMIT, DAILY_QUOTA - todaySubmitted));
  console.log(`Aujourd'hui (${today}): ${todaySubmitted}/${DAILY_QUOTA} pings utilisés — reste ${remaining}\n`);

  // ── Statut d'indexation via GSC (URL Inspection) ─────────────────────────
  // On concentre les pings sur les pages NON indexées, au lieu de re-pinger
  // en boucle des pages déjà indexées (inutile pour l'indexation).
  if (!log.indexStatus) log.indexStatus = {};
  const property = await resolveProperty(token);

  if (property) {
    console.log(`Propriété GSC: ${property}`);
    const staleMs = INDEX_STALE_DAYS * 86400 * 1000;
    const toInspect = allUrls
      .filter((u) => {
        const s = log.indexStatus[u];
        return !s || !s.checkedAt || Date.now() - s.checkedAt > staleMs;
      })
      .slice(0, INSPECT_LIMIT);
    console.log(`Inspection de ${toInspect.length} URLs (statut manquant ou > ${INDEX_STALE_DAYS}j)...`);
    let insp = 0;
    for (const u of toInspect) {
      const r = await inspectIndexStatus(token, property, u);
      if (r.ok) {
        log.indexStatus[u] = { state: r.state, indexed: isIndexed(r.state), checkedAt: Date.now() };
      } else if (r.status === 429) {
        console.log("Quota URL Inspection atteint — arrêt de l'inspection.");
        break;
      }
      if (++insp % 50 === 0) { console.log(`  inspecté ${insp}/${toInspect.length}`); saveLog(log); }
      await new Promise((res) => setTimeout(res, 120));
    }
    saveLog(log);
    const known = allUrls.filter((u) => log.indexStatus[u]);
    const idx = known.filter((u) => log.indexStatus[u].indexed).length;
    console.log(`Bilan indexation connu: ${idx}/${known.length} indexées (${known.length - idx} à pousser)\n`);
  } else {
    console.log("Pas d'accès propriété GSC — repli sur l'ancienne logique.\n");
  }

  if (remaining === 0 && !DRY_RUN) {
    console.log("Quota de ping du jour épuisé. Statut d'indexation rafraîchi, pings demain.");
    log.lastRun = new Date().toISOString();
    saveLog(log);
    return;
  }

  // ── File de ping : non indexées d'abord (plus anciennement pingées), puis inconnues ──
  const lastPing = (u) => log.submitted[u] || 0;
  const pingBudget = DRY_RUN ? (remaining > 0 ? remaining : DAILY_QUOTA) : remaining;
  let queue;
  if (property) {
    const notIndexed = allUrls
      .filter((u) => log.indexStatus[u] && !log.indexStatus[u].indexed)
      .sort((a, b) => lastPing(a) - lastPing(b));
    const unknown = allUrls
      .filter((u) => !log.indexStatus[u])
      .sort((a, b) => lastPing(a) - lastPing(b));
    queue = [...notIndexed, ...unknown].slice(0, pingBudget);
    console.log(`File: ${notIndexed.length} non indexées + ${unknown.length} inconnues → ping ${queue.length}`);
  } else {
    const submittedKeys = new Set(Object.keys(log.submitted));
    const neverSubmitted = allUrls.filter((u) => !submittedKeys.has(u));
    const oldest = allUrls
      .filter((u) => submittedKeys.has(u))
      .sort((a, b) => lastPing(a) - lastPing(b));
    queue = [...neverSubmitted, ...oldest].slice(0, pingBudget);
  }
  console.log(`A soumettre: ${queue.length} URLs (espacées de ${RATE_LIMIT_MS}ms)\n`);

  if (DRY_RUN) {
    console.log("DRY RUN — 10 premières URLs qui seraient pingées:");
    queue.slice(0, 10).forEach((u) => console.log("  -", u, log.indexStatus[u] ? `[${log.indexStatus[u].state}]` : "[inconnu]"));
    return;
  }

  let okCount = 0;
  let errCount = 0;
  for (let i = 0; i < queue.length; i++) {
    const url = queue[i];
    try {
      const result = await publishUrl(token, url);
      if (result.status === 200) {
        log.submitted[url] = Date.now();
        runEntry.urls.push(url);
        okCount++;
      } else {
        runEntry.errors.push({ url, status: result.status, body: result.body.slice(0, 300) });
        errCount++;
        if (result.status === 429) {
          console.log("Rate limit hit (429), stopping.");
          break;
        }
        if (result.status === 403 && errCount > 3) {
          console.log("Multiple 403 responses, stopping. Check Service Account permissions.");
          break;
        }
      }
    } catch (e) {
      runEntry.errors.push({ url, error: e.message });
      errCount++;
    }
    if ((i + 1) % 10 === 0 || i === queue.length - 1) {
      console.log(`  ${i + 1}/${queue.length} (ok=${okCount} err=${errCount})`);
      log.lastRun = new Date().toISOString();
      saveLog(log);
    }
    if (i < queue.length - 1) {
      await new Promise((r) => setTimeout(r, RATE_LIMIT_MS));
    }
  }

  log.lastRun = new Date().toISOString();
  saveLog(log);
  console.log(`\nDone: ${okCount} OK, ${errCount} errors`);
  console.log(`Total submitted ever: ${Object.keys(log.submitted).length} URLs`);
  console.log(`Log saved: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
