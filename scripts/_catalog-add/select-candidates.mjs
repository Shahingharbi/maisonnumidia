#!/usr/bin/env node
// Selectionne et classe les parfums a ajouter au catalogue, depuis la liste
// construite a partir des boutiques algeriennes (scripts/_price-research/add-list/data.js).
// Sortie : scripts/_catalog-add/candidates.json (+ resume des marques manquantes).
// Ne touche jamais data/products.json.
import fs from "fs";

const COMB = new RegExp("[" + String.fromCharCode(0x300) + "-" + String.fromCharCode(0x36f) + "]", "g");
const NONALNUM = new RegExp("[^a-z0-9]+", "g");
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "");
const slugify = (s) => norm(s).replace(NONALNUM, "-").replace(new RegExp("^-+|-+$", "g"), "");
const MOTS_VIDES = new Set(["de", "du", "des", "le", "la", "les", "l", "d", "pour", "eau", "parfum", "toilette", "edp", "edt", "edc", "extrait", "intense", "ml", "by", "the", "et", "a"]);
const cle = (marque, nom) => {
  const t = (slugify(marque) + "-" + slugify(nom)).split("-").filter((x) => x && !MOTS_VIDES.has(x));
  return [...new Set(t)].sort().join("-");
};

global.window = {};
await import("../../scripts/_price-research/add-list/data.js").catch(() => {});
if (!global.window.ADD_ROWS) {
  const src = fs.readFileSync("./scripts/_price-research/add-list/data.js", "utf8");
  new Function("window", src)(global.window);
}
const ROWS = global.window.ADD_ROWS;
const COLS = ["marque", "nom", "concentration", "categorie", "volume", "prixMedian", "prixNous", "nbBoutiques", "boutiques", "aImage", "url", "dejaCatalogue", "slugExistant"];

const cat = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const clesExistantes = new Set(cat.products.map((p) => cle(p.brand, p.name)));
const slugsExistants = new Set(cat.products.map((p) => p.slug));
const marquesExistantes = new Map(cat.brands.map((b) => [norm(b.name), b.slug]));

const vus = new Set();
const candidats = [];
const doublonsInternes = [];
for (const r of ROWS) {
  const o = {};
  COLS.forEach((c, i) => (o[c] = r[i]));
  if (o.dejaCatalogue === 1) continue;
  const k = cle(o.marque, o.nom);
  if (clesExistantes.has(k)) continue;          // deja au catalogue sous un autre libelle
  if (vus.has(k)) { doublonsInternes.push(o.marque + " " + o.nom); continue; }
  vus.add(k);

  // slug : marque-nom, tronque, unique
  let base = slugify(o.marque + " " + o.nom).split("-").filter(Boolean);
  const vues = new Set();
  base = base.filter((t) => (vues.has(t) ? false : vues.add(t)));   // pas de mot repete
  let slug = base.slice(0, 6).join("-");
  let n = 2;
  while (slugsExistants.has(slug) || candidats.some((c) => c.slug === slug)) slug = base.slice(0, 6).join("-") + "-" + n++;

  const marqueSlug = marquesExistantes.get(norm(o.marque)) || slugify(o.marque);
  candidats.push({
    slug,
    marque: o.marque,
    marqueSlug,
    marqueConnue: marquesExistantes.has(norm(o.marque)),
    nom: o.nom,
    concentration: o.concentration || null,
    volume: o.volume || null,
    categorieIndice: o.categorie,
    prix: Math.max(6500, o.prixNous || o.prixMedian || 0),
    nbBoutiques: o.nbBoutiques,
    boutiques: o.boutiques,
    source: o.url,
  });
}

// classement : plus la demande algerienne est large, plus c'est prioritaire ;
// a nombre de boutiques egal, on prefere une marque deja presente (pas de page marque a creer).
candidats.sort((a, b) => b.nbBoutiques - a.nbBoutiques || (b.marqueConnue ? 1 : 0) - (a.marqueConnue ? 1 : 0) || b.prix - a.prix);
candidats.forEach((c, i) => (c.rang = i + 1));

fs.writeFileSync("./scripts/_catalog-add/candidates.json", JSON.stringify(candidats, null, 1));

const parNb = {};
candidats.forEach((c) => { const k = c.nbBoutiques >= 4 ? "4+" : String(c.nbBoutiques); parNb[k] = (parNb[k] || 0) + 1; });
const marquesManquantes = {};
candidats.filter((c) => !c.marqueConnue).forEach((c) => (marquesManquantes[c.marque] = (marquesManquantes[c.marque] || 0) + 1));
const tri = Object.entries(marquesManquantes).sort((a, b) => b[1] - a[1]);

console.log("candidats retenus : " + candidats.length + " (sur " + ROWS.length + " lignes)");
console.log("  ecartes : deja au catalogue par le flag ou par correspondance marque+nom, et " + doublonsInternes.length + " doublons internes a la liste");
console.log("repartition par nb de boutiques :", parNb);
console.log("marques a creer : " + tri.length + " (couvrant " + tri.reduce((s, x) => s + x[1], 0) + " parfums)");
console.log("  top 10 : " + tri.slice(0, 10).map((x) => x[0] + "(" + x[1] + ")").join(", "));
const prio = candidats.filter((c) => c.nbBoutiques >= 3);
console.log("lot prioritaire (>= 3 boutiques) : " + prio.length + " parfums, dont " + prio.filter((c) => c.marqueConnue).length + " sur une marque deja au catalogue");
fs.writeFileSync("./scripts/_catalog-add/brands-missing.json", JSON.stringify(tri.map((x) => ({ marque: x[0], parfums: x[1], slug: slugify(x[0]) })), null, 1));
