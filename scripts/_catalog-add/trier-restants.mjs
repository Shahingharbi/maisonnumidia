#!/usr/bin/env node
// Trie les candidats hors lot prioritaire (vus chez 1 ou 2 boutiques algériennes) avant
// de dépenser le moindre agent dessus. Sortie : candidates-vague2.json + un rapport des rejets.
//
// Le lot prioritaire (≥3 boutiques) se suffisait du nombre de boutiques comme preuve de
// sérieux. Ici non : une seule boutique peut vendre n'importe quoi. On a retrouvé dans cette
// liste un fard à joues SHEGLAM, une pince à manucure BETER, un lait solaire Nuxe et des
// formats voyage. Il faut donc filtrer sur la nature du produit, pas seulement sur le prix.
import fs from "fs";

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "");

// 1 — Ce qui n'est pas un parfum. Maquillage, soin, accessoire, capillaire.
const PAS_UN_PARFUM = [
  "fard", "pinceau", "pince ", "pinceau kabuki", "brosse kabuki", "manucure", "vernis", "mascara", "rouge a levres",
  "gloss", "fond de teint", "anticerne", "correcteur", "poudre libre", "blush", "highlighter",
  "lait ", "creme ", "cream", "serum", "masque", "gommage", "demaquillant", "lotion", "baume",
  "shampoing", "shampooing", "apres-shampoing", "gel douche", "savon", "deodorant", "deo ",
  "anti-transpirant", "talc", "spf", "solaire", "huile corps", "body lotion", "body milk",
  "brosse", "peigne", "eponge", "trousse", "pochette", "miroir",
];

// 2 — Formats qui ne sont pas le flacon principal.
const MAUVAIS_FORMAT = [
  "format voyage", "travel", "miniature", "mini ", " mini", "coffret", "set ", " set",
  "recharge", "refill", "vaporisateur de sac", "purse spray", "echantillon", "sample",
  "decant", "rollerball", "roll-on", "roll on", "stick",
];

// 3 — Maisons bas de gamme ou hors sujet repérées dans la liste. Le catalogue a un plancher
//     à 6 500 DA : y faire entrer des parfums vendus 3 500 DA casserait le positionnement.
const MARQUES_ECARTEES = new Set([
  "sheglam", "beter", "milestone", "milestone / le chameau", "secret d orient",
  "eden park", "jeanne en provence", "ritual", "chalou", "eaudace", "yves rocher soins",
]);

const PLANCHER = 6500;

global.window = {};
new Function("window", fs.readFileSync("./scripts/_price-research/add-list/data.js", "utf8"))(global.window);
const COLS = ["marque", "nom", "concentration", "categorie", "volume", "prixMedian", "prixNous",
  "nbBoutiques", "boutiques", "aImage", "url", "dejaCatalogue", "slugExistant"];
const brut = new Map();
for (const r of global.window.ADD_ROWS) {
  const o = {};
  COLS.forEach((k, i) => (o[k] = r[i]));
  brut.set(o.marque + "|" + o.nom, o);
}

const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const marquesCatalogue = new Set(catalogue.brands.map((b) => norm(b.name)));

const candidats = JSON.parse(fs.readFileSync("./scripts/_catalog-add/candidates.json", "utf8"))
  .filter((x) => x.nbBoutiques < 3);

const gardes = [], rejets = [];
for (const c of candidats) {
  const source = brut.get(c.marque + "|" + c.nom);
  const prixReel = source ? source.prixMedian : c.prix;
  // Les mots de cosmetique se cherchent dans le NOM du produit seulement : « Masque Milano »
  // est une maison de parfumerie de niche, pas un soin.
  const t = norm(c.nom);
  const rejeter = (motif) => rejets.push({ ...c, prixReel, motif });

  if (MARQUES_ECARTEES.has(norm(c.marque))) { rejeter("maison écartée (bas de gamme ou hors parfumerie)"); continue; }
  const cosmetique = PAS_UN_PARFUM.find((m) => t.includes(norm(m)));
  if (cosmetique) { rejeter(`ce n'est pas un parfum (« ${cosmetique.trim()} »)`); continue; }
  const format = MAUVAIS_FORMAT.find((m) => t.includes(norm(m)));
  if (format) { rejeter(`format secondaire (« ${format.trim()} »)`); continue; }
  // La contenance manque souvent dans le champ dédié mais figure dans le libellé
  // (« Calvin Klein sheer beauty edt 100 »). On la récupère avant de rejeter la fiche.
  let volume = c.volume;
  if (!volume || !/\d/.test(String(volume))) {
    const trouve = String(c.nom).match(/(\d{2,3})\s*(ml|$)/i);
    volume = trouve ? `${trouve[1]}ml` : null;
  }
  if (!volume) { rejeter("contenance introuvable, ni dans le champ ni dans le libellé"); continue; }
  if (prixReel < PLANCHER) { rejeter(`prix marché sous le plancher de ${PLANCHER} DA`); continue; }
  c.volume = volume;

  gardes.push({ ...c, prixReel, marqueConnue: marquesCatalogue.has(norm(c.marque)) });
}

// Classement : marque déjà au catalogue d'abord (aucune page marque à créer), puis 2 boutiques
// avant 1, puis prix décroissant — un parfum cher est un parfum que la boutique a intérêt à vendre.
gardes.sort((a, b) =>
  (b.marqueConnue ? 1 : 0) - (a.marqueConnue ? 1 : 0) ||
  b.nbBoutiques - a.nbBoutiques ||
  b.prixReel - a.prixReel);
gardes.forEach((g, i) => (g.rang = i + 1));

fs.writeFileSync("./scripts/_catalog-add/candidates-vague2.json", JSON.stringify(gardes, null, 1));
fs.writeFileSync("./scripts/_catalog-add/rejets-vague2.json", JSON.stringify(rejets, null, 1));

console.log(`candidats examinés : ${candidats.length}`);
console.log(`  retenus  : ${gardes.length}`);
console.log(`  écartés  : ${rejets.length}`);
const parMotif = {};
rejets.forEach((r) => { const cle = r.motif.split(" (")[0]; parMotif[cle] = (parMotif[cle] || 0) + 1; });
console.log("\nmotifs de rejet :", parMotif);
console.log("\nexemples de rejets :");
rejets.slice(0, 12).forEach((r) => console.log(`  ${String(r.prixReel).padStart(6)} DA  ${r.marque} — ${r.nom}  [${r.motif}]`));
console.log(`\nretenus : ${gardes.filter((g) => g.marqueConnue).length} sur une marque déjà au catalogue, ${gardes.filter((g) => !g.marqueConnue).length} sur une marque à créer`);
const nouvelles = {};
gardes.filter((g) => !g.marqueConnue).forEach((g) => (nouvelles[g.marque] = (nouvelles[g.marque] || 0) + 1));
console.log(`marques à créer : ${Object.keys(nouvelles).length}`);
console.log("  " + Object.entries(nouvelles).sort((a, b) => b[1] - a[1]).slice(0, 20).map((x) => `${x[0]}(${x[1]})`).join(", "));
