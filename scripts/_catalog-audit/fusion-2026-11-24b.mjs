#!/usr/bin/env node
// Fusion de deux doublons trouvés par les h1 identiques (24/11/2026, scripts/_seo/corrige-h1-defauts.mjs).
//   node scripts/_catalog-audit/fusion-2026-11-24b.mjs           (simulation)
//   node scripts/_catalog-audit/fusion-2026-11-24b.mjs --apply
// 1. romance-femme-ralph-lauren (« Romance Women », 50 impressions) = ralph-lauren-romance (« Romance », 392) :
//    un seul Romance femme, 1998 : fragrantica.com/perfume/Ralph-Lauren/Romance-825.html
// 2. eternity-femme-ck (« Eternity Femme », 6 impressions) = calvin-klein-eternity-femme (166 impressions) :
//    Eternity femme de 1988 : fragrantica.com/perfume/Calvin-Klein/Eternity-257.html
// On garde la fiche qui a le trafic. Les 301 sont dans next.config.ts.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const F = "data/products.json";
const cat = JSON.parse(fs.readFileSync(F, "utf8"));
const bySlug = new Map(cat.products.map((p) => [p.slug, p]));

const FUSIONS = [
  { retire: "romance-femme-ralph-lauren", garde: "ralph-lauren-romance" },
  { retire: "eternity-femme-ck", garde: "calvin-klein-eternity-femme" },
];

let changes = 0;
for (const { retire, garde } of FUSIONS) {
  if (!bySlug.has(retire)) { console.log("déjà retiré :", retire); continue; }
  for (const p of cat.products) {
    if (p.slug === retire || !p.related.includes(retire)) continue;
    const avant = p.related.join(",");
    let rel = p.related.map((r) => (r === retire ? garde : r));
    rel = [...new Set(rel)].filter((r) => r !== p.slug);
    // Compléter à 3 avec un parfum de la même maison si la fusion a fait un doublon
    if (rel.length < 3) {
      const sub = cat.products.find((x) => x.brandSlug === p.brandSlug && x.slug !== p.slug && x.slug !== retire && !rel.includes(x.slug) && x.inStock);
      if (sub) rel.push(sub.slug);
    }
    p.related = rel;
    console.log(`related ${p.slug} : ${avant} → ${rel.join(",")}`);
    changes++;
  }
  cat.products = cat.products.filter((p) => p.slug !== retire);
  console.log(`retiré ${retire} (301 → ${garde})`);
  changes++;
}
console.log(`${changes} changements, ${cat.products.length} produits`);
if (APPLY) { fs.writeFileSync(F, JSON.stringify(cat, null, 2) + "\n"); console.log("écrit", F); }
else console.log("simulation : relancer avec --apply");
