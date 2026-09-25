#!/usr/bin/env node
// Le format des <title> des fiches produit a change le 14/09/2026
// ("{Marque} {Nom} Prix Algérie Original"). Ce script compare le CTR des fiches
// produit avant / apres, pour voir si le changement se voit dans les donnees.
// Fenetre courte (les donnees s'arretent au 19/09) : c'est un signal, pas une preuve.
import fs from "fs";
import crypto from "crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const creds = JSON.parse(fs.readFileSync("./.credentials/google-indexing.json", "utf8"));
const b64 = (i) => Buffer.from(i).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

const now = Math.floor(Date.now() / 1000);
const si = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(JSON.stringify({ iss: creds.client_email, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now }))}`;
const sig = crypto.createSign("RSA-SHA256").update(si).sign(creds.private_key).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const tok = await (await fetch(TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${si}.${sig}` }) })).json();

async function stats(startDate, endDate) {
  const res = await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain%3Amaisonnumidia.store/searchAnalytics/query", {
    method: "POST",
    headers: { Authorization: `Bearer ${tok.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      startDate, endDate, dimensions: ["date"], rowLimit: 1000,
      dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: "/parfums/" }] }],
    }),
  });
  const rows = (await res.json()).rows || [];
  const c = rows.reduce((s, r) => s + r.clicks, 0);
  const i = rows.reduce((s, r) => s + r.impressions, 0);
  const pos = i ? rows.reduce((s, r) => s + r.position * r.impressions, 0) / i : 0;
  return { jours: rows.length, clics: c, imp: i, ctr: i ? c / i : 0, pos };
}

const periodes = [
  ["avant  (01/08 -> 13/09)", "2026-08-01", "2026-09-13"],
  ["après  (15/09 -> 19/09)", "2026-09-15", "2026-09-19"],
  ["même fenêtre, mois -1 (15/08 -> 19/08)", "2026-08-15", "2026-08-19"],
];
console.log("Fiches produit uniquement (/parfums/)\n");
console.log("période".padEnd(40) + "jours" + "clics".padStart(8) + "impress.".padStart(10) + "   CTR" + "  pos.moy" + "  clics/jour");
for (const [nom, a, b] of periodes) {
  const s = await stats(a, b);
  console.log(nom.padEnd(40) + String(s.jours).padStart(5) + String(s.clics).padStart(8) + String(s.imp).padStart(10) +
    (100 * s.ctr).toFixed(2).padStart(7) + "%" + s.pos.toFixed(1).padStart(8) + (s.clics / (s.jours || 1)).toFixed(1).padStart(12));
}
