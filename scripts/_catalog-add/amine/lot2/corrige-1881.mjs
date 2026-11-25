#!/usr/bin/env node
// Cerruti 1881 pour Femme (fiche en ligne cerruti-1881-femme) : notes, famille et texte corrigés le
// 25/11/2026. La fiche citait pêche et ylang-ylang et se disait « floral fruité » ; la pyramide de
// Fragrantica (fragrantica.com/perfume/Cerruti/1881-327.html, 1995) n'a ni l'un ni l'autre et commence
// par le mimosa. Trouvé par le contre-vérificateur du coffret Cerruti (lot2/recherche/verif-*.json).
// Le texte a été réécrit puis relu par un agent indépendant (lot2/texts/cerruti-1881-femme.json).
//   node scripts/_catalog-add/amine/lot2/corrige-1881.mjs           (simulation)
//   node scripts/_catalog-add/amine/lot2/corrige-1881.mjs --apply
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const F = "./data/products.json";
const cat = JSON.parse(fs.readFileSync(F, "utf8"));
const fige = JSON.parse(fs.readFileSync("./scripts/_catalog-add/amine/lot2/fige-1881.json", "utf8"))[0];
const texte = JSON.parse(fs.readFileSync("./scripts/_catalog-add/amine/lot2/texts/cerruti-1881-femme.json", "utf8"));
const p = cat.products.find((x) => x.slug === "cerruti-1881-femme");
if (!p) throw new Error("fiche absente");

const avant = { family: p.family, notes: JSON.stringify(p.notes) };
p.family = fige.family;
p.notes = fige.notes;
p.shortDescription = texte.shortDescription;
p.description = texte.description;
const plat = (p.shortDescription + " " + p.description).toLowerCase();
for (const interdit of ["pêche", "ylang", "fruité"]) if (plat.includes(interdit)) throw new Error("le nouveau texte cite encore : " + interdit);

console.log("famille :", avant.family, "→", p.family);
console.log("notes   :", avant.notes, "\n       →", JSON.stringify(p.notes));
console.log("texte   :", p.description.split(/\s+/).length, "mots");
if (APPLY) { fs.writeFileSync(F, JSON.stringify(cat, null, 2) + "\n"); console.log("écrit", F); }
else console.log("simulation : --apply pour écrire");
