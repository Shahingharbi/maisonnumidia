#!/usr/bin/env node
// Retire les fiches de parfums qui n'existent pas (verifies via Fragrantica) et corrige
// la marque de Madawi. SIMULATION par defaut, --apply pour ecrire.
// Les redirections 301 correspondantes sont a ajouter dans next.config.ts (regle n7).
import fs from "fs";
const APPLY = process.argv.includes("--apply");
const FANTOMES = {
  "al-haramain-rose-d-arabie": "doublon de al-haramain-rose-oud (meme parfum Fragrantica 120166, nom Rose d Arabie invente)",
  "franck-olivier-club-night": "aucun Club Night chez Franck Olivier ; l ID utilise etait celui de Night Touch",
  "lattafa-shamoos": "aucun Lattafa Shamoos ; il existe une gamme Shams Al Shamoos en minis 35ml, sans rapport avec la fiche",
};
const d = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const supprimes = new Set(Object.keys(FANTOMES));

// 1. marque de Madawi : Al Haramain -> Arabian Oud (fragrantica.com/perfume/Arabian-Oud/Madawi-51307.html)
const madawi = d.products.find((p) => p.slug === "madawi-al-haramain");
const changeMarque = madawi && madawi.brandSlug !== "arabian-oud";
if (changeMarque) console.log("madawi-al-haramain : marque " + madawi.brand + " -> Arabian Oud (le h1 disait deja Arabian Oud)");
if (changeMarque && APPLY) { madawi.brand = "Arabian Oud"; madawi.brandSlug = "arabian-oud"; }

// 2. related[] qui pointent vers un fantome -> remplace par un produit proche encore vivant
const reparations = [];
for (const p of d.products) {
  if (supprimes.has(p.slug)) continue;
  const casses = p.related.filter((r) => supprimes.has(r));
  if (!casses.length) continue;
  const restants = p.related.filter((r) => !supprimes.has(r));
  const memeGenre = (q) => q.gender === p.gender || q.gender === "unisexe" || p.gender === "unisexe";
  const candidats = d.products.filter((q) =>
    !supprimes.has(q.slug) && q.slug !== p.slug && !restants.includes(q.slug) &&
    (q.brandSlug === p.brandSlug || q.category === p.category) && memeGenre(q) && q.inStock);
  const score = (q) => (q.brandSlug === p.brandSlug ? 2 : 0) + (q.gender === p.gender ? 1 : 0);
  candidats.sort((a, b) => score(b) - score(a) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price));
  const remplacants = candidats.slice(0, casses.length).map((q) => q.slug);
  reparations.push([p.slug, casses.join(","), remplacants.join(",")]);
  if (APPLY) p.related = restants.concat(remplacants);
}

// 3. suppression des fiches fantomes
const avant = d.products.length;
const retires = d.products.filter((p) => supprimes.has(p.slug)).map((p) => p.slug + " (" + p.brand + " " + p.name + ")");
if (APPLY) d.products = d.products.filter((p) => !supprimes.has(p.slug));

console.log((APPLY ? "APPLIQUE" : "SIMULATION") + " — " + retires.length + " fiches retirees sur " + avant);
retires.forEach((x) => console.log("  - " + x + "  [" + FANTOMES[x.split(" ")[0]] + "]"));
console.log("related repares : " + reparations.length);
reparations.forEach((r) => console.log("  " + r[0] + " : " + r[1] + " -> " + r[2]));
if (APPLY) {
  fs.writeFileSync("./data/products.json", JSON.stringify(d, null, 2) + "\n");
  for (const s of supprimes) { const f = "./public/images/products/" + s + ".jpg"; if (fs.existsSync(f)) { fs.unlinkSync(f); console.log("image supprimee : " + s + ".jpg"); } }
}
