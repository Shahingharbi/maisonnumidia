// Plancher de sécurité : aucun parfum sous 6000 DA (réalité du marché algérien).
import fs from "fs";
const MIN = 6000;
const db = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
let bumped = 0;
for (const p of db.products) {
  let price = Math.round(p.price / 500) * 500;
  if (price < MIN) { price = MIN; }
  if (price !== p.price) bumped++;
  p.price = price;
}
fs.writeFileSync("./data/products.json", JSON.stringify(db, null, 2));
const prices = db.products.map((p) => p.price);
console.log("Plancher 6000 appliqué — prix modifiés:", bumped, "| MIN final:", Math.min(...prices), "| nb < 6000:", prices.filter((x) => x < 6000).length);
