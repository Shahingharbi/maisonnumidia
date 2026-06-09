// Nettoyage catalogue : fusionne les doublons (repointe related + retire la fiche),
// corrige les champs erronés. Les redirections 301 sont ajoutées dans next.config.ts.
import fs from "fs";
const FILE = "./data/products.json";
const db = JSON.parse(fs.readFileSync(FILE, "utf8"));

// doublon retiré -> fiche canonique gardée
const REMOVE = {
  "allure-homme-chanel": "chanel-allure-homme",
  "calvin-klein-eternity-homme": "eternity-homme-ck",
  "coach-wild-rose-femme": "coach-wild-rose",
  "dior-sauvage-elixir-intense": "dior-sauvage-elixir",
};
const removeSet = new Set(Object.keys(REMOVE));
const byCat = {};
db.products.forEach((p) => (byCat[p.category] = byCat[p.category] || []).push(p.slug));

let repoint = 0;
for (const p of db.products) {
  if (!p.related) continue;
  let r = p.related.map((s) => REMOVE[s] || s).filter((s) => s !== p.slug);
  r = [...new Set(r)];
  if (r.length < 3) {
    for (const cand of byCat[p.category] || []) {
      if (r.length >= 3) break;
      if (cand !== p.slug && !r.includes(cand) && !removeSet.has(cand)) r.push(cand);
    }
  }
  if (JSON.stringify(r) !== JSON.stringify(p.related)) repoint++;
  p.related = r;
}

const before = db.products.length;
db.products = db.products.filter((p) => !removeSet.has(p.slug));

// corrections de champ
const fix = (s) => db.products.find((p) => p.slug === s);
const code = fix("armani-code-edp");
if (code) code.volume = "125ml"; // le 110ml n'existe pas chez Armani
const m212 = fix("carolina-herrera-212-men-edp");
if (m212) { m212.concentration = "EDT"; m212.name = "212 Men"; m212.price = 16500; if (m212.h1) m212.h1 = m212.h1.replace(/\bEDP\b/g, "EDT"); }
const h24 = fix("hermes-h24-intense");
if (h24) h24.name = "H24"; // pas de "H24 Intense" : c'est H24 EDP

fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
console.log("Doublons retirés:", before - db.products.length, "| related repointés:", repoint, "| produits:", db.products.length);
