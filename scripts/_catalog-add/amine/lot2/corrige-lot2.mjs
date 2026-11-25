#!/usr/bin/env node
// Stock Amine, lot 2 (25/11/2026) : corrections après build-fiches.mjs, à relancer après chaque montage.
//   CATALOG_ADD_DIR=./scripts/_catalog-add/amine/lot2/ node scripts/_catalog-add/build-fiches.mjs
//   node scripts/_catalog-add/amine/lot2/corrige-lot2.mjs
//
// Décisions de Shahin (25/11/2026) :
// - Lacoste L.12.12 Blanc eau de parfum : la boîte ne porte pas « Roland Garros », c'est donc
//   la version standard (fragrantica.com/perfume/Lacoste-Fragrances/L-12-12-Eau-de-Parfum-Blanc-For-Him-65874.html),
//   distincte de l'édition limitée déjà en ligne.
// - Eau Jeune Double Je : vendu au prix du marché, sans le plancher de 6 500 DA, juste au-dessus du
//   prix fournisseur (3 000 DA) : 3 500 DA, inscrit dans data/prix-imposes.json.
// - Les coffrets (Lolita Lempicka Au Masculin, Cerruti 1881 pour Femme) sont ajoutés par
//   ajoute-coffrets.mjs, une fois leur photo et leur composition prouvées.
import fs from "fs";

const D = "./scripts/_catalog-add/amine/lot2/";
const fiches = JSON.parse(fs.readFileSync(D + "fiches.json", "utf8"));
const par = new Map(fiches.map((f) => [f.slug, f]));

function renomme(ancien, slug, champs) {
  const f = par.get(ancien);
  if (!f) return;
  Object.assign(f, { id: slug, slug, image: `/images/products/${slug}.jpg`, ...champs });
  par.delete(ancien); par.set(slug, f);
}
renomme("lacoste-l-12-blanc-for-him", "lacoste-l-12-12-blanc-eau-de-parfum", {
  name: "L.12.12 Blanc Eau de Parfum",
  h1: "Lacoste L.12.12 Blanc Eau de Parfum Homme Algérie",
  related: ["lacoste-l12-blanc", "lacoste-l-12-blanc-eau-fraiche-for-him", "lacoste-l-12-blanc-edition-limitee-roland-garros"],
});
const dj = par.get("eau-jeune-double-je");
if (dj) Object.assign(dj, { name: "Double Je", h1: "Eau Jeune Double Je Parfum Femme Algérie" });

const cat = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const existants = new Set(cat.products.map((p) => p.slug));
const out = [...par.values()];
for (const f of out) f.related = f.related.filter((s) => existants.has(s) || par.has(s));
const h1s = new Map(cat.products.map((p) => [p.h1.toLowerCase(), p.slug]));
for (const f of out) if (h1s.has(f.h1.toLowerCase())) console.log(`⚠ h1 déjà pris par ${h1s.get(f.h1.toLowerCase())} : ${f.slug}`);
for (const f of out) if (f.related.length < 3) console.log(`⚠ related < 3 : ${f.slug}`);
for (const f of out) {
  const t = D + "texts/" + f.slug + ".json";
  if (!f.description && fs.existsSync(t)) {
    const x = JSON.parse(fs.readFileSync(t, "utf8"));
    f.shortDescription = x.shortDescription;
    f.description = x.description;
  }
}
fs.writeFileSync(D + "fiches.json", JSON.stringify(out, null, 1));
console.log(out.map((f) => `${f.slug} | ${f.name} | ${f.h1} | ${f.price} DA | texte ${f.description ? "oui" : "non"}`).join("\n"));
