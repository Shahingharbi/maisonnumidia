#!/usr/bin/env node
// Mesure le texte répété d'une fiche produit à l'autre, sur le build local (.next).
//
//   npx next build && node scripts/_seo/mesure-texte-commun.mjs
//
// Chaque fiche est découpée en phrases (en-tête, pied de page et menus exclus). Le nom, la marque
// et le h1 sont remplacés par X et les nombres par N : deux phrases qui ne diffèrent que par là
// comptent comme la même phrase, puisque c'est ainsi qu'un moteur voit un gabarit.
// Sortie : la part de texte présente sur au moins 30 %, 10 % et 3 % des fiches, et les phrases
// qui pèsent le plus. Repère du 21/11/2026, après allègement : 42 % au seuil de 30 %.
import fs from "fs";

const DIR = ".next/server/app/parfums/";
if (!fs.existsSync(DIR)) { console.error("Pas de build : lancer npx next build"); process.exit(1); }
const P = new Map(JSON.parse(fs.readFileSync("data/products.json", "utf8")).products.map((p) => [p.slug, p]));
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".html"));
const PAS = Math.max(1, Math.floor(files.length / 300));

function phrases(f) {
  let h = fs.readFileSync(DIR + f, "utf8").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>|<nav[\s\S]*?<\/nav>/g, " ");
  let t = h.replace(/<[^>]+>/g, "\n").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
  const p = P.get(f.replace(".html", ""));
  if (p) for (const w of [p.brand, p.name, p.h1 || ""].filter(Boolean).sort((a, b) => b.length - a.length)) t = t.split(w).join("X");
  return t.split(/\n|(?<=[.!?])\s+/).map((x) => x.replace(/\s+/g, " ").replace(/\d[\d\s.,]*/g, "N").trim()).filter((x) => x.split(" ").length >= 6);
}

const echantillon = files.filter((_, i) => i % PAS === 0).slice(0, 300);
const freq = new Map();
const toutes = echantillon.map((f) => { const a = phrases(f); for (const x of new Set(a)) freq.set(x, (freq.get(x) || 0) + 1); return a; });
for (const seuil of [0.3, 0.1, 0.03]) {
  let tot = 0, com = 0;
  for (const a of toutes) for (const x of a) { const w = x.split(" ").length; tot += w; if (freq.get(x) >= echantillon.length * seuil) com += w; }
  console.log(`texte présent sur ≥ ${seuil * 100} % des fiches : ${Math.round((com / tot) * 100)} %`);
}
console.log("\nphrases qui pèsent le plus (part des fiches) :");
[...freq].map(([x, c]) => [x, c, c * x.split(" ").length]).filter(([, c]) => c >= echantillon.length * 0.03)
  .sort((a, b) => b[2] - a[2]).slice(0, 20)
  .forEach(([x, c]) => console.log(`${String(Math.round((c / echantillon.length) * 100)).padStart(4)} %  ${x.slice(0, 120)}`));
