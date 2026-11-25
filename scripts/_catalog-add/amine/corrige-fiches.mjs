#!/usr/bin/env node
// Corrections du lot « stock Amine » après build-fiches.mjs (25/11/2026), à relancer après chaque
// montage : noms mal nettoyés, h1 en double, et deux fiches que build-fiches écarte à tort comme
// doublons (même nom que la fiche d'une autre version).
//   node scripts/_catalog-add/amine/corrige-fiches.mjs
// Réécrit fiches.json et textes-todo.json du lot.
import fs from "fs";

const D = "./scripts/_catalog-add/amine/";
const fiches = JSON.parse(fs.readFileSync(D + "fiches.json", "utf8"));
const lire = (f) => JSON.parse(fs.readFileSync(D + f, "utf8"));
const par = new Map(fiches.map((f) => [f.slug, f]));

function renomme(ancien, slug, champs) {
  const f = par.get(ancien);
  if (!f) return;
  Object.assign(f, { id: slug, slug, image: `/images/products/${slug}.jpg`, ...champs });
  par.delete(ancien); par.set(slug, f);
}
// Noms que le nettoyage a abîmés
renomme("gucci", "gucci-by-gucci", { name: "Gucci by Gucci", h1: "Gucci by Gucci Parfum Femme Algérie" });
renomme("chanel-cristalle-2023", "chanel-cristalle-eau-de-parfum", { name: "Cristalle Eau de Parfum", h1: "Chanel Cristalle Eau de Parfum Femme Algérie" });
const ox = par.get("lanvin-oxygene-homme");
if (ox) Object.assign(ox, { name: "Oxygène Homme", h1: "Lanvin Oxygène Homme Parfum Homme Algérie" });
// h1 qui doubleraient celui d'une autre version (règle : la version porte son mot distinctif)
const h1 = {
  "jean-paul-gaultier-scandal-pour-homme": "Jean Paul Gaultier Scandal Pour Homme Eau de Toilette Homme Algérie",
  "davidoff-cool-water-parfum": "Davidoff Cool Water Parfum Homme Algérie",
  "armani-emporio-stronger-with-you-parfum": "Emporio Armani Stronger With You Parfum Homme Algérie",
  "calvin-klein-eternity-parfum-for-men": "Calvin Klein Eternity Parfum For Men Homme Algérie",
  "mercedes-benz-le-parfum": "Mercedes-Benz Le Parfum Homme Algérie",
};
for (const [s, h] of Object.entries(h1)) if (par.has(s)) par.get(s).h1 = h;
// Mots en double laissés par le gabarit (« Parfum Parfum »)
for (const f of par.values()) f.h1 = f.h1.replace(/\bParfum Parfum\b/g, "Parfum").replace(/\s{2,}/g, " ");

// Deux fiches écartées à tort par build-fiches : on les monte sur le modèle d'une fiche du lot
function ajoute(slugCandidat, slug, champs) {
  if (par.has(slug)) return;
  const r = lire("research/" + slugCandidat + ".json");
  const c = lire("candidates.json").find((x) => x.slug === slugCandidat);
  const modele = [...par.values()].find((x) => x.gender === champs.gender) || [...par.values()][0];
  par.set(slug, {
    ...structuredClone(modele), id: slug, slug, image: `/images/products/${slug}.jpg`,
    notes: r.notes, family: r.famille, concentration: r.concentrationConfirmee, volume: c.volume, price: c.prix,
    shortDescription: null, description: null, inStock: true, featured: false, badge: null, isOriental: false, related: [],
    _source: { fragrantica: r.fragrantica.url, fragranticaId: r.fragrantica.id, boutiques: c.nbBoutiques, slugCandidat },
    ...champs,
  });
}
ajoute("kenzo-homme-edp", "kenzo-homme-eau-de-parfum", {
  name: "Kenzo Homme Eau de Parfum", h1: "Kenzo Homme Eau de Parfum Algérie", brand: "Kenzo", brandSlug: "kenzo",
  gender: "homme", category: "parfums-homme", occasions: ["Bureau", "Soirée"], seasons: ["Printemps", "Automne"], longevity: 4, sillage: 4,
  related: ["kenzo-homme", "kenzo-homme-indigo", "kenzo-homme-santal-marin"],
});
ajoute("antonio-banderas-blue-seduction-for-women", "antonio-banderas-blue-seduction-for-women", {
  name: "Blue Seduction for Women", h1: "Antonio Banderas Blue Seduction for Women Parfum Femme Algérie", brand: "Antonio Banderas", brandSlug: "antonio-banderas",
  gender: "femme", category: "parfums-femme", occasions: ["Journée", "Bureau"], seasons: ["Printemps", "Été"], longevity: 3, sillage: 3,
  related: ["antonio-banderas-blue-seduction", "lacoste-touch-of-pink", "cacharel-noa"],
});

const cat = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const existants = new Set(cat.products.map((p) => p.slug));
const out = [...par.values()];
for (const f of out) f.related = f.related.filter((s) => existants.has(s) || par.has(s));
const h1s = new Map(cat.products.map((p) => [p.h1.toLowerCase(), p.slug]));
for (const f of out) if (h1s.has(f.h1.toLowerCase())) console.log(`⚠ h1 déjà pris par ${h1s.get(f.h1.toLowerCase())} : ${f.slug} « ${f.h1} »`);
for (const f of out) if (f.related.length < 3) console.log(`⚠ related < 3 : ${f.slug}`);
// Les textes sont rédigés sous le slug FINAL (celui de textes-todo.json, écrit après ces corrections) :
// build-fiches ne les trouve pas pour les fiches renommées ou ajoutées ici, on les rattache.
for (const f of out) {
  const t = D + "texts/" + f.slug + ".json";
  if (!f.description && fs.existsSync(t)) {
    const x = JSON.parse(fs.readFileSync(t, "utf8"));
    f.shortDescription = x.shortDescription;
    f.description = x.description;
  }
}
console.log(`${out.filter((f) => f.description).length} fiches avec texte`);
fs.writeFileSync(D + "fiches.json", JSON.stringify(out, null, 1));
fs.writeFileSync(D + "textes-todo.json", JSON.stringify(out.filter((f) => !f.description).map((f) => ({
  slug: f.slug, slugCandidat: f._source.slugCandidat, brand: f.brand, name: f.name, gender: f.gender, concentration: f.concentration,
  volume: f.volume, family: f.family, notes: f.notes, occasions: f.occasions, seasons: f.seasons,
})), null, 1));
console.log(`${out.length} fiches dans le lot`);
