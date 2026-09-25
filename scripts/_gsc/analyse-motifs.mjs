#!/usr/bin/env node
// Analyse les requetes Search Console pour repondre a : quels mots doivent figurer
// dans le title, le h1 et les h2 d'une fiche produit ?
// Lit scripts/_gsc/data/, n'ecrit rien dans le site.
import fs from "fs";

const D = "./scripts/_gsc/data";
const lire = (n) => JSON.parse(fs.readFileSync(`${D}/${n}.json`, "utf8"));
const requetes = lire("requetes");
const pages = lire("pages");
const rp = lire("requete-page");
const produits = JSON.parse(fs.readFileSync("./data/products.json", "utf8")).products;

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "");
const marques = [...new Set(produits.map((p) => norm(p.brand)))];
const motsMarques = new Set(marques.flatMap((m) => m.split(/[^a-z0-9]+/)).filter((w) => w.length > 2));
const nomsProduits = new Set(produits.flatMap((p) => norm(p.name).split(/[^a-z0-9]+/)).filter((w) => w.length > 2));

// ---------- 1. Motifs de requete ----------
const MOTIFS = [
  ["prix", (q) => /\bprix\b|\bcombien\b|\bcoute\b|\btarif\b/.test(q)],
  ["algerie / dz", (q) => /\balgerie\b|\bdz\b|\balger\b|\boran\b|\bconstantine\b|\bsetif\b|\bblida\b|\bannaba\b/.test(q)],
  ["original / authentique", (q) => /\boriginal|authentique|vrai\b|contrefa|faux\b/.test(q)],
  ["pas cher / promo", (q) => /pas cher|moins cher|promo|solde|discount|petit prix/.test(q)],
  ["genre (homme / femme)", (q) => /\bhomme\b|\bfemme\b|\bmasculin|\bfeminin/.test(q)],
  ["contenance (ml)", (q) => /\d{2,3}\s?ml\b/.test(q)],
  ["concentration", (q) => /\bedp\b|\bedt\b|eau de parfum|eau de toilette|\bextrait\b|\bintense\b|\belixir\b/.test(q)],
  ["avis / test", (q) => /\bavis\b|\btest\b|review|\bnote\b/.test(q)],
  ["notes olfactives", (q) => /\bnotes?\b|\bsenteur|\bodeur|\bpyramide|\bfamille\b|sent\b/.test(q)],
  ["tenue / sillage", (q) => /\btenue\b|\bsillage\b|\bdure\b|\bdurable|longevite|tient\b/.test(q)],
  ["achat / livraison", (q) => /\bacheter\b|\bachat\b|\bcommander\b|livraison|\bvente\b|\bou trouver\b|\bmagasin\b|\bboutique\b/.test(q)],
  ["meilleur / top / classement", (q) => /\bmeilleur|\btop\b|\bclassement\b|\bselection\b/.test(q)],
  ["similaire / equivalent", (q) => /\bsimilaire|\bequivalent|\bressemble|\bdupe\b|\balternative/.test(q)],
  ["marque du catalogue", (q) => q.split(/[^a-z0-9]+/).some((w) => motsMarques.has(w))],
  ["nom de parfum du catalogue", (q) => q.split(/[^a-z0-9]+/).some((w) => nomsProduits.has(w))],
];

const lignes = requetes.map((r) => ({ ...r, q: norm(r.keys[0]) }));
const totalClics = lignes.reduce((s, r) => s + r.clicks, 0);
const totalImp = lignes.reduce((s, r) => s + r.impressions, 0);

console.log(`=== MOTIFS DE REQUETE (${lignes.length} requêtes, ${totalClics} clics, ${totalImp} impressions visibles)\n`);
console.log("motif".padEnd(30) + "clics".padStart(7) + "  part" + "impress.".padStart(11) + "  part" + "   CTR" + "  pos.moy");
const motifsCalc = [];
for (const [nom, test] of MOTIFS) {
  const sel = lignes.filter((r) => test(r.q));
  const c = sel.reduce((s, r) => s + r.clicks, 0);
  const i = sel.reduce((s, r) => s + r.impressions, 0);
  const pos = i ? sel.reduce((s, r) => s + r.position * r.impressions, 0) / i : 0;
  motifsCalc.push({ nom, requetes: sel.length, clics: c, impressions: i, ctr: i ? c / i : 0, position: pos });
  console.log(
    nom.padEnd(30) + String(c).padStart(7) + (100 * c / totalClics).toFixed(1).padStart(6) + "%" +
    String(i).padStart(11) + (100 * i / totalImp).toFixed(1).padStart(6) + "%" +
    (i ? (100 * c / i).toFixed(2) : "0.00").padStart(7) + "%" + pos.toFixed(1).padStart(8)
  );
}

// ---------- 2. Combinaisons gagnantes ----------
console.log("\n=== COMBINAISONS (sur les requêtes qui citent une marque du catalogue)\n");
const avecMarque = lignes.filter((r) => r.q.split(/[^a-z0-9]+/).some((w) => motsMarques.has(w)));
const COMBOS = [
  ["marque seule (sans prix ni lieu)", (q) => !/\bprix\b|\balgerie\b|\bdz\b/.test(q)],
  ["marque + prix", (q) => /\bprix\b/.test(q) && !/\balgerie\b|\bdz\b/.test(q)],
  ["marque + algerie", (q) => /\balgerie\b|\bdz\b/.test(q) && !/\bprix\b/.test(q)],
  ["marque + prix + algerie", (q) => /\bprix\b/.test(q) && /\balgerie\b|\bdz\b/.test(q)],
];
for (const [nom, test] of COMBOS) {
  const sel = avecMarque.filter((r) => test(r.q));
  const c = sel.reduce((s, r) => s + r.clicks, 0);
  const i = sel.reduce((s, r) => s + r.impressions, 0);
  const pos = i ? sel.reduce((s, r) => s + r.position * r.impressions, 0) / i : 0;
  console.log(nom.padEnd(34) + String(c).padStart(6) + " clics" + String(i).padStart(9) + " imp." +
    (i ? (100 * c / i).toFixed(2) : "0.00").padStart(8) + "% CTR" + pos.toFixed(1).padStart(7) + " pos.");
}

// ---------- 3. Longueur des requetes ----------
console.log("\n=== LONGUEUR DES REQUETES\n");
for (const n of [1, 2, 3, 4, 5, 6]) {
  const sel = lignes.filter((r) => {
    const m = r.q.split(/\s+/).filter(Boolean).length;
    return n === 6 ? m >= 6 : m === n;
  });
  const c = sel.reduce((s, r) => s + r.clicks, 0);
  const i = sel.reduce((s, r) => s + r.impressions, 0);
  console.log(`${n === 6 ? "6+" : n} mot(s)`.padEnd(10) + String(sel.length).padStart(7) + " requêtes" +
    String(c).padStart(7) + " clics" + String(i).padStart(9) + " imp." + (i ? (100 * c / i).toFixed(2) : "0.00").padStart(8) + "% CTR");
}

// ---------- 4. Ce qui atterrit sur une fiche produit ----------
console.log("\n=== REQUETES QUI ATTERRISSENT SUR UNE FICHE /parfums/\n");
const surFiche = rp.filter((r) => r.keys[1].includes("/parfums/"));
const cFiche = surFiche.reduce((s, r) => s + r.clicks, 0);
const iFiche = surFiche.reduce((s, r) => s + r.impressions, 0);
console.log(`${surFiche.length} couples requête/fiche — ${cFiche} clics, ${iFiche} impressions`);
console.log("\nmotif".padEnd(30) + "clics".padStart(7) + "impress.".padStart(11) + "   CTR" + "  pos.moy");
for (const [nom, test] of MOTIFS) {
  const sel = surFiche.filter((r) => test(norm(r.keys[0])));
  const c = sel.reduce((s, r) => s + r.clicks, 0);
  const i = sel.reduce((s, r) => s + r.impressions, 0);
  if (!i) continue;
  const pos = sel.reduce((s, r) => s + r.position * r.impressions, 0) / i;
  console.log(nom.padEnd(30) + String(c).padStart(7) + String(i).padStart(11) +
    (100 * c / i).toFixed(2).padStart(7) + "%" + pos.toFixed(1).padStart(8));
}

// ---------- 5. Top requetes fiches produit ----------
console.log("\n=== TOP 30 REQUETES VERS UNE FICHE PRODUIT (par impressions)\n");
surFiche.sort((a, b) => b.impressions - a.impressions).slice(0, 30).forEach((r) => {
  console.log(`  ${String(r.impressions).padStart(6)} imp. ${String(r.clicks).padStart(4)} clics  ` +
    `${(100 * r.clicks / r.impressions).toFixed(1).padStart(5)}%  pos ${r.position.toFixed(1).padStart(5)}  « ${r.keys[0]} »`);
});

// ---------- 6. Pages produit les plus performantes ----------
console.log("\n=== TOP 15 FICHES PRODUIT (clics)\n");
pages.filter((p) => p.keys[0].includes("/parfums/")).sort((a, b) => b.clicks - a.clicks).slice(0, 15).forEach((p) => {
  console.log(`  ${String(p.clicks).padStart(5)} clics ${String(p.impressions).padStart(7)} imp. ` +
    `${(100 * p.clicks / p.impressions).toFixed(1).padStart(5)}% pos ${p.position.toFixed(1).padStart(5)}  ${p.keys[0].replace("https://maisonnumidia.store", "")}`);
});

// ---------- 7. CTR par tranche de position ----------
console.log("\n=== CTR PAR POSITION (couples requête/fiche produit)\n");
const tranches = [[1, 3], [3, 5], [5, 8], [8, 11], [11, 21], [21, 51], [51, 200]];
for (const [a, b] of tranches) {
  const sel = surFiche.filter((r) => r.position >= a && r.position < b);
  const c = sel.reduce((s, r) => s + r.clicks, 0);
  const i = sel.reduce((s, r) => s + r.impressions, 0);
  if (!i) continue;
  console.log(`pos ${String(a).padStart(3)}-${String(b - 1).padEnd(3)}` + String(i).padStart(10) + " imp." +
    String(c).padStart(7) + " clics" + (100 * c / i).toFixed(2).padStart(8) + "% CTR");
}

fs.writeFileSync("./scripts/_gsc/data/_motifs.json", JSON.stringify(motifsCalc, null, 1));
