#!/usr/bin/env node
// Met de côté des fichiers de recherche à refaire, sans rien supprimer.
//
//   node scripts/_catalog-add/mettre-de-cote.mjs <liste.json> <dossier>
//
// <liste.json> : tableau de slugs. Chaque research/<slug>.json part dans
// a-rechercher-de-nouveau/<dossier>/ ; les agents de recherche, qui sautent ce qui existe,
// le referont alors au lot suivant.
//
// Né le 21/11/2026 : 204 recherches rendues sans ID Fragrantica, parce que la recherche web ne
// remontait plus fragrantica.com sans le filtre de domaine (allowed_domains).
import fs from "fs";

const R = "./scripts/_catalog-add";
const [liste, dossier] = process.argv.slice(2);
if (!liste || !dossier) {
  console.error("usage : node scripts/_catalog-add/mettre-de-cote.mjs <liste.json> <dossier>");
  process.exit(1);
}
const slugs = JSON.parse(fs.readFileSync(liste, "utf8"));
const cible = `${R}/a-rechercher-de-nouveau/${dossier}`;
fs.mkdirSync(cible, { recursive: true });
let n = 0;
for (const slug of slugs) {
  const src = `${R}/research/${slug}.json`;
  if (!fs.existsSync(src)) continue;
  fs.renameSync(src, `${cible}/${slug}.json`);
  n++;
}
console.log(`${n} fichier(s) mis de côté dans ${cible}`);
