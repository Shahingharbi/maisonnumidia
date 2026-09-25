#!/usr/bin/env node
// Deuxieme passe : n-grammes, mots-outils et intentions secondaires des requetes
// qui atterrissent sur une fiche produit. Sert a decider du contenu des h2.
import fs from "fs";

const D = "./scripts/_gsc/data";
const rp = JSON.parse(fs.readFileSync(`${D}/requete-page.json`, "utf8")).filter((r) => r.keys[1].includes("/parfums/"));
const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "");

const produits = JSON.parse(fs.readFileSync("./data/products.json", "utf8")).products;
const motsProduit = new Set();
produits.forEach((p) => norm(p.brand + " " + p.name).split(/[^a-z0-9]+/).forEach((w) => w.length > 2 && motsProduit.add(w)));

// ---------- mots hors nom de produit : c'est ce que l'internaute AJOUTE ----------
const ajouts = new Map();
for (const r of rp) {
  for (const w of norm(r.keys[0]).split(/[^a-z0-9]+/)) {
    if (w.length < 2 || motsProduit.has(w)) continue;
    const e = ajouts.get(w) || { mot: w, clics: 0, imp: 0, posImp: 0 };
    e.clics += r.clicks; e.imp += r.impressions; e.posImp += r.position * r.impressions;
    ajouts.set(w, e);
  }
}
const tri = [...ajouts.values()].filter((e) => e.imp >= 100).sort((a, b) => b.imp - a.imp);
console.log("=== MOTS AJOUTES AU NOM DU PARFUM (hors marque et nom), >= 100 impressions\n");
console.log("mot".padEnd(16) + "impress.".padStart(9) + "clics".padStart(7) + "   CTR" + "  pos.moy");
tri.slice(0, 30).forEach((e) => console.log(
  e.mot.padEnd(16) + String(e.imp).padStart(9) + String(e.clics).padStart(7) +
  (100 * e.clics / e.imp).toFixed(2).padStart(7) + "%" + (e.posImp / e.imp).toFixed(1).padStart(8)));

// ---------- intentions secondaires ----------
console.log("\n=== INTENTIONS SECONDAIRES (volume total sur fiches produit)\n");
const INTENTIONS = [
  ["question (comment/pourquoi/quel/ou)", /\b(comment|pourquoi|quel|quelle|ou|est ce que)\b/],
  ["ville citee", /\b(alger|oran|constantine|annaba|blida|setif|batna|tlemcen|bejaia|tizi|biskra|djelfa|skikda)\b/],
  ["livraison / commande", /\b(livraison|livrer|commander|commande|yalidine|domicile|wilaya)\b/],
  ["authenticite", /\b(original|originale|authentique|vrai|vraie|faux|contrefacon|copie)\b/],
  ["genre explicite", /\b(homme|femme|masculin|feminin|mixte|unisexe)\b/],
  ["contenance", /\b\d{2,3}\s?ml\b/],
  ["concentration generique", /\b(edp|edt|edc|eau de parfum|eau de toilette)\b/],
  ["declinaison (elixir/intense/extreme...)", /\b(elixir|intense|extreme|absolu|parfum|profumo|le parfum|noir|gold|sport)\b/],
  ["prix", /\b(prix|combien|coute|tarif|cout)\b/],
  ["algerie", /\b(algerie|algerien|algerienne|dz)\b/],
];
for (const [nom, re] of INTENTIONS) {
  const sel = rp.filter((r) => re.test(norm(r.keys[0])));
  const c = sel.reduce((s, x) => s + x.clicks, 0);
  const i = sel.reduce((s, x) => s + x.impressions, 0);
  if (!i) continue;
  const pos = sel.reduce((s, x) => s + x.position * x.impressions, 0) / i;
  console.log(nom.padEnd(42) + String(i).padStart(8) + " imp." + String(c).padStart(6) + " clics" +
    (100 * c / i).toFixed(2).padStart(7) + "% CTR" + pos.toFixed(1).padStart(7) + " pos.");
}

// ---------- ou se perd le trafic : beaucoup d'impressions, peu de clics ----------
console.log("\n=== FICHES QUI RATENT LE PLUS DE CLICS (position <= 8, CTR faible)\n");
const parPage = new Map();
for (const r of rp) {
  const p = r.keys[1].replace(/^https?:\/\/(www\.)?maisonnumidia\.store/, "");
  const e = parPage.get(p) || { page: p, clics: 0, imp: 0, posImp: 0 };
  e.clics += r.clicks; e.imp += r.impressions; e.posImp += r.position * r.impressions;
  parPage.set(p, e);
}
const manques = [...parPage.values()]
  .map((e) => ({ ...e, pos: e.posImp / e.imp, ctr: e.clics / e.imp }))
  .filter((e) => e.imp >= 800 && e.pos <= 8)
  .map((e) => ({ ...e, manque: Math.round(e.imp * (0.045 - e.ctr)) }))   // 4,5 % = CTR observe en position 1-4
  .filter((e) => e.manque > 0)
  .sort((a, b) => b.manque - a.manque);
console.log("page".padEnd(46) + "impress.".padStart(9) + "  CTR" + " pos." + "  clics perdus*");
manques.slice(0, 15).forEach((e) => console.log(
  e.page.padEnd(46) + String(e.imp).padStart(9) + (100 * e.ctr).toFixed(1).padStart(6) + "%" +
  e.pos.toFixed(1).padStart(6) + String(e.manque).padStart(10)));
console.log("\n* estimation : clics qu'on aurait au CTR moyen des positions 1-4 (4,5 %)");
console.log("total estimé sur ces fiches : " + manques.reduce((s, e) => s + e.manque, 0) + " clics");
