#!/usr/bin/env node
// Confronte les h1 hors gabarit aux requêtes réelles de leur page.
// Un h1 qui s'écarte du format n'est pas forcément une erreur : « Black Opium YSL » peut
// coller aux recherches mieux que « Yves Saint Laurent Black Opium ». On tranche sur la
// donnée, pas sur la règle.
import fs from "fs";

const produits = JSON.parse(fs.readFileSync("./data/products.json", "utf8")).products;
const rp = JSON.parse(fs.readFileSync("./scripts/_gsc/data/requete-page.json", "utf8"));

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

// requêtes par fiche
const parFiche = new Map();
for (const r of rp) {
  const m = r.keys[1].match(/\/parfums\/([a-z0-9-]+)/);
  if (!m) continue;
  if (!parFiche.has(m[1])) parFiche.set(m[1], []);
  parFiche.get(m[1]).push({ q: norm(r.keys[0]), imp: r.impressions, clics: r.clicks });
}

const G = { homme: "Homme", femme: "Femme", unisexe: "Mixte" };
const gabarit = (p) => `${p.brand} ${p.name} Parfum ${G[p.gender]} Algérie`;

const horsGabarit = produits.filter((p) => norm(p.h1) !== norm(gabarit(p)));

// 1 — marque en forme courte dans le h1 (YSL, Armani) : que tapent les gens ?
console.log("=== FORME DE LA MARQUE : ce que le h1 utilise vs ce qui est tapé\n");
const FORMES = [
  ["YSL", "Yves Saint Laurent", "ysl"],
  ["Armani", "Giorgio Armani", "armani"],
  ["Paco Rabanne", "Rabanne", "paco-rabanne"],
  ["Mont Blanc", "Montblanc", "mont-blanc"],
];
for (const [courte, longue, brandSlug] of FORMES) {
  const fiches = produits.filter((p) => p.brandSlug === brandSlug);
  let impCourte = 0, impLongue = 0, impAucune = 0;
  for (const p of fiches) {
    for (const r of parFiche.get(p.slug) || []) {
      const c = r.q.includes(norm(courte));
      const l = r.q.includes(norm(longue));
      if (l) impLongue += r.imp;
      else if (c) impCourte += r.imp;
      else impAucune += r.imp;
    }
  }
  console.log(`${brandSlug.padEnd(14)} « ${courte} » ${String(impCourte).padStart(6)} imp.  |  « ${longue} » ${String(impLongue).padStart(6)} imp.  |  marque non citée ${String(impAucune).padStart(6)} imp.`);
}

// 2 — h1 qui disent « Parfum Oriental » au lieu du genre
console.log("\n=== h1 EN « PARFUM ORIENTAL » : le mot oriental est-il tapé ?\n");
const orientaux = horsGabarit.filter((p) => /Parfum Oriental/i.test(p.h1 || ""));
let impAvecOriental = 0, impSansOriental = 0, impGenre = 0;
for (const p of orientaux) {
  for (const r of parFiche.get(p.slug) || []) {
    if (r.q.includes("oriental")) impAvecOriental += r.imp;
    else impSansOriental += r.imp;
    if (/\b(homme|femme)\b/.test(r.q)) impGenre += r.imp;
  }
}
console.log(`${orientaux.length} fiches concernées`);
console.log(`  requêtes contenant « oriental » : ${impAvecOriental} impressions`);
console.log(`  requêtes contenant homme/femme  : ${impGenre} impressions`);
console.log(`  autres                          : ${impSansOriental} impressions`);

// 3 — h1 plus court que le nom : est-ce le h1 qui a raison ?
console.log("\n=== h1 PLUS COURT QUE LE NOM DU PRODUIT (top 12 par impressions)\n");
const plusCourt = horsGabarit
  .filter((p) => !norm(p.h1 || "").includes(norm(p.name)))
  .map((p) => {
    const reqs = (parFiche.get(p.slug) || []).sort((a, b) => b.imp - a.imp);
    return { p, imp: reqs.reduce((s, r) => s + r.imp, 0), top: reqs.slice(0, 2) };
  })
  .sort((a, b) => b.imp - a.imp)
  .slice(0, 12);
for (const x of plusCourt) {
  console.log(`  ${String(x.imp).padStart(5)} imp.  ${x.p.slug}`);
  console.log(`         h1  : ${x.p.h1}`);
  console.log(`         nom : ${x.p.name}`);
  console.log(`         tapé: ${x.top.map((r) => `« ${r.q} » ${r.imp}`).join("  |  ") || "aucune requête"}`);
}

// 4 — les cas sans ambiguïté : h1 sans le mot « Parfum » ou sans genre exploitable
const sansParfum = horsGabarit.filter((p) => !/\bParfum\b/i.test(p.h1 || ""));
console.log(`\n=== SANS LE MOT « PARFUM » (correction sûre) : ${sansParfum.length}`);
sansParfum.forEach((p) => console.log(`  ${p.slug} : « ${p.h1} »`));
