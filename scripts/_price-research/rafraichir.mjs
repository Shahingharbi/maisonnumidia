#!/usr/bin/env node
// Rafraîchit les prix du catalogue sur le marché algérien, à partir d'une collecte fraîche
// des boutiques concurrentes (fetch-apis.mjs + agents/fetch-oriental-shops.mjs, puis
// match-v3.mjs qui produit report-v3.json pour TOUTES les fiches).
//
// Pourquoi un script à part plutôt que apply-market-prices.mjs :
//  - celui du 15/09 écrasait son propre journal, et sa liste « à revoir » (43 fiches, dont
//    Zadig & Voltaire à moitié prix) n'a jamais été relue. Ici, ce qui dépasse le plafond
//    part en VÉRIFICATION (workflow d'agents), et le résultat revient dans ce même script ;
//  - il respecte data/prix-imposes.json : un prix fixé par Shahin n'est jamais recalculé.
//
// Règle de prix inchangée (CLAUDE.md, validée le 15/09) : médiane marché + 3 %, arrondi à la
// centaine sous 10 000 DA, aux 500 DA au-dessus, plancher 6 500 DA.
//
// Usage :
//   node scripts/_price-research/rafraichir.mjs            plan (n'écrit pas products.json)
//   node scripts/_price-research/rafraichir.mjs --apply    applique automatiques + vérifiés
//   … --apply --automatiques-seulement                       ignore les vérifications en cours
//
// Sorties : scripts/_price-research/rafraichissement/{plan.json, a-verifier.json, journal.json}
import fs from "fs";

const APPLY = process.argv.includes("--apply");
// Pendant qu'un workflow de vérification tourne, ses fichiers sont incomplets : cette option
// les ignore pour n'appliquer que les corrections automatiques.
const SANS_VERIFS = process.argv.includes("--automatiques-seulement");
const DIR = "./scripts/_price-research";
const SORTIE = `${DIR}/rafraichissement`;
const VERIF = `${SORTIE}/verifs`; // un fichier par lot, écrit par les agents
fs.mkdirSync(VERIF, { recursive: true });

const PREMIUM = 0.03;
const PLANCHER = 6500;
// Plafond de variation appliquée sans vérification : A = 2+ boutiques cohérentes, B = 1 seule.
const PLAFOND = { A: 0.45, B: 0.25 };

const prixDe = (marche) => {
  const t = marche * (1 + PREMIUM);
  const pas = t < 10000 ? 100 : 500;
  return Math.max(PLANCHER, Math.ceil(t / pas) * pas);
};
const ml = (v) => parseInt(String(v), 10) || 100;
// Même ajustement de format que match-v3 : le prix ne suit pas le volume linéairement.
const ajusteVolume = (prix, volSource, volCible) => prix * Math.pow(volCible / volSource, 0.72);

const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const rapport = new Map(JSON.parse(fs.readFileSync(`${DIR}/report-v3.json`, "utf8")).map((r) => [r.slug, r]));
const imposes = new Map(JSON.parse(fs.readFileSync("./data/prix-imposes.json", "utf8")).map((x) => [x.slug, x]));
const ancienARevoir = new Set(
  fs.existsSync(`${DIR}/apply-log.json`) ? JSON.parse(fs.readFileSync(`${DIR}/apply-log.json`, "utf8")).review.map((r) => r.slug) : []
);

// Fiches très loin de la médiane de leur maison (prix ramené à 100 ml) : c'est ainsi que
// Zadig & Voltaire This Is Him (10 000 DA, 41 % de sa maison) aurait dû sauter aux yeux.
const parMarque = new Map();
for (const p of catalogue.products) {
  if (!parMarque.has(p.brandSlug)) parMarque.set(p.brandSlug, []);
  parMarque.get(p.brandSlug).push(p.price * Math.pow(100 / ml(p.volume), 0.72));
}
const medianeMarque = new Map([...parMarque].map(([b, l]) => {
  const s = [...l].sort((x, y) => x - y);
  return [b, { med: s[s.length >> 1], n: s.length }];
}));
function horsNorme(p) {
  const m = medianeMarque.get(p.brandSlug);
  if (!m || m.n < 4) return null;
  const r = (p.price * Math.pow(100 / ml(p.volume), 0.72)) / m.med;
  return r < 0.55 ? `${Math.round(r * 100)} % de la médiane ${p.brand}` : null;
}

// Résultats de vérification (agents), s'il y en a.
const verifies = new Map();
for (const f of SANS_VERIFS ? [] : fs.readdirSync(VERIF).filter((x) => x.endsWith(".json"))) {
  try {
    for (const v of JSON.parse(fs.readFileSync(`${VERIF}/${f}`, "utf8"))) verifies.set(v.slug, v);
  } catch {
    console.log(`! ${f} illisible, ignoré`);
  }
}

const auto = [], aVerifier = [], verifiesAppliques = [], aTrancher = [], inchanges = [], gardes = [];

for (const p of catalogue.products) {
  if (imposes.has(p.slug)) { gardes.push({ slug: p.slug, prix: p.price, raison: "prix imposé par Shahin" }); continue; }
  const r = rapport.get(p.slug);
  const v = verifies.get(p.slug);

  // 1. Une vérification par agent prime sur tout le reste.
  if (v) {
    if (!v.found || !v.price || v.confidence === "low") {
      aTrancher.push({ slug: p.slug, prix: p.price, raison: v.note || "rien de fiable trouvé" });
      continue;
    }
    const memeFormat = !v.volumeMl || v.volumeMl === ml(p.volume);
    const marche = memeFormat ? v.price : ajusteVolume(v.price, v.volumeMl, ml(p.volume));
    const cible = prixDe(marche);
    const saut = (cible - p.price) / p.price;
    // Un format différent ou une confiance moyenne sur un gros écart : à Shahin de trancher.
    if (!memeFormat || (v.confidence !== "high" && Math.abs(saut) > PLAFOND.A)) {
      aTrancher.push({ slug: p.slug, prix: p.price, propose: cible, sautPct: Math.round(saut * 100), raison: !memeFormat ? `format trouvé ${v.volumeMl} ml, fiche ${p.volume}` : "confiance moyenne sur un gros écart", url: v.url, note: v.note });
      continue;
    }
    if (cible !== p.price) verifiesAppliques.push({ slug: p.slug, ancien: p.price, nouveau: cible, sautPct: Math.round(saut * 100), url: v.url, confiance: v.confidence });
    else inchanges.push(p.slug);
    if (APPLY) p.price = cible;
    continue;
  }

  // 2. Correspondance fraîche avec les catalogues concurrents.
  if (r && r.status === "match" && (r.tier === "A" || r.tier === "B")) {
    const cible = prixDe(r.market);
    const saut = (cible - p.price) / p.price;
    if (Math.abs(saut) <= PLAFOND[r.tier]) {
      if (cible !== p.price) {
        auto.push({ slug: p.slug, ancien: p.price, nouveau: cible, sautPct: Math.round(saut * 100), niveau: r.tier, sources: r.sources.map((s) => `${s.site} ${s.price}`).join(", ") });
        if (APPLY) p.price = cible;
      } else inchanges.push(p.slug);
    } else {
      const s = r.sources[0];
      aVerifier.push({ slug: p.slug, brand: p.brand, name: p.name, conc: p.concentration, volume: p.volume, ourPrice: p.price, mission: "verifier", pourquoi: `écart ${Math.round(saut * 100)} % (niveau ${r.tier})`, hint: `${s.site} : ${s.name} — ${s.price} DA (${s.vol || "?"} ml) ${s.url}` });
    }
    continue;
  }

  // 3. Pas de prix concurrent fiable : on ne vérifie que ce qui est suspect.
  const suspect = ancienARevoir.has(p.slug) ? "resté « à revoir » depuis le 15/09" : horsNorme(p);
  if (suspect) {
    aVerifier.push({ slug: p.slug, brand: p.brand, name: p.name, conc: p.concentration, volume: p.volume, ourPrice: p.price, mission: "trouver", pourquoi: suspect, hint: null });
  } else inchanges.push(p.slug);
}

const hausses = (l, k) => l.filter((x) => x[k] > x.ancien).length;
const journal = {
  date: new Date().toISOString().slice(0, 10),
  regle: "médiane marché +3 %, arrondi 100/500 DA, plancher 6 500 DA",
  applique: APPLY,
  automatiques: auto, verifies: verifiesAppliques, aTrancher, aVerifier: aVerifier.length, gardes, inchanges: inchanges.length,
};
fs.writeFileSync(`${SORTIE}/${APPLY ? "journal" : "plan"}.json`, JSON.stringify(journal, null, 1));
fs.writeFileSync(`${SORTIE}/a-verifier.json`, JSON.stringify(aVerifier, null, 1));
if (APPLY) fs.writeFileSync("./data/products.json", JSON.stringify(catalogue, null, 2) + "\n");

console.log(`${APPLY ? "APPLIQUÉ" : "PLAN"} — ${catalogue.products.length} fiches`);
console.log(`  automatiques (marché frais, sous le plafond) : ${auto.length}  (${hausses(auto, "nouveau")} hausses, ${auto.length - hausses(auto, "nouveau")} baisses)`);
console.log(`  vérifiées par agent, appliquées              : ${verifiesAppliques.length}`);
console.log(`  à vérifier par agent                         : ${aVerifier.length}`);
console.log(`  à trancher par Shahin                        : ${aTrancher.length}`);
console.log(`  prix imposés, laissés tels quels             : ${gardes.length}`);
console.log(`  inchangés                                    : ${inchanges.length}`);
