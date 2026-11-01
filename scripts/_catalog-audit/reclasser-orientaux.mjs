#!/usr/bin/env node
// Reclasse les fiches publiées en "parfums-orientaux" par erreur.
// SIMULATION par défaut, --apply pour écrire data/products.json.
//
// Jusqu'au 31/10/2026, build-fiches.mjs classait oriental tout parfum dont la famille ou les
// notes contenaient « ambre gris ». C'est une note marine qu'on trouve au fond de quantité de
// parfums frais de créateur : Louis Vuitton Afternoon Swim (hespéridé) ou Parfums de Marly
// Perseus se sont retrouvés chez les orientaux. Ce script applique la règle corrigée
// (même logique que categorieDe dans scripts/_catalog-add/build-fiches.mjs) aux fiches
// publiées, en laissant de côté celles que la famille désigne quand même comme orientales.
//
// Il liste aussi les pages /parfums-orientaux/<marque> qui disparaîtraient (plus aucun
// produit oriental pour la marque) : chacune doit recevoir une 301 dans next.config.ts.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const CHEMIN = "./data/products.json";
const raw = fs.readFileSync(CHEMIN, "utf8");
const catalogue = JSON.parse(raw);

const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const MAISONS_ORIENTALES = new Set(["lattafa", "al haramain", "swiss arabian", "rasasi", "ajmal", "afnan",
  "orientica", "al rehab", "el nabil", "arabian oud", "armaf", "zimaya", "assaf", "khadlaj", "ard al zaafaran",
  "maison alhambra", "french avenue", "paris corner", "bharara", "asdaaf", "nusuk", "surrati"]);
const MOTS_ORIENTAUX = ["oud", "oudh", "agarwood", "encens", "myrrhe", "bakhoor", "attar"];
// La famille Fragrantica peut désigner un oriental sans aucune des matières ci-dessus
// (« Oriental Ambré », « Floral Oriental ») : ces fiches restent où elles sont.
const FAMILLE_ORIENTALE = ["oriental", "ambre", "ambré"];
const FAMILLE_FEMININE = ["floral", "fruite", "gourmand", "poudre", "vanille"];
const mot = (texte, m) => new RegExp(`(^|[^a-z0-9])${m}([^a-z0-9]|$)`).test(texte);
// Relues une à une le 31/10/2026 : la famille du catalogue ne dit pas oriental, mais le parfum
// l'est par son nom ou son style. Dans le doute, on ne déplace pas une page déjà indexée.
const EXCLUSIONS = {
  "guerlain-les-absolus-d-orient-encens-mythique": "collection Les Absolus d'Orient, encens dans le nom",
  "acqua-di-parma-ambra": "Ambra : un ambré",
  "nishane-ambra-calabria": "Ambra : un ambré",
  "ysl-tuxedo": "Tuxedo (Le Vestiaire) : patchouli, vanille, ambre, un oriental épicé",
  "roja-dove-apex": "cuir sombre et épicé, classement incertain",
  "xerjoff-erba-pura": "fruité musqué ambré, classement incertain",
  "amouage-guidance": "floral ambré, classement incertain",
  "vertus-chaos": "boisé ambré, classement incertain",
};

const aReclasser = [];
const gardees = [];
for (const p of catalogue.products) {
  if (p.category !== "parfums-orientaux") continue;
  if (MAISONS_ORIENTALES.has(norm(p.brand)) || MAISONS_ORIENTALES.has(p.brandSlug.replace(/-/g, " "))) continue;
  const notes = [...(p.notes.top || []), ...(p.notes.heart || []), ...(p.notes.base || [])];
  const texte = norm(p.family + " " + notes.join(" "));
  if (MOTS_ORIENTAUX.some((m) => mot(texte, m))) continue;
  if (FAMILLE_ORIENTALE.some((m) => norm(p.family).includes(norm(m)))) { gardees.push(p); continue; }
  if (EXCLUSIONS[p.slug]) { gardees.push({ ...p, family: p.family + " — " + EXCLUSIONS[p.slug] }); continue; }
  const cible = p.gender === "homme" ? "parfums-homme" : p.gender === "femme" ? "parfums-femme"
    : FAMILLE_FEMININE.some((f) => norm(p.family).includes(f)) ? "parfums-femme" : "parfums-homme";
  aReclasser.push({ p, cible });
}

// Pages marque orientales qui n'auraient plus de produit.
const slugsReclasses = new Set(aReclasser.map((x) => x.p.slug));
const orientalesAvant = new Set(catalogue.products.filter((p) => p.category === "parfums-orientaux").map((p) => p.brandSlug));
const orientalesApres = new Set(catalogue.products
  .filter((p) => p.category === "parfums-orientaux" && !slugsReclasses.has(p.slug)).map((p) => p.brandSlug));
const disparues = [...orientalesAvant].filter((b) => !orientalesApres.has(b));

// Search Console (16 mois, scripts/_gsc/data/pages.json) : ce que pèsent ces URL.
const gsc = new Map();
if (fs.existsSync("./scripts/_gsc/data/pages.json")) {
  for (const l of JSON.parse(fs.readFileSync("./scripts/_gsc/data/pages.json", "utf8"))) {
    gsc.set(l.keys[0].replace("https://maisonnumidia.store", ""), l);
  }
}
const poids = (url) => { const l = gsc.get(url); return l ? `${l.impressions} imp., ${l.clicks} clics` : "aucune impression"; };

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${aReclasser.length} fiches à reclasser, ${gardees.length} laissées en oriental (famille orientale)\n`);
for (const { p, cible } of aReclasser) {
  console.log(`  ${p.slug.padEnd(48)} ${p.gender.padEnd(8)} ${p.family.padEnd(28)} -> ${cible}`);
}
if (gardees.length) {
  console.log("\nlaissées en oriental :");
  gardees.forEach((p) => console.log(`  ${p.slug.padEnd(48)} ${p.family}`));
}
console.log(`\npages /parfums-orientaux/<marque> qui disparaissent : ${disparues.length}`);
const redirections = [];
for (const b of disparues) {
  // Destination : la page marque filtrée qui porte désormais ces parfums, sinon la page marque.
  const genres = new Set(aReclasser.filter((x) => x.p.brandSlug === b).map((x) => x.p.gender));
  const dest = genres.has("homme") && !genres.has("femme") ? `/parfums-homme/${b}`
    : genres.has("femme") && !genres.has("homme") ? `/parfums-femme/${b}` : `/marques/${b}`;
  redirections.push({ source: `/parfums-orientaux/${b}`, destination: dest });
  console.log(`  /parfums-orientaux/${b.padEnd(28)} (${poids(`/parfums-orientaux/${b}`)}) -> ${dest}`);
}
fs.writeFileSync("./scripts/_catalog-audit/reclasser-orientaux-redirections.json", JSON.stringify(redirections, null, 1));

if (APPLY) {
  for (const { p, cible } of aReclasser) { p.category = cible; p.isOriental = false; }
  fs.writeFileSync(CHEMIN, JSON.stringify(catalogue, null, 2) + (raw.endsWith("\n") ? "\n" : ""));
  console.log("\ndata/products.json écrit. Redirections à ajouter : scripts/_catalog-audit/reclasser-orientaux-redirections.json");
}
