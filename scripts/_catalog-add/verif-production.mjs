#!/usr/bin/env node
// Contrôle de production après un ajout au catalogue, une fois Vercel redéployé.
//
// Vérifie deux choses que l'audit local ne peut pas voir :
//   1. chaque page répond bien 200 en ligne ;
//   2. chaque page figure au sitemap (règle n°3 dans l'autre sens : une page absente du
//      sitemap est invisible de Google même si elle répond 200).
//
// Il insiste sur les **pages marque filtrées** (`/parfums-homme/<marque>`), et pas seulement
// sur les fiches : c'est là qu'est le piège de la règle n°2. Une page marque dont le genre
// n'est pas couvert par `generateStaticParams` répond 200 à la demande, mais n'est ni
// pré-générée ni au sitemap — elle existe sans exister. Dix-sept marques homme et treize
// marques femme sont restées dans cet état, dont Lattafa, première marque en clics.
//
// Les fiches sont échantillonnées (60 réparties dans le lot), les pages marque non :
// elles sont bien moins nombreuses et c'est sur elles que porte le risque.
//
// Usage : node scripts/_catalog-add/verif-production.mjs
import fs from "fs";

const BASE = "https://maisonnumidia.store";
const produits = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const prov = JSON.parse(fs.readFileSync("./scripts/_catalog-add/provenance.json", "utf8"));
const nouveaux = prov.map((p) => p.slug).filter((s) => produits.products.some((x) => x.slug === s));

const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const dansSitemap = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, "")));

const marques = new Set();
for (const s of nouveaux) {
  const p = produits.products.find((x) => x.slug === s);
  if (!p) continue;
  if (p.gender === "homme" || p.gender === "unisexe") marques.add(`parfums-homme/${p.brandSlug}`);
  if (p.gender === "femme" || p.gender === "unisexe") marques.add(`parfums-femme/${p.brandSlug}`);
  if (p.category === "parfums-orientaux") marques.add(`parfums-orientaux/${p.brandSlug}`);
}

const pas = Math.max(1, Math.floor(nouveaux.length / 60));
const cibles = [
  ...nouveaux.filter((_, i) => i % pas === 0).slice(0, 60).map((s) => `parfums/${s}`),
  ...marques,
];
console.log(`${cibles.length} URLs a verifier (60 fiches echantillonnees sur ${nouveaux.length} + ${marques.size} pages marque)`);

const pb = [];
let faits = 0;
const file = [...cibles];
async function ouvrier() {
  while (file.length) {
    const chemin = file.pop();
    const url = `${BASE}/${chemin}`;
    let st = "ERR";
    try { st = (await fetch(url, { method: "HEAD", redirect: "manual" })).status; } catch (e) { st = "ERR"; }
    if (st !== 200) pb.push(`HTTP ${st} : ${url}`);
    if (!dansSitemap.has(url)) pb.push(`absente du sitemap : ${url}`);
    if (++faits % 50 === 0) console.log(`  ${faits}/${cibles.length}`);
  }
}
await Promise.all(Array.from({ length: 12 }, ouvrier));

console.log(pb.length ? `\n${pb.length} PROBLEMES :` : "\n0 probleme — tout repond 200 et figure au sitemap");
pb.slice(0, 40).forEach((x) => console.log("  ! " + x));
