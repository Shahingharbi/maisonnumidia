#!/usr/bin/env node
// Extraction Search Console pour une analyse complète du trafic (cannibalisation, requêtes à
// portée de main, écarts de CTR, gagnants/perdants, effet d'une migration).
//
//   node scripts/_gsc/pull-analyse.mjs
//
// Écrit dans scripts/_gsc/brut/ (ignoré par git : ce sont les requêtes des clients, et le dépôt
// est public). Quatre périodes comparables, calculées depuis la date du jour :
//   A = 90 derniers jours      B = 90 jours d'avant
//   C = 28 derniers jours      D = 28 jours d'avant
// Scope : webmasters.readonly seul (règle n°8 du CLAUDE.md).
import fs from "fs";
import crypto from "crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const CREDENTIALS_PATH = process.env.GOOGLE_INDEXING_CREDENTIALS_FILE || "./.credentials/google-indexing.json";
const OUT = "./scripts/_gsc/brut";
const SITE = "sc-domain:maisonnumidia.store";

const b64 = (x) => Buffer.from(x).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
async function jeton(creds) {
  const now = Math.floor(Date.now() / 1000);
  const entree = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(JSON.stringify({ iss: creds.client_email, scope: GSC_SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now }))}`;
  const sig = crypto.createSign("RSA-SHA256").update(entree).sign(creds.private_key).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${entree}.${sig}` }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error("token refusé : " + JSON.stringify(json).slice(0, 300));
  return json.access_token;
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function requete(token, body, plafond = 250_000) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
  const lignes = [];
  for (let startRow = 0; startRow < plafond; ) {
    let json;
    for (let essai = 1; ; essai++) {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ rowLimit: 25000, startRow, type: "web", ...body }),
      });
      if (res.ok) { json = await res.json(); break; }
      if (essai >= 4) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
      await pause(4000 * essai);
    }
    const rows = json.rows || [];
    lignes.push(...rows);
    if (rows.length < 25000) break;
    startRow += rows.length;
  }
  return lignes;
}

const jour = (d) => d.toISOString().slice(0, 10);
const moins = (n) => jour(new Date(Date.now() - n * 86400000));
// J-3 : les deux ou trois derniers jours sont incomplets côté Google.
const P = {
  A: [moins(92), moins(3)],
  B: [moins(182), moins(93)],
  C: [moins(30), moins(3)],
  D: [moins(58), moins(31)],
};
const SEIZE_MOIS = [moins(485), moins(1)];

const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
const token = await jeton(creds);
fs.mkdirSync(OUT, { recursive: true });

const resume = { site: SITE, extraitLe: jour(new Date()), periodes: P, seizeMois: SEIZE_MOIS, fichiers: {} };
async function ecrire(nom, body, plafond) {
  const rows = await requete(token, body, plafond);
  fs.writeFileSync(`${OUT}/${nom}.json`, JSON.stringify(rows));
  const clics = rows.reduce((s, r) => s + r.clicks, 0);
  const imp = rows.reduce((s, r) => s + r.impressions, 0);
  resume.fichiers[nom] = { lignes: rows.length, clics, impressions: imp };
  console.log(`  ${nom} : ${rows.length} lignes, ${clics} clics, ${imp} impressions`);
}

// 1. Courbe quotidienne sur 16 mois (données fraîches comprises, pour voir les derniers jours).
await ecrire("jours", { startDate: SEIZE_MOIS[0], endDate: SEIZE_MOIS[1], dimensions: ["date"], dataState: "all" });

// 2. Courbe quotidienne par type de page (filtre regex RE2 sur l'URL).
const H = "^https://(www\\.)?maisonnumidia\\.store";
const TYPES = {
  accueil: `${H}/?$`,
  produit: `${H}/parfums/[^/]+/?$`,
  mere: `${H}/(parfums-homme|parfums-femme|parfums-orientaux)/?$`,
  fille: `${H}/(parfums-homme|parfums-femme|parfums-orientaux)/[^/]+/?$`,
  marque: `${H}/marques(/[^/]+)?/?$`,
  blog: `${H}/blog(/[^/]+)?/?$`,
};
for (const [type, regex] of Object.entries(TYPES)) {
  await ecrire(`jours-${type}`, {
    startDate: SEIZE_MOIS[0], endDate: SEIZE_MOIS[1], dimensions: ["date"], dataState: "all",
    dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "includingRegex", expression: regex }] }],
  });
}

// 3. Les quatre périodes : pages, requêtes, requête × page.
for (const [nom, [startDate, endDate]] of Object.entries(P)) {
  await ecrire(`pages-${nom}`, { startDate, endDate, dimensions: ["page"] });
  await ecrire(`requetes-${nom}`, { startDate, endDate, dimensions: ["query"] });
  await ecrire(`rp-${nom}`, { startDate, endDate, dimensions: ["query", "page"] });
}

// 4. Pays et appareils sur A ; requêtes et pages vues depuis l'Algérie seulement.
await ecrire("pays-A", { startDate: P.A[0], endDate: P.A[1], dimensions: ["country"] });
await ecrire("appareils-A", { startDate: P.A[0], endDate: P.A[1], dimensions: ["device"] });
const DZ = [{ filters: [{ dimension: "country", operator: "equals", expression: "dza" }] }];
await ecrire("requetes-A-dz", { startDate: P.A[0], endDate: P.A[1], dimensions: ["query"], dimensionFilterGroups: DZ });
await ecrire("pages-A-dz", { startDate: P.A[0], endDate: P.A[1], dimensions: ["page"], dimensionFilterGroups: DZ });
await ecrire("rp-A-dz", { startDate: P.A[0], endDate: P.A[1], dimensions: ["query", "page"], dimensionFilterGroups: DZ });

// 5. Page × jour sur 60 jours : effet d'un changement daté (migration, ajout de fiches) page par page.
await ecrire("pages-jours-60", { startDate: moins(61), endDate: moins(1), dimensions: ["date", "page"], dataState: "all" });

// 6. Types de résultats (extraits enrichis, fiches produit…) sur A.
await ecrire("apparence-A", { startDate: P.A[0], endDate: P.A[1], dimensions: ["searchAppearance"] });

fs.writeFileSync(`${OUT}/_resume.json`, JSON.stringify(resume, null, 1));
console.log("résumé : " + OUT + "/_resume.json");
