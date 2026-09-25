#!/usr/bin/env node
// Note la qualité des descriptions de products.json pour cibler la réécriture.
// Les anciennes descriptions ont été générées par assemblage de phrases types : elles se
// reconnaissent à la répétition du nom du produit et à une poignée de tournures récurrentes.
import fs from "fs";

const produits = JSON.parse(fs.readFileSync("./data/products.json", "utf8")).products;

// Tournures relevées dans les fiches d'origine, chacune vue sur plusieurs dizaines de produits.
const TOURNURES = [
  "positionnement tarifaire",
  "pièce maîtresse d'une collection",
  "parfum d'appoint",
  "reste parfaitement lisible",
  "période de port privilégiée",
  "la construction olfactive révèle toute sa richesse",
  "fonctionne dans des contextes très variés",
  "sans jamais sembler décalé",
  "s'adresse aux amateurs qui acceptent de payer le prix juste",
  "sans chercher à transiger sur la qualité",
  "plaît naturellement à un public algérien",
  "des bakhours familiaux aux parfums des fêtes religieuses",
  "avec cette rare capacité à ne pas s'effondrer",
  "trouve son public et son efficacité maximale",
  "hors de cette plage, le rendu change sensiblement",
  "les contextes où la tradition olfactive méditerranéenne est célébrée",
  "il est grand temps de la découvrir",
  "une fragrance qui dure",
];

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "");

const notes = produits.map((p) => {
  const d = p.description || "";
  const plat = norm(d);
  const mots = d.split(/\s+/).filter(Boolean).length;

  // combien de fois le nom du produit revient dans le texte
  const nom = norm(p.name);
  let repetitions = 0;
  if (nom.length > 2) {
    let i = plat.indexOf(nom);
    while (i !== -1) { repetitions++; i = plat.indexOf(nom, i + nom.length); }
  }

  const tournures = TOURNURES.filter((t) => plat.includes(norm(t)));
  const paragraphes = d.split(/\n{2,}/).filter((x) => x.trim()).length;

  // Score : plus il est haut, plus la fiche a besoin d'être réécrite.
  let score = 0;
  score += tournures.length * 3;
  score += Math.max(0, repetitions - 3) * 2;      // 3 mentions du nom, ça passe ; au-delà ça pique
  if (paragraphes < 2) score += 2;                 // un seul bloc de texte
  if (mots < 180) score += 2;

  return { slug: p.slug, marque: p.brand, nom: p.name, mots, repetitions, paragraphes, tournures: tournures.length, score };
});

notes.sort((a, b) => b.score - a.score);
fs.writeFileSync("./scripts/_catalog-audit/notes-descriptions.json", JSON.stringify(notes, null, 1));

const tranches = { "à refaire (score >= 8)": 0, "à revoir (4-7)": 0, "acceptable (1-3)": 0, "propre (0)": 0 };
notes.forEach((n) => {
  if (n.score >= 8) tranches["à refaire (score >= 8)"]++;
  else if (n.score >= 4) tranches["à revoir (4-7)"]++;
  else if (n.score >= 1) tranches["acceptable (1-3)"]++;
  else tranches["propre (0)"]++;
});
console.log("qualité des " + notes.length + " descriptions :");
Object.entries(tranches).forEach(([k, v]) => console.log("   " + String(v).padStart(4) + "  " + k));
console.log("\nun seul bloc de texte (pas de paragraphes) : " + notes.filter((n) => n.paragraphes < 2).length);
console.log("nom du produit répété plus de 5 fois        : " + notes.filter((n) => n.repetitions > 5).length);
console.log("\n10 pires :");
notes.slice(0, 10).forEach((n) => console.log(`   ${String(n.score).padStart(3)}  ${n.slug.padEnd(38)} ${n.mots} mots, nom x${n.repetitions}, ${n.tournures} tournures types`));
