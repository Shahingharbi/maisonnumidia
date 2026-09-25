#!/usr/bin/env node
// Extrait les donnees Search Analytics de la Search Console sur toute la periode disponible
// (16 mois glissants cote Google) et les ecrit dans scripts/_gsc/data/.
//
// Sert a repondre a une question precise : sur quelles requetes le site est reellement trouve,
// et donc quels mots doivent figurer dans le h1, les h2 et le title d'une fiche produit.
//
// Scopes : webmasters.readonly uniquement (regle n8 du CLAUDE.md : ne JAMAIS melanger
// ce scope avec celui de l'Indexing API dans un meme token).
import fs from "fs";
import crypto from "crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const CREDENTIALS_PATH = process.env.GOOGLE_INDEXING_CREDENTIALS_FILE || "./.credentials/google-indexing.json";
const OUT = "./scripts/_gsc/data";

const base64url = (input) => Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

async function getAccessToken(creds, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(JSON.stringify({ iss: creds.client_email, scope, aud: TOKEN_URL, exp: now + 3600, iat: now }));
  const signingInput = `${header}.${claim}`;
  const sig = crypto.createSign("RSA-SHA256").update(signingInput).sign(creds.private_key)
    .toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${signingInput}.${sig}` }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error("token refusé : " + JSON.stringify(json).slice(0, 300));
  return json.access_token;
}

async function sites(token) {
  const res = await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites", { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  return (json.siteEntry || []).map((s) => s.siteUrl);
}

// L'API plafonne a 25 000 lignes par appel : on pagine tant qu'on reçoit des lignes pleines.
async function query(token, siteUrl, body) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const lignes = [];
  let startRow = 0;
  for (;;) {
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ rowLimit: 25000, startRow, ...body }),
    });
    if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 300)}`);
    const json = await res.json();
    const rows = json.rows || [];
    lignes.push(...rows);
    if (rows.length < 25000) break;
    startRow += rows.length;
    if (startRow > 100000) break;
  }
  return lignes;
}

const creds = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
const token = await getAccessToken(creds, GSC_SCOPE);
const proprietes = await sites(token);
console.log("propriétés vérifiées : " + proprietes.join(", "));

const site = proprietes.find((s) => s.startsWith("sc-domain:")) || proprietes.find((s) => s.includes("maisonnumidia")) || proprietes[0];
if (!site) throw new Error("aucune propriété accessible avec ce compte de service");
console.log("propriété utilisée : " + site);

// 16 mois glissants : c'est tout ce que Google conserve.
const fin = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);   // J-2, les 2 derniers jours sont incomplets
const debut = new Date(Date.now() - 480 * 86400000).toISOString().slice(0, 10);
console.log(`période : ${debut} -> ${fin}`);

fs.mkdirSync(OUT, { recursive: true });
const jobs = [
  ["requetes", { startDate: debut, endDate: fin, dimensions: ["query"] }],
  ["pages", { startDate: debut, endDate: fin, dimensions: ["page"] }],
  ["requete-page", { startDate: debut, endDate: fin, dimensions: ["query", "page"] }],
  ["mois", { startDate: debut, endDate: fin, dimensions: ["date"] }],
];

const resume = {};
for (const [nom, body] of jobs) {
  const rows = await query(token, site, body);
  fs.writeFileSync(`${OUT}/${nom}.json`, JSON.stringify(rows));
  const clics = rows.reduce((s, r) => s + r.clicks, 0);
  const imp = rows.reduce((s, r) => s + r.impressions, 0);
  resume[nom] = { lignes: rows.length, clics, impressions: imp };
  console.log(`  ${nom} : ${rows.length} lignes, ${clics} clics, ${imp} impressions`);
}
fs.writeFileSync(`${OUT}/_resume.json`, JSON.stringify({ site, debut, fin, ...resume }, null, 1));
