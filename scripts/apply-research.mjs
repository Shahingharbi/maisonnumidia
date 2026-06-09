// Applique les prix issus de la recherche profonde (Europe + Algérie croisés).
// Règle : confiance high/medium -> prix recherché ; low/absent -> on garde l'actuel.
// Les baisses SONT autorisées (la recherche corrige aussi mes sur-évaluations).
import fs from "fs";

const RES = (process.argv.find((a) => a.startsWith("--res=")) || "").slice(6) || "./scripts/price-research-full.json";
const apply = process.argv.includes("--apply");
const round500 = (n) => Math.max(1500, Math.round(n / 500) * 500);

const recs = JSON.parse(fs.readFileSync(RES, "utf8"));
const db = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const bySlug = {};
recs.forEach((r) => { if (r && r.slug) bySlug[r.slug] = r; });

let chg = 0, up = 0, down = 0, lowKeep = 0, noRec = 0;
const changes = [];
for (const p of db.products) {
  const r = bySlug[p.slug];
  if (!r) { noRec++; continue; }
  if (r.confidence === "low" || !r.recommendedDA) { lowKeep++; continue; }
  const np = round500(r.recommendedDA);
  if (np !== p.price) {
    changes.push({ slug: p.slug, old: p.price, neu: np, c: r.confidence });
    if (np > p.price) up++; else down++;
    chg++;
    if (apply) p.price = np;
  }
}

console.log(`Recos: ${recs.length} | produits sans reco (gardés tels quels): ${noRec} | basse conf (gardés): ${lowKeep}`);
console.log(`Changements: ${chg} (hausses ${up}, baisses ${down})`);
const P = db.products.map((p) => p.price).sort((a, b) => a - b);
console.log(`Prix final — min ${P[0]} | médian ${P[Math.floor(P.length / 2)]} | max ${P[P.length - 1]}`);
console.log(`\n--- Top 25 plus gros ajustements ---`);
changes.sort((a, b) => Math.abs(b.neu - b.old) - Math.abs(a.neu - a.old)).slice(0, 25)
  .forEach((x) => console.log(`  ${x.slug}: ${x.old} -> ${x.neu} [${x.c}]`));

if (apply) {
  fs.writeFileSync("./data/products.json", JSON.stringify(db, null, 2));
  console.log(`\n✅ APPLIQUÉ — data/products.json mis à jour.`);
} else {
  console.log(`\n(simulation — ajoute --apply pour écrire.)`);
}
