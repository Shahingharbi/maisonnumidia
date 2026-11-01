#!/usr/bin/env node
// Recalcule le prix de chaque candidat avec la règle de prix en vigueur (regle-prix.mjs),
// SANS régénérer la liste.
//
// Pourquoi pas select-candidates.mjs : il reconstruit candidates.json de zéro. Depuis que le
// catalogue a grandi, l'anti-collision des slugs et l'ordre de la liste peuvent changer, alors
// que plus de mille fichiers de recherche (research/<slug>.json) sont indexés par ces slugs et
// que les workflows lisent candidates-vague2.json par index. On ne touche donc qu'au champ prix.
//
// Source du prix marché : la colonne prixMedian de add-list/data.js (médiane des boutiques
// algériennes), retrouvée par marque + nom. À défaut, le prix actuel est supposé suivre
// l'ancienne règle (+3 %) et la médiane en est déduite.
//
// Usage : node scripts/_catalog-add/reprix-candidats.mjs [--apply]
import fs from "fs";
import { prixDeVente } from "../_price-research/regle-prix.mjs";

const APPLY = process.argv.includes("--apply");

global.window = {};
new Function("window", fs.readFileSync("./scripts/_price-research/add-list/data.js", "utf8"))(global.window);
const COLS = ["marque", "nom", "concentration", "categorie", "volume", "prixMedian", "prixNous", "nbBoutiques", "boutiques", "aImage", "url", "dejaCatalogue", "slugExistant"];
const marche = new Map();
for (const r of global.window.ADD_ROWS) {
  const o = Object.fromEntries(COLS.map((k, i) => [k, r[i]]));
  if (o.prixMedian) marche.set(o.marque + "|" + o.nom, o.prixMedian);
}

for (const fichier of ["candidates.json", "candidates-vague2.json"]) {
  const chemin = `./scripts/_catalog-add/${fichier}`;
  const liste = JSON.parse(fs.readFileSync(chemin, "utf8"));
  let viaMarche = 0, viaPrix = 0, change = 0;
  for (const c of liste) {
    const m = marche.get(c.marque + "|" + c.nom);
    const nouveau = m ? prixDeVente(m) : prixDeVente(c.prix / 1.03);
    if (m) viaMarche++; else viaPrix++;
    if (nouveau !== c.prix) change++;
    if (APPLY) c.prix = nouveau;
  }
  if (APPLY) fs.writeFileSync(chemin, JSON.stringify(liste, null, 1));
  console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} ${fichier} : ${liste.length} candidats, ${change} prix changés (médiane du marché : ${viaMarche}, déduite du prix : ${viaPrix})`);
}
