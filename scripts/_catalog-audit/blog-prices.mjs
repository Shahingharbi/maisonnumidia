#!/usr/bin/env node
// Remplace les prix écrits en dur dans data/blog.ts par des jetons {{prix:slug}}
// résolus au rendu depuis products.json (cf. lib/blog-content.ts).
// SIMULATION par défaut (affiche les correspondances proposées), --apply pour écrire.
// Une occurrence dont on ne sait pas à quelle fiche elle se rapporte est laissée telle
// quelle et listée : on ne devine pas un prix.
import fs from "fs";

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "").replace(/[^a-z0-9]+/g, " ").trim();
const VIDES = new Set(["de", "du", "des", "le", "la", "les", "l", "d", "pour", "eau", "parfum", "toilette",
  "edp", "edt", "edc", "ml", "by", "the", "et", "a", "en", "algerie", "prix"]);
const toks = (s) => new Set(norm(s).split(" ").filter((x) => x && !VIDES.has(x)));
const jaccard = (A, B) => {
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / new Set([...A, ...B]).size;
};

const produits = JSON.parse(fs.readFileSync("./data/products.json", "utf8")).products;
let src = fs.readFileSync("./data/blog.ts", "utf8");

// Un prix = un nombre à 4-6 chiffres avec séparateurs d'espace, suivi de DA.
const RE = /([0-9](?:[0-9   ]{2,8}))\s*DA/g;

const occurrences = [];
let m;
while ((m = RE.exec(src)) !== null) {
  occurrences.push({ index: m.index, texte: m[0], fin: m.index + m[0].length });
}

// Tous les nombres suivis de DA ne sont pas le prix d'une fiche : une fourchette
// ("pour 8 000 à 12 000 DA"), un ordre de grandeur ("moins de 3 000 DA"), le prix d'une
// contrefaçon ("un dupe à 1 000 DA") ou une cellule de tableau comparatif doivent rester
// du texte. Les transformer en jeton ferait dire à l'article l'inverse de ce qu'il dit.
function estUnPrixDeFiche(src, o) {
  const proche = src.slice(Math.max(0, o.index - 60), o.index);
  const debutLigne = src.lastIndexOf("\n", o.index);
  const ligne = src.slice(debutLigne + 1, src.indexOf("\n", o.fin) === -1 ? o.fin : src.indexOf("\n", o.fin));
  if (/dupe|contrefa|faux/i.test(proche)) return false;
  if (/[0-9][0-9   ]*\s*(?:à|-|–|—)\s*$/.test(proche)) return false;   // fin de fourchette
  if (/(moins de|plus de|budget|entre|<|>)\s*$/i.test(proche)) return false;
  if (ligne.split("|").length >= 3) return false;                                 // ligne de tableau
  return true;
}

const propositions = [];
for (const o of occurrences) {
  if (!estUnPrixDeFiche(src, o)) { o.exclu = true; continue; }
  const avant = src.slice(Math.max(0, o.index - 700), o.index);
  const apres = src.slice(o.fin, o.fin + 200);

  // 1) lien produit le plus proche AVANT le prix, puis juste après (cas "— 10 900 DA" en fin de ligne)
  const liensAvant = [...avant.matchAll(/\/parfums\/([a-z0-9-]+)/g)];
  const liensApres = [...apres.matchAll(/\/parfums\/([a-z0-9-]+)/g)];
  let slug = liensAvant.length ? liensAvant[liensAvant.length - 1][1] : null;
  let via = "lien avant";
  if (!slug && liensApres.length) { slug = liensApres[0][1]; via = "lien après"; }

  // 2) sinon, titre de section "## N. Marque Nom — ..." rapproché des noms de produits
  let titre = null;
  const titres = [...avant.matchAll(/##+\s*(?:\d+\.\s*)?([^\n#]{4,80})/g)];
  if (titres.length) titre = titres[titres.length - 1][1].split("—")[0].trim();
  if (!slug && titre) {
    const t = toks(titre);
    const best = produits
      .map((p) => ({ p, s: jaccard(t, toks(p.brand + " " + p.name)) }))
      .sort((a, b) => b.s - a.s)[0];
    if (best && best.s >= 0.5) { slug = best.p.slug; via = `titre "${titre}" (${best.s.toFixed(2)})`; }
  }

  const produit = slug ? produits.find((p) => p.slug === slug) : null;
  propositions.push({ ...o, slug: produit ? slug : null, via, titre, produit });
}

const trouves = propositions.filter((p) => p.produit);
const perdus = propositions.filter((p) => !p.produit);

console.log(`prix trouvés dans le blog : ${propositions.length}`);
console.log(`  rattachés à une fiche : ${trouves.length}`);
console.log(`  non rattachés (laissés tels quels) : ${perdus.length}`);
console.log("");
for (const p of trouves) {
  const ecart = Math.abs(Number(p.texte.replace(/[^0-9]/g, "")) - p.produit.price);
  const drapeau = ecart > p.produit.price * 0.25 ? " <<< ÉCART FORT" : "";
  console.log(`  ${p.texte.padEnd(12)} -> ${p.slug} (fiche : ${p.produit.price} DA) [${p.via}]${drapeau}`);
}
const exclus = occurrences.filter((o) => o.exclu);
console.log(`\nécartés volontairement (fourchette, ordre de grandeur, dupe, tableau) : ${exclus.length}`);
exclus.forEach((o) => console.log(`  ${o.texte.padEnd(12)} ...${src.slice(Math.max(0, o.index - 75), o.fin + 12).replace(/\s+/g, " ")}...`));
if (perdus.length) {
  console.log("\nnon rattachés à une fiche (laissés tels quels) :");
  perdus.forEach((p) => console.log(`  ${p.texte.padEnd(12)} ...${src.slice(Math.max(0, p.index - 90), p.fin + 12).replace(/\s+/g, " ")}...`));
}

if (process.argv.includes("--apply")) {
  // remplacement de la fin vers le début pour ne pas décaler les index
  for (const p of [...trouves].sort((a, b) => b.index - a.index)) {
    src = src.slice(0, p.index) + `{{prix:${p.slug}}}` + src.slice(p.fin);
  }
  fs.writeFileSync("./data/blog.ts", src);
  console.log(`\nAPPLIQUÉ — ${trouves.length} prix remplacés par des jetons.`);
}
