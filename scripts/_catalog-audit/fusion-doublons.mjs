#!/usr/bin/env node
// Fusionne les fiches qui decrivent le MEME parfum sous deux URL, et rend son qualificatif
// au nom des parfums differents qui se retrouvaient homonymes.
// SIMULATION par defaut, --apply pour ecrire.
//
// Deux situations, diagnostiquees sur l'ID Fragrantica de chaque fiche :
//   A. meme ID  -> c'est le meme parfum : on garde l'URL qui recoit le plus de clics et on
//      redirige l'autre en 301 (regle n7). L'URL survivante est choisie sur les donnees
//      Search Console, pas sur l'anciennete du slug.
//   B. ID different mais meme nom -> deux flankers distincts dont le nom a perdu son
//      qualificatif quand on a retire « Eau de Parfum » du nom officiel. On le remet.
//      Le catalogue nomme deja ainsi « Le Male Le Parfum » ou « Bleu de Chanel Parfum ».
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const chemin = "./data/products.json";
const d = JSON.parse(fs.readFileSync(chemin, "utf8"));
const parSlug = new Map(d.products.map((p) => [p.slug, p]));

// A — [a supprimer, a garder]. Survivant choisi sur les clics Search Console.
const FUSIONS = [
  ["dior-blooming-bouquet", "miss-dior-blooming-bouquet"],
  ["hugo-boss-hugo-homme", "hugo-man-hugo-boss"],
  ["lattafa-oud-mood-noir", "lattafa-oud-mood"],
  ["lanvin-eclat-d-arpege", "eclat-arpege-lanvin"],
  ["mugler-innocent", "thierry-mugler-innocent"],
  ["viktor-rolf-bon-bon", "bonbon-viktor-rolf"],
  ["issey-miyake-l-homme-issey", "l-eau-d-issey-homme"],
  ["lancome-la-nuit-tresor-nu", "lancome-la-nuit-tresor-nude"],
  ["ultra-male-jean-paul-gaultier", "jean-paul-gaultier-ultra-male"],
  ["givenchy-gentleman-parfum", "givenchy-gentleman"],
];

// B — nom a completer, d'apres le nom officiel releve par l'audit.
const RENOMMAGES = [
  ["y-ysl-homme", "Y Eau de Parfum"],
  ["hermes-h24-intense", "H24 Eau de Parfum"],
  ["insolence-guerlain", "Insolence Eau de Parfum"],
  ["chanel-chance-eau-tendre", "Chance Eau Tendre Eau de Parfum"],
];

const G = { homme: "Homme", femme: "Femme", unisexe: "Mixte" };

// --- B : renommage
const renommes = [];
for (const [slug, nom] of RENOMMAGES) {
  const p = parSlug.get(slug);
  if (!p || p.name === nom) continue;
  renommes.push([slug, p.name, nom]);
  if (APPLY) {
    p.name = nom;
    p.h1 = `${p.brand} ${nom} Parfum ${G[p.gender]} Algérie`;
  }
}

// --- A : fusion
const aSupprimer = new Set(FUSIONS.map(([mort]) => mort));
const versGarde = new Map(FUSIONS);

// Les related qui pointaient vers une fiche supprimee sont rediriges vers la survivante.
const relationsCorrigees = [];
for (const p of d.products) {
  if (aSupprimer.has(p.slug)) continue;
  const avant = [...(p.related || [])];
  const apres = [...new Set(avant.map((r) => versGarde.get(r) || r))].filter((r) => r !== p.slug);
  if (JSON.stringify(avant) !== JSON.stringify(apres)) {
    relationsCorrigees.push([p.slug, avant.join(","), apres.join(",")]);
    if (APPLY) p.related = apres;
  }
}

const supprimes = d.products.filter((p) => aSupprimer.has(p.slug)).map((p) => `${p.slug} (${p.brand} ${p.name})`);
if (APPLY) {
  d.products = d.products.filter((p) => !aSupprimer.has(p.slug));
  fs.writeFileSync(chemin, JSON.stringify(d, null, 2) + "\n");
}

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"}`);
console.log(`\nnoms complétés (parfums différents devenus homonymes) : ${renommes.length}`);
renommes.forEach(([s, a, b]) => console.log(`  ${s.padEnd(30)} « ${a} » -> « ${b} »`));
console.log(`\nfiches fusionnées (même parfum, deux URL) : ${supprimes.length}`);
FUSIONS.forEach(([mort, vif]) => console.log(`  ${mort.padEnd(32)} -> 301 vers ${vif}`));
console.log(`\nrelated corrigés : ${relationsCorrigees.length}`);

// Les redirections a coller dans next.config.ts (regle n7 : jamais de slug retire sans 301).
const redirections = FUSIONS.map(([mort, vif]) =>
  `      { source: "/parfums/${mort}", destination: "/parfums/${vif}", permanent: true },`).join("\n");
fs.writeFileSync("./scripts/_catalog-audit/redirections-fusion.txt", redirections + "\n");
console.log("\nredirections ecrites dans scripts/_catalog-audit/redirections-fusion.txt");
