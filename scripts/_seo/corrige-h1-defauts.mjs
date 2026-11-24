#!/usr/bin/env node
// Corrige les h1 de fiche qui ont un défaut visible, sans toucher aux autres (24/11/2026).
//   node scripts/_seo/corrige-h1-defauts.mjs            (simulation : liste avant → après)
//   node scripts/_seo/corrige-h1-defauts.mjs --apply
//
// Gabarit du h1 (CLAUDE.md) : « {Marque} {Nom} Parfum {Genre} Algérie ». Défauts corrigés :
// 1. h1 identique à celui d'une autre fiche (16 paires) : quand une sœur s'appelle « {Nom} Parfum » ou
//    « {Nom} Le Parfum », la version de base prend sa concentration en toutes lettres
//    (« Dior Sauvage Eau de Parfum Homme Algérie ») ; les vrais doublons sont listés à part.
// 2. mots en double : « Femme Femme », « Parfum Parfum » (nom qui finit par Eau de Parfum, Le Parfum…),
//    marque répétée quand le nom est la marque (« Franck Olivier Franck Olivier »).
// 3. « YSL » → « Yves Saint Laurent » (forme tapée : 1 227 impressions contre 699, CLAUDE.md, H1).
// 4. « Unisexe » → « Mixte » (gabarit) ; ponctuation qui n'a rien à faire dans un h1 (— et parenthèses).
// La Search Console a pesé chaque forme de marque : ce script ne change aucune autre marque.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const F = "data/products.json";
const cat = JSON.parse(fs.readFileSync(F, "utf8"));
const P = cat.products;
const GENRE = { homme: "Homme", femme: "Femme", unisexe: "Mixte" };
const CONC_LONGUE = { EDP: "Eau de Parfum", EDT: "Eau de Toilette", Cologne: "Eau de Cologne", "Extrait de Parfum": "Extrait de Parfum" };
const sansAccent = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const racine = (n) => sansAccent(n).replace(/\s+(le\s+)?parfum$/i, "").trim();

const changes = [];
const nouveau = new Map(P.map((p) => [p.slug, p.h1]));

for (const p of P) {
  let h = p.h1;
  // 3. YSL
  h = h.replace(/\bYSL\b/g, "Yves Saint Laurent").replace(/(Yves Saint Laurent)(.*)\1/, "$1$2").trim();
  if (/^(.+?) Yves Saint Laurent (Parfum|Homme|Femme)/.test(h) && !h.startsWith("Yves Saint Laurent")) {
    // « Libre Yves Saint Laurent Parfum Femme » → « Yves Saint Laurent Libre Parfum Femme » (ordre du gabarit)
    h = h.replace(/^(.+?) Yves Saint Laurent (?=Parfum|Homme|Femme)/, "Yves Saint Laurent $1 ");
  }
  // 4. Unisexe, ponctuation
  h = h.replace(/\bUnisexe\b/g, "Mixte").replace(/\s*[—–]\s*/g, " ").replace(/[()]/g, "").replace(/\s{2,}/g, " ");
  // 2. mots en double
  h = h.replace(/\b(Femme|Homme|Mixte) \1\b/g, "$1");
  h = h.replace(/\b(Eau de Parfum|Eau de Toilette|Le Parfum|Esprit de Parfum|Essence De Parfum|Essence de Parfum|Elixir de Parfum|Absolu de Parfum|Philtre de Parfum|Éclat de Parfum|Nectar de Parfum|Fleur de Parfum|Parfum) Parfum\b/g, "$1");
  if (sansAccent(p.brand) === sansAccent(p.name)) h = h.replace(new RegExp(`^(${p.brand}) \\1\\b`), "$1");
  nouveau.set(p.slug, h);
}

// 1. h1 partagés : la base d'une ligne « … Parfum » prend sa concentration
const parH1 = new Map();
for (const p of P) { const k = sansAccent(nouveau.get(p.slug)); (parH1.get(k) || parH1.set(k, []).get(k)).push(p); }
const doublonsProbables = [];
for (const [, groupe] of parH1) {
  if (groupe.length < 2) continue;
  const variante = groupe.find((p) => /\b(le\s+)?parfum$/i.test(p.name.trim()));
  const base = groupe.find((p) => p !== variante && variante && racine(variante.name) === sansAccent(p.name).trim());
  if (variante && base && CONC_LONGUE[base.concentration]) {
    const g = GENRE[base.gender];
    nouveau.set(base.slug, nouveau.get(base.slug).replace(new RegExp(`\\bParfum ${g} Algérie$`), `${CONC_LONGUE[base.concentration]} ${g} Algérie`));
    continue;
  }
  doublonsProbables.push(groupe.map((p) => `${p.slug} (${p.name}, ${p.concentration} ${p.volume})`).join("  /  "));
}

// Cas que les règles ne savent pas écrire
const A_LA_MAIN = {
  "ysl-elle-shocking": "Yves Saint Laurent Elle Shocking Parfum Femme Algérie", // « Elle (Elle Shocking) »
  "givenchy-eau-de-2018": "Givenchy Eau de Givenchy 2018 Parfum Mixte Algérie", // nom tronqué « Eau de (2018) »
  "dolce-gabbana-k": "Dolce & Gabbana K Eau de Toilette Homme Algérie", // sœur « K Parfum », nom « K by Dolce & Gabbana »
};
for (const [s, h] of Object.entries(A_LA_MAIN)) nouveau.set(s, h);

for (const p of P) {
  const h = nouveau.get(p.slug);
  if (h !== p.h1) { changes.push(`${p.slug}\n    ${p.h1}\n  → ${h}`); if (APPLY) p.h1 = h; }
}
console.log(changes.join("\n"));
console.log(`\n${changes.length} h1 modifiés`);
const restants = [...new Map(P.map((p) => [sansAccent(nouveau.get(p.slug)), 0]))].length;
console.log(`h1 distincts après correction : ${restants} sur ${P.length}`);
if (doublonsProbables.length) console.log(`\nh1 encore partagés (doublons probables, à vérifier sur Fragrantica) :\n  ${doublonsProbables.join("\n  ")}`);
if (APPLY) { fs.writeFileSync(F, JSON.stringify(cat, null, 2) + "\n"); console.log("écrit", F); }
else console.log("\nsimulation : relancer avec --apply");
