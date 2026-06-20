// Re-répartit les prix plats à 6000 sur leur vraie valeur relative (≥6000, coherent).
import fs from "fs";
const db = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const recs = JSON.parse(fs.readFileSync("./scripts/price-research-full.json", "utf8"));
const R = {};
recs.forEach((r) => { if (r.slug) R[r.slug] = r; });
const round500 = (n) => Math.round(n / 500) * 500;

let n = 0;
for (const p of db.products) {
  if (p.price !== 6000) continue;
  const r = R[p.slug] || {};
  // Signal de vraie valeur : prix Algérie réel si trouvé, sinon prix EU x270
  const signal = Math.max(r.algerianDA || 0, r.euroX270 || 0) || 4000;
  // Mappe le signal [2000..6200] -> prix [6000..7500] (plancher 6000, étalé)
  let np = 6000 + (Math.min(Math.max(signal, 2000), 6200) - 2000) / 4200 * 1500;
  np = Math.max(6000, round500(np));
  if (np !== p.price) {
    console.log("  " + p.slug + " : 6000 -> " + np + " (signal " + signal + ")");
    p.price = np;
    n++;
  }
}
fs.writeFileSync("./data/products.json", JSON.stringify(db, null, 2));
const prices = db.products.map((x) => x.price);
console.log("Re-réparti:", n, "| MIN:", Math.min(...prices), "| < 6000:", prices.filter((x) => x < 6000).length);
