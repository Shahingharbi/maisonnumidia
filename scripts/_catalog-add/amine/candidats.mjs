#!/usr/bin/env node
// Stock Amine : prix de vente des nouveaux parfums et des fiches dont la contenance change, selon la
// règle de la boutique (scripts/_price-research/regle-prix.mjs), à partir des relevés des agents
// (prix/<slug>.json, prix-ml/<slug>.json).
//   node scripts/_catalog-add/amine/candidats.mjs            (simulation : tableau)
//   node scripts/_catalog-add/amine/candidats.mjs --ecrire   (candidates.json + plan-ml.json)
//
// Médiane des boutiques algériennes au bon volume (parfumalgerie.shop jamais seule source), puis
// prixDeVente(). Sans offre algérienne : Yves Rocher au rapport DA/€ observé chez Yves Rocher
// (Cuir de Nuit : 8 500 DA en Algérie pour 41,90 € en France), autres maisons au dernier recours de
// CLAUDE.md (prix européen × 270). Contenance qui change sans offre au nouveau volume : médiane de
// l'ancien volume ajustée en (volume)^0,72, comme match-v3.mjs.
// Chaque prix est comparé au prix d'achat chez Amine : une marge sous 10 % est signalée.
import fs from "fs";
import { prixDeVente, arrondi } from "../../_price-research/regle-prix.mjs";

const D = "./scripts/_catalog-add/amine/";
const ECRIRE = process.argv.includes("--ecrire");
const L = JSON.parse(fs.readFileSync(D + "liste.json", "utf8"));
const cat = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const marques = new Map(cat.brands.map((b) => [b.name.toLowerCase(), b]));
const lire = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : null);
const n = (x) => Number(String(x).replace(/[^\d]/g, "")) || 0;
const mediane = (a) => { const s = a.filter(Boolean).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const offresFiables = (o) => {
  const ok = (o || []).filter((x) => n(x.prix));
  const autres = ok.filter((x) => !/parfumalgerie/.test(x.boutique || ""));
  return autres.length ? ok : []; // parfumalgerie.shop seule : pas de médiane
};
const RATIO_YR = 8500 / 41.9;
const EN_ATTENTE = new Set(["dolce-gabbana-pour-homme-edp", "lacoste-l-12-12-blanc-edp", "eau-jeune-double-je"]);

const candidats = [], lignes = [];
for (const p of L.nouveaux) {
  if (EN_ATTENTE.has(p.slug)) { lignes.push(`EN ATTENTE  ${p.slug}`); continue; }
  const r = lire(D + "research/" + p.slug + ".json");
  const q = lire(D + "prix/" + p.slug + ".json");
  const offres = offresFiables(q?.offres);
  const med = mediane(offres.map((o) => n(o.prix)));
  let prix, base;
  if (med) { prix = prixDeVente(med); base = `médiane ${med} (${offres.length} boutiques)`; }
  else if (q?.prixEurope?.eur && p.marque === "Yves Rocher") {
    // Plafond 8 500 DA : en Algérie, un Yves Rocher 100 ml se vend 8 500 à 11 000 DA (Cuir de Nuit chez
    // Palais, nos fiches Comme une Évidence et L'Évidence), quel que soit son prix en France. Sans
    // plafond, Bouquet Ambré (69,90 €) sortait à 17 500 DA, invendable à côté de ses voisins.
    const est = Math.min(q.prixEurope.eur * RATIO_YR, 8500);
    prix = prixDeVente(est);
    base = `estimé ${Math.round(est)} (Yves Rocher, ${q.prixEurope.eur} € × ${RATIO_YR.toFixed(0)}, plafond 8 500)`;
  }
  else if (q?.prixEurope?.eur) { prix = arrondi(q.prixEurope.eur * 270); base = `dernier recours ${q.prixEurope.eur} € × 270`; }
  else { lignes.push(`SANS PRIX   ${p.slug}`); continue; }
  const marge = (prix - p.prixAmine) / prix;
  const b = marques.get(p.marque.toLowerCase()) || [...cat.brands].find((x) => x.name.toLowerCase().replace(/[^a-z]/g, "") === p.marque.toLowerCase().replace(/[^a-z]/g, ""));
  candidats.push({
    slug: p.slug, marque: b ? b.name : p.marque, marqueSlug: b ? b.slug : null, marqueConnue: !!b, nom: r?.fragrantica?.nomOfficiel || p.nom,
    concentration: r?.concentrationConfirmee || p.concentration, volume: p.volume, categorieIndice: "a-determiner", prix,
    nbBoutiques: offres.length, boutiques: offres.map((o) => o.boutique).join(","), source: offres[0]?.url || q?.prixEurope?.url || "", rang: 1,
    prixAmine: p.prixAmine, basePrix: base,
  });
  lignes.push(`${marge < 0.1 ? "MARGE FAIBLE" : "ok          "} ${p.slug.padEnd(46)} ${String(prix).padStart(6)} DA  (Amine ${p.prixAmine}, marge ${Math.round(marge * 100)} %)  ${base}`);
}

const planMl = [];
for (const p of L.ml) {
  const q = lire(D + "prix-ml/" + p.slugExistant + ".json");
  const f = cat.products.find((x) => x.slug === p.slugExistant);
  const offres = offresFiables(q?.offres);
  let med = mediane(offres.map((o) => n(o.prix))), base;
  if (med) base = `médiane ${med} (${offres.length} boutiques)`;
  else {
    // Pas d'offre au nouveau volume : on part du prix actuel de la fiche (= médiane × marge) ramené à
    // une médiane, puis ajusté au volume.
    const vA = n(p.ancienVolume), vN = n(p.volume);
    const medAncienne = f.price / (f.price <= 15000 ? 1.2 : 1.1);
    med = medAncienne * Math.pow(vN / vA, 0.72);
    base = `estimé depuis l'ancien ${p.ancienVolume} : ${Math.round(medAncienne)} × (${vN}/${vA})^0,72`;
  }
  const prix = prixDeVente(med);
  planMl.push({ slug: p.slugExistant, ancienVolume: p.ancienVolume, volume: p.volume, ancienPrix: f.price, prix, prixAmine: p.prixAmine, basePrix: base });
  const marge = (prix - p.prixAmine) / prix;
  lignes.push(`${marge < 0.1 ? "MARGE FAIBLE" : "ml ok       "} ${p.slugExistant.padEnd(46)} ${p.ancienVolume}→${p.volume}  ${f.price} → ${prix} DA  (Amine ${p.prixAmine}, marge ${Math.round(marge * 100)} %)  ${base}`);
}
console.log(lignes.join("\n"));
console.log(`\n${candidats.length} nouveaux, ${planMl.length} changements de contenance`);
if (ECRIRE) {
  fs.writeFileSync(D + "candidates.json", JSON.stringify(candidats, null, 1));
  fs.writeFileSync(D + "plan-ml.json", JSON.stringify(planMl, null, 1));
  console.log("écrit candidates.json et plan-ml.json");
}
