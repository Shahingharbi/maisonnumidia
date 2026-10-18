#!/usr/bin/env node
// Applique la marge décidée par Shahin le 18/10/2026, à la place du +3 % en vigueur depuis le
// 15/09 : prix médian du marché +20 % pour les parfums jusqu'à 15 000 DA, +10 % au-dessus.
// Arrondi inchangé (centaine sous 10 000 DA, 500 DA au-dessus, toujours vers le haut),
// plancher 6 500 DA. Les prix de data/prix-imposes.json ne bougent jamais.
//
// Le prix médian de référence :
//  - la médiane fraîche du 06/10 (report-v3.json, niveau A ou B) quand notre prix actuel la
//    suit déjà (règle +3 % à 2,5 % près) : c'est le cas de l'immense majorité ;
//  - sinon, prix actuel / 1,03. C'est le cas des fiches sans concurrent fiable, et de celles
//    que les agents ont vérifiées à la main parce que la correspondance automatique visait le
//    mauvais produit ou le mauvais format (Tom Ford Costa Azzurra : la collecte proposait le
//    prix d'un autre format ; repartir de sa « médiane » réintroduirait l'erreur).
//
// Le seuil des 15 000 DA porte sur le prix affiché aujourd'hui, celui que voit Shahin.
//
// Usage : node scripts/_price-research/appliquer-marge.mjs            (simulation)
//         node scripts/_price-research/appliquer-marge.mjs --apply
import fs from "fs";

const APPLY = process.argv.includes("--apply");
// USAGE UNIQUE, déjà appliqué le 18/10/2026. Le script suppose que les prix suivent l'ancienne
// règle (+3 %) : relancé sur les prix actuels, il ajouterait la marge une seconde fois. Les
// recalages suivants passent par rafraichir.mjs, qui applique regle-prix.mjs.
if (APPLY) {
  console.error("Déjà appliqué le 18/10/2026 — utiliser rafraichir.mjs pour tout nouveau recalage.");
  process.exit(1);
}
const SEUIL = 15000;
const MARGE_BAS = 0.20;
const MARGE_HAUT = 0.10;
const ANCIENNE = 0.03;
const PLANCHER = 6500;

const arrondi = (t) => {
  const pas = t < 10000 ? 100 : 500;
  return Math.max(PLANCHER, Math.ceil(t / pas) * pas);
};

const C = "./data/products.json";
const catalogue = JSON.parse(fs.readFileSync(C, "utf8"));
const rapport = new Map(JSON.parse(fs.readFileSync("./scripts/_price-research/report-v3.json", "utf8")).map((r) => [r.slug, r]));
const imposes = new Set(JSON.parse(fs.readFileSync("./data/prix-imposes.json", "utf8")).map((x) => x.slug));

const lignes = [];
let viaMarche = 0, viaPrix = 0;
for (const p of catalogue.products) {
  if (imposes.has(p.slug)) continue;
  const r = rapport.get(p.slug);
  let mediane;
  if (r && r.status === "match" && (r.tier === "A" || r.tier === "B") &&
      Math.abs(p.price - arrondi(r.market * (1 + ANCIENNE))) / p.price <= 0.025) {
    mediane = r.market; viaMarche++;
  } else {
    mediane = p.price / (1 + ANCIENNE); viaPrix++;
  }
  const marge = p.price <= SEUIL ? MARGE_BAS : MARGE_HAUT;
  const nouveau = arrondi(mediane * (1 + marge));
  lignes.push({ slug: p.slug, ancien: p.price, nouveau, marge, mediane: Math.round(mediane) });
  if (APPLY) p.price = nouveau;
}

if (APPLY) fs.writeFileSync(C, JSON.stringify(catalogue, null, 2) + "\n");
fs.writeFileSync("./scripts/_price-research/rafraichissement/marge-2026-10-18.json", JSON.stringify(lignes, null, 1));

const bas = lignes.filter((l) => l.marge === MARGE_BAS), haut = lignes.filter((l) => l.marge === MARGE_HAUT);
const moy = (l, k) => Math.round(l.reduce((s, x) => s + x[k], 0) / (l.length || 1));
const baisses = lignes.filter((l) => l.nouveau < l.ancien);
// Inversions au seuil : un parfum qui était moins cher qu'un autre et le devient plus.
const autour = lignes.filter((l) => l.ancien > 13000 && l.ancien < 17500).sort((a, b) => a.ancien - b.ancien);
let inversions = 0;
for (let i = 0; i < autour.length; i++) for (let j = i + 1; j < autour.length; j++)
  if (autour[i].ancien < autour[j].ancien && autour[i].nouveau > autour[j].nouveau) inversions++;

console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${lignes.length} prix recalculés (${imposes.size} imposé(s) laissé(s) tel(s) quel(s))`);
console.log(`  référence : médiane fraîche du 06/10 pour ${viaMarche}, prix actuel / 1,03 pour ${viaPrix}`);
console.log(`  jusqu'à ${SEUIL} DA (+20 %) : ${bas.length} parfums, prix moyen ${moy(bas, "ancien")} -> ${moy(bas, "nouveau")} DA`);
console.log(`  au-dessus      (+10 %) : ${haut.length} parfums, prix moyen ${moy(haut, "ancien")} -> ${moy(haut, "nouveau")} DA`);
console.log(`  baisses : ${baisses.length} (attendu : 0)`);
console.log(`  inversions autour du seuil (un parfum moins cher qui passe devant) : ${inversions} paires`);
console.log("  exemples :");
for (const prix of [7000, 9500, 12000, 14500, 15000, 15500, 21000, 31000, 62000]) {
  const l = lignes.find((x) => x.ancien === prix);
  if (l) console.log(`    ${String(l.ancien).padStart(6)} -> ${String(l.nouveau).padStart(6)} DA  (+${Math.round(l.marge * 100)} % sur la médiane ${l.mediane})  ${l.slug}`);
}
