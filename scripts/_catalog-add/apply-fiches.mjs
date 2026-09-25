#!/usr/bin/env node
// Injecte les fiches validées (scripts/_catalog-add/fiches.json) dans data/products.json.
// SIMULATION par défaut, --apply pour écrire.
// Refuse tout le lot si une fiche est incomplète : mieux vaut ne rien ajouter qu'ajouter
// une fiche cassée au milieu de 700 bonnes.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const fiches = JSON.parse(fs.readFileSync("./scripts/_catalog-add/fiches.json", "utf8"));
const slugs = new Set(catalogue.products.map((p) => p.slug));
const marques = new Set(catalogue.brands.map((b) => b.slug));

const CHAMPS = ["id", "slug", "name", "h1", "brand", "brandSlug", "gender", "category", "family",
  "concentration", "volume", "price", "originalPrice", "shortDescription", "description", "notes",
  "occasions", "seasons", "longevity", "sillage", "image", "inStock", "featured", "badge",
  "isOriental", "related"];

// Une fiche dont le texte n'est pas encore écrit ou dont l'image n'est pas encore
// téléchargée n'est pas en erreur : elle n'est pas prête. On la laisse pour la vague
// suivante. Tout le reste (champ manquant, slug déjà pris, marque orpheline, related
// incomplet) bloque le lot entier : une fiche cassée au milieu de 700 bonnes coûte cher.
// check-fiches.mjs a deja passe le lot au crible (longueur, formules interdites, note citee
// hors pyramide…). On ne republie pas ici ce qu'il a recale : la fiche attend une reprise.
const recales = new Map();
if (fs.existsSync("./scripts/_catalog-add/check-fiches.json")) {
  for (const x of JSON.parse(fs.readFileSync("./scripts/_catalog-add/check-fiches.json", "utf8"))) {
    recales.set(x.slug, x.pb.join(" | "));
  }
}

const enAttente = [];
const pretes = [];
for (const f of fiches) {
  if (!f.description || !f.shortDescription) { enAttente.push([f.slug, "texte pas encore rédigé"]); continue; }
  if (!fs.existsSync("./public/images/products/" + f.slug + ".jpg")) { enAttente.push([f.slug, "image pas encore téléchargée"]); continue; }
  if (recales.has(f.slug)) { enAttente.push([f.slug, "recalé au contrôle : " + recales.get(f.slug)]); continue; }
  pretes.push(f);
}

const erreurs = [];
for (const f of pretes) {
  for (const c of CHAMPS) if (f[c] === undefined) erreurs.push(`${f.slug} : champ manquant ${c}`);
  if (slugs.has(f.slug)) erreurs.push(`${f.slug} : slug déjà présent`);
  if (!marques.has(f.brandSlug)) erreurs.push(`${f.slug} : marque ${f.brandSlug} absente de brands[]`);
  if ((f.related || []).length < 3) erreurs.push(`${f.slug} : related < 3`);
}
if (erreurs.length) {
  console.log("LOT REFUSÉ — " + erreurs.length + " problèmes :");
  erreurs.slice(0, 20).forEach((e) => console.log("  " + e));
  process.exit(1);
}

const propres = pretes.map((f) => {
  const o = {};
  for (const c of CHAMPS) o[c] = f[c];
  return o;
});

console.log((APPLY ? "APPLIQUÉ" : "SIMULATION") + " — " + propres.length + " fiches ajoutées, catalogue " +
  catalogue.products.length + " -> " + (catalogue.products.length + propres.length));
if (enAttente.length) console.log("pas encore prêtes (vague suivante) : " + enAttente.length + " — " + [...new Set(enAttente.map((x) => x[1]))].join(", "));
const parCat = {};
propres.forEach((f) => (parCat[f.category] = (parCat[f.category] || 0) + 1));
console.log("par catégorie :", parCat);

if (APPLY) {
  catalogue.products.push(...propres);
  fs.writeFileSync("./data/products.json", JSON.stringify(catalogue, null, 2) + "\n");
  // Traçabilité : d'où vient chaque fiche (URL Fragrantica, ID image, nb de boutiques algériennes).
  const ancienne = fs.existsSync("./scripts/_catalog-add/provenance.json")
    ? JSON.parse(fs.readFileSync("./scripts/_catalog-add/provenance.json", "utf8")) : [];
  const provenance = ancienne.concat(pretes.map((f) => ({ slug: f.slug, ...f._source })));
  fs.writeFileSync("./scripts/_catalog-add/provenance.json", JSON.stringify(provenance, null, 1));
  console.log("provenance écrite dans scripts/_catalog-add/provenance.json");
}
