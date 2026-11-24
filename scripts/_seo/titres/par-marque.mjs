#!/usr/bin/env node
// Tous les titres déjà rédigés d'une ou plusieurs marques, pour contrôler la cohérence entre lots
// (base et déclinaisons, tête unique, même forme de marque).
//   node scripts/_seo/titres/par-marque.mjs dior chanel
import fs from "fs";

const D = "scripts/_seo/titres";
const cat = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const titres = new Map();
for (const f of fs.readdirSync(`${D}/sorties`).filter((f) => f.endsWith(".json")))
  for (const x of JSON.parse(fs.readFileSync(`${D}/sorties/${f}`, "utf8"))) titres.set(x.chemin, { titre: x.titre, lot: f.replace(".json", "") });
const imp = new Map();
for (const f of fs.readdirSync(`${D}/dossiers`).filter((f) => /^lot-\d+\.json$/.test(f)))
  for (const d of JSON.parse(fs.readFileSync(`${D}/dossiers/${f}`, "utf8"))) imp.set(d.chemin, d.gsc.imp || 0);

for (const slug of process.argv.slice(2)) {
  const b = cat.brands.find((x) => x.slug === slug);
  if (!b) { console.log(`marque inconnue : ${slug}`); continue; }
  console.log(`\n=== ${b.name} (${slug})`);
  for (const c of [`/marques/${slug}`, `/parfums-homme/${slug}`, `/parfums-femme/${slug}`, `/parfums-orientaux/${slug}`]) {
    const t = titres.get(c);
    if (t) console.log(`${c}  [${t.lot}]  « ${t.titre} »`);
  }
  const ps = cat.products.filter((p) => p.brandSlug === slug).sort((x, y) => x.name.localeCompare(y.name));
  for (const p of ps) {
    const c = `/parfums/${p.slug}`;
    const t = titres.get(c);
    console.log(`${c}  | ${p.name} | ${p.concentration} ${p.volume || "?"} ${p.gender}${p.inStock ? "" : " RUPTURE"} | ${imp.get(c) || 0} imp | ${t ? `[${t.lot}] « ${t.titre} »` : "(pas encore de titre)"}`);
  }
}
