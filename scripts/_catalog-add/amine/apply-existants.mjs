#!/usr/bin/env node
// Stock Amine (25/11/2026) : modifications des fiches DÉJÀ en ligne.
//   node scripts/_catalog-add/amine/apply-existants.mjs           (simulation)
//   node scripts/_catalog-add/amine/apply-existants.mjs --apply
//
// 1. Contenance : 11 fiches passent à la contenance du stock reçu (décision de Shahin). Prix
//    recalculé par candidats.mjs (plan-ml.json, règle de regle-prix.mjs), contenance réécrite dans les
//    textes de la fiche.
// 2. Jimmy Choo Blossom : la fiche disait eau de toilette, mais ses notes sont celles de Blossom 2015,
//    une eau de parfum (fragrantica.com/perfume/Jimmy-Choo/Jimmy-Choo-Blossom-29165.html). Le flacon
//    reçu est l'EDP : on corrige la fiche au lieu d'en créer une deuxième.
// 3. Escada Magnetism : de nouveau en stock.
// 4. h1 des versions de base qu'une nouvelle déclinaison doublerait (même h1 sinon) : la base prend sa
//    concentration en toutes lettres, comme Dior Sauvage le 24/11 (scripts/_seo/corrige-h1-defauts.mjs).
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const F = "./data/products.json";
const cat = JSON.parse(fs.readFileSync(F, "utf8"));
const P = new Map(cat.products.map((p) => [p.slug, p]));
const plan = JSON.parse(fs.readFileSync("./scripts/_catalog-add/amine/plan-ml.json", "utf8"));
const log = [];
const set = (slug, champ, valeur) => {
  const p = P.get(slug);
  if (!p) throw new Error("fiche absente : " + slug);
  if (JSON.stringify(p[champ]) === JSON.stringify(valeur)) return;
  log.push(`${slug}.${champ} : ${JSON.stringify(p[champ]).slice(0, 80)} → ${JSON.stringify(valeur).slice(0, 80)}`);
  p[champ] = valeur;
};

for (const m of plan) {
  const p = P.get(m.slug);
  const ancien = m.ancienVolume.replace(/\D/g, ""), nouveau = m.volume.replace(/\D/g, "");
  const re = new RegExp(`\\b${ancien}\\s?ml\\b`, "gi");
  set(m.slug, "volume", m.volume);
  set(m.slug, "price", m.prix);
  for (const champ of ["shortDescription", "description"]) set(m.slug, champ, p[champ].replace(re, `${nouveau} ml`));
}

const bl = P.get("jimmy-choo-blossom");
set("jimmy-choo-blossom", "concentration", "EDP");
for (const champ of ["shortDescription", "description"]) set("jimmy-choo-blossom", champ, bl[champ].replace(/eau de toilette/gi, "eau de parfum").replace(/\bEDT\b/g, "EDP"));

set("escada-magnetism", "inStock", true);

const H1 = {
  "davidoff-cool-water": "Davidoff Cool Water Eau de Toilette Homme Algérie",
  "kenzo-homme": "Kenzo Homme Eau de Toilette Algérie",
  "chanel-cristalle": "Chanel Cristalle Eau de Toilette Femme Algérie",
  "stronger-with-you-armani": "Armani Stronger With You Eau de Toilette Homme Algérie",
  "eternity-homme-ck": "Calvin Klein Eternity for Men Eau de Toilette Homme Algérie",
};
for (const [s, h] of Object.entries(H1)) set(s, "h1", h);

console.log(log.join("\n"));
console.log(`\n${log.length} changements`);
if (APPLY) { fs.writeFileSync(F, JSON.stringify(cat, null, 2) + "\n"); console.log("écrit", F); }
else console.log("simulation : --apply pour écrire");
