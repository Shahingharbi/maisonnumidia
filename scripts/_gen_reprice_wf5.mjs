// Dernier lot : niches restantes + mid manquants.
import fs from "fs";
const db = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const done = new Set(JSON.parse(fs.readFileSync("./scripts/price-research-full.json", "utf8")).map((r) => r.slug));
const TARGET = ["Memo Paris", "Ex Nihilo", "Serge Lutens", "Penhaligon's", "Louis Vuitton", "Frédéric Malle", "Initio Parfums Privés", "Acqua di Parma", "Jo Malone London", "Maison Margiela", "Kayali", "Viktor & Rolf", "Marc Jacobs", "Michael Kors", "Elie Saab", "Van Cleef & Arpels", "Juliette Has A Gun"];

const byBrand = {};
for (const p of db.products) {
  if (!TARGET.includes(p.brand) || done.has(p.slug)) continue;
  (byBrand[p.brand] ||= []).push([p.slug, p.name, p.concentration, p.volume, p.price]);
}
const MAX = 14;
const batches = [];
let cur = { label: "", items: [] };
for (const b of Object.keys(byBrand).sort()) {
  const items = byBrand[b];
  if (items.length > MAX) { for (let i = 0; i < items.length; i += MAX) batches.push({ label: b, items: items.slice(i, i + MAX) }); continue; }
  if (cur.items.length + items.length > MAX && cur.items.length > 0) { batches.push(cur); cur = { label: "", items: [] }; }
  cur.label = cur.label ? cur.label + "+" + b : b;
  cur.items.push(...items);
}
if (cur.items.length) batches.push(cur);

const HEADER = [
  "Tu es un expert en pricing de parfums de NICHE. Pour CHAQUE produit, trouve son VRAI prix marché et recommande un prix en Dinar Algérien (DA). NE DEVINE PAS.",
  "Méthode : 1) PRIX EUROPE via WebSearch sur notino.fr / origines-parfums.com / premiere-avenue.com / jovoy-paris.com (bon volume ET concentration). Les niches coûtent cher (150-400€) ; ne sous-estime pas.",
  "2) PRIX ALGÉRIE (cross-check) : WebSearch '<nom> prix algerie', Jumia DZ, odorem-dz, leena-dz. Note-le si annonce crédible.",
  "3) RECOMMANDÉ (DA) = € × 270 (pondère un prix algérien crédible si trouvé). Ne descends PAS sous le prix actuel sauf sur-évaluation claire. Arrondis à 500.",
  "4) CONFIANCE : high = prix EU clair ; medium = estimé ; low = introuvable (garde l'actuel).",
  "Charge WebSearch via ToolSearch (query \"select:WebSearch\"). Renvoie une entrée par produit, slug exact.",
].join("\n");
const SCHEMA = { type: "object", additionalProperties: false, properties: { results: { type: "array", items: { type: "object", additionalProperties: false, properties: { slug: { type: "string" }, euro: { type: ["number", "null"] }, euroX270: { type: ["number", "null"] }, algerianDA: { type: ["number", "null"] }, recommendedDA: { type: "number" }, confidence: { type: "string" }, note: { type: "string" } }, required: ["slug", "recommendedDA", "confidence", "note"] } } }, required: ["results"] };

const script = `export const meta = {
  name: 'reprice-research-niche',
  description: 'Dernier lot : prix reels niches restantes',
  phases: [{ title: 'Research' }],
}
const DATA = ${JSON.stringify(batches)};
const SCHEMA = ${JSON.stringify(SCHEMA)};
const HEADER = ${JSON.stringify(HEADER)};
function buildPrompt(batch) {
  const rows = batch.items.map((it) => it[0] + ' | ' + it[1] + ' | ' + it[2] + ' | ' + it[3] + ' | ' + it[4] + ' DA').join('\\n');
  return HEADER + '\\n\\nProduits (slug | nom | concentration | volume | prix actuel) :\\n' + rows;
}
log('Lot niches : ' + DATA.length + ' agents, ' + DATA.reduce((a,b)=>a+b.items.length,0) + ' produits');
const out = await parallel(DATA.map((batch) => () =>
  agent(buildPrompt(batch), { label: 'prix:' + batch.label.slice(0, 30), phase: 'Research', schema: SCHEMA, agentType: 'general-purpose' })
));
return out.filter(Boolean).flatMap((r) => (r && r.results) ? r.results : []);
`;
fs.writeFileSync("./scripts/wf-reprice-research5.js", script);
console.log("Lots:", batches.length, "| produits:", batches.reduce((a, b) => a + b.items.length, 0));
