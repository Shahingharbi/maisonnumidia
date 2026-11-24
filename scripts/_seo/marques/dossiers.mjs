#!/usr/bin/env node
// Dossier par marque pour la rédaction des textes de page marque (plan SEO, action D3).
//   node scripts/_seo/marques/dossiers.mjs dior lattafa ysl …
// Sortie : scripts/_seo/marques/dossiers/<slug>.json — fiches de la marque (avec leurs impressions
// Search Console et leur volume de recherche), requêtes des pages marque et filles.
import fs from "fs";
const R = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const cat = R("data/products.json");
const all = [];
for (const f of fs.readdirSync("scripts/_seo/titres/dossiers").filter((f) => f.startsWith("lot"))) all.push(...R(`scripts/_seo/titres/dossiers/${f}`));
const parChemin = new Map(all.map((d) => [d.chemin, d]));
for (const slug of process.argv.slice(2)) {
  const b = cat.brands.find((x) => x.slug === slug);
  if (!b) { console.log("marque inconnue", slug); continue; }
  const fiches = cat.products.filter((p) => p.brandSlug === slug).map((p) => {
    const d = parChemin.get(`/parfums/${p.slug}`);
    return { slug: p.slug, nom: p.name, conc: p.concentration, volume: p.volume, genre: p.gender, famille: p.family, enStock: p.inStock, prix: p.price,
      notes: p.notes, imp90j: d?.gsc.imp || 0, clics90j: d?.gsc.clics || 0, volumeRecherche: d?.volumeNom?.vol || 0 };
  }).sort((x, y) => y.imp90j + y.volumeRecherche * 3 - (x.imp90j + x.volumeRecherche * 3));
  const pages = [`/marques/${slug}`, `/parfums-homme/${slug}`, `/parfums-femme/${slug}`, `/parfums-orientaux/${slug}`]
    .map((c) => parChemin.get(c)).filter(Boolean).map((d) => ({ chemin: d.chemin, gsc: d.gsc, requetes: d.requetes, motsCles: d.motsCles }));
  fs.writeFileSync(`scripts/_seo/marques/dossiers/${slug}.json`, JSON.stringify({ slug, nom: b.name, origine: b.origin, descriptionActuelle: b.description, nbFiches: fiches.length, pages, fiches }, null, 1));
}
console.log("ok", fs.readdirSync("scripts/_seo/marques/dossiers").length, "dossiers");
