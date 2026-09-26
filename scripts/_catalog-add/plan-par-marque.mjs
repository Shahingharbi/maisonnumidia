#!/usr/bin/env node
// Réorganise la file de la vague 2 par MAISON, et non par rang individuel.
//
// Pourquoi : on ne traitera pas 2 400 parfums d'une traite. Si on s'arrête au milieu d'un
// rang global, on laisse des marques à moitié faites — une page marque avec 3 parfums sur 12,
// et rien qui indique lesquels manquent. En traitant maison par maison, chaque arrêt laisse
// un état lisible : les marques faites sont complètes, les suivantes n'ont pas commencé.
//
// Sortie : candidates-vague2.json réordonné + plan-marques.json (le plan de marche).
import fs from "fs";

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "");

const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const marquesCatalogue = new Map(catalogue.brands.map((b) => [norm(b.name), b.slug]));
const produitsParMarque = new Map();
catalogue.products.forEach((p) => produitsParMarque.set(p.brandSlug, (produitsParMarque.get(p.brandSlug) || 0) + 1));

const candidats = JSON.parse(fs.readFileSync("./scripts/_catalog-add/candidates-vague2.json", "utf8"));
const dejaCherches = new Set(fs.readdirSync("./scripts/_catalog-add/research").map((f) => f.replace(".json", "")));

const groupes = new Map();
for (const c of candidats) {
  const cle = norm(c.marque);
  if (!groupes.has(cle)) {
    const slugCatalogue = marquesCatalogue.get(cle) || null;
    groupes.set(cle, {
      marque: c.marque,
      slugCatalogue,
      auCatalogue: Boolean(slugCatalogue),
      dejaEnLigne: slugCatalogue ? produitsParMarque.get(slugCatalogue) || 0 : 0,
      parfums: [],
    });
  }
  groupes.get(cle).parfums.push(c);
}

for (const g of groupes.values()) {
  // À l'intérieur d'une maison : les mieux attestés d'abord.
  g.parfums.sort((a, b) => b.nbBoutiques - a.nbBoutiques || b.prixReel - a.prixReel);
  g.aFaire = g.parfums.filter((p) => !dejaCherches.has(p.slug)).length;
  g.prixMedian = g.parfums.map((p) => p.prixReel).sort((a, b) => a - b)[Math.floor(g.parfums.length / 2)];
  g.deuxBoutiques = g.parfums.filter((p) => p.nbBoutiques === 2).length;
}

// Ordre des maisons :
//   1. celles déjà au catalogue — leur page existe, chaque ajout la renforce
//   2. parmi elles, celles qui ont le plus de parfums déjà en ligne (maisons installées)
//   3. puis les maisons à créer, les plus fournies d'abord — une page marque avec 20 parfums
//      vaut mieux que vingt pages à un parfum
const plan = [...groupes.values()].sort((a, b) =>
  (b.auCatalogue ? 1 : 0) - (a.auCatalogue ? 1 : 0) ||
  b.dejaEnLigne - a.dejaEnLigne ||
  b.parfums.length - a.parfums.length);

// La file suit le plan : les index sont désormais alignés sur les frontières de maison.
const file = plan.flatMap((g) => g.parfums);
file.forEach((p, i) => (p.rang = i + 1));
fs.writeFileSync("./scripts/_catalog-add/candidates-vague2.json", JSON.stringify(file, null, 1));

let curseur = 0;
const resume = plan.map((g) => {
  const debut = curseur;
  curseur += g.parfums.length;
  return {
    marque: g.marque, slugCatalogue: g.slugCatalogue, auCatalogue: g.auCatalogue,
    dejaEnLigne: g.dejaEnLigne, aAjouter: g.parfums.length, aChercher: g.aFaire,
    deuxBoutiques: g.deuxBoutiques, prixMedian: g.prixMedian,
    indexDebut: debut, indexFin: curseur - 1,
  };
});
fs.writeFileSync("./scripts/_catalog-add/plan-marques.json", JSON.stringify(resume, null, 1));

const auCat = resume.filter((r) => r.auCatalogue);
console.log(`${resume.length} maisons, ${file.length} parfums`);
console.log(`  ${auCat.length} maisons déjà au catalogue : ${auCat.reduce((s, r) => s + r.aAjouter, 0)} parfums`);
console.log(`  ${resume.length - auCat.length} maisons à créer : ${resume.filter((r) => !r.auCatalogue).reduce((s, r) => s + r.aAjouter, 0)} parfums`);
console.log("\n20 premières maisons de la file :");
console.log("maison".padEnd(26) + "en ligne".padStart(9) + "à ajouter".padStart(10) + "à chercher".padStart(11) + "  prix médian" + "   index");
resume.slice(0, 20).forEach((r) =>
  console.log(
    r.marque.slice(0, 25).padEnd(26) +
    String(r.dejaEnLigne).padStart(9) +
    String(r.aAjouter).padStart(10) +
    String(r.aChercher).padStart(11) +
    String(r.prixMedian).padStart(13) + " DA" +
    `  ${r.indexDebut}-${r.indexFin}`
  ));
