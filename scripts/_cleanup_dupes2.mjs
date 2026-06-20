// Fusion des doublons confirmés (round 2) : repointe related + retire la fiche.
import fs from "fs";
const FILE = "./data/products.json";
const db = JSON.parse(fs.readFileSync(FILE, "utf8"));

// doublon retiré -> fiche canonique gardée (on garde la plus référencée)
const REMOVE = {
  "elizabeth-arden-fifth-avenue": "5th-avenue-elizabeth-arden",
  "prada-candy-femme": "prada-candy",
  "versace-crystal-noir-edp": "crystal-noir-versace",
  "carolina-herrera-212-men-edp": "carolina-herrera-212-men",
  "paco-rabanne-phantom-le-parfum": "paco-rabanne-phantom-parfum",
  "kenzo-flower-edp": "kenzo-flower",
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
fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
console.log("Doublons retirés:", before - db.products.length, "| related repointés:", repoint, "| produits:", db.products.length);
