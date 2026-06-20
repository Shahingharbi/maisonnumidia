// Lot final : marques pas chères / mid encore sur modèle. Plancher 6000 DA strict.
import fs from "fs";
const db = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const done = new Set(JSON.parse(fs.readFileSync("./scripts/price-research-full.json", "utf8")).map((r) => r.slug));
// Marques déjà calées à la main (Tom Ford PB, Mancera, PdM) -> on ne re-recherche pas.
const SKIP = new Set(["Tom Ford", "Mancera", "Parfums de Marly"]);

const byBrand = {};
for (const p of db.products) {
  if (done.has(p.slug) || SKIP.has(p.brand)) continue;
  (byBrand[p.brand] ||= []).push([p.slug, p.name, p.concentration, p.volume, p.price]);
}
const MAX = 16;
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
  "Tu es un expert en pricing de parfums pour le marché ALGÉRIEN. Pour CHAQUE produit, recommande un prix de vente réaliste en Dinar Algérien (DA). NE DEVINE PAS au hasard.",
  "",
  "RÈGLE ABSOLUE : le prix MINIMUM de vente en Algérie est 6000 DA. Ne recommande JAMAIS un prix inférieur à 6000 DA, même pour une marque bon marché (Franck Olivier, Pierre Cardin, Evaflor, célébrités, Al Rehab...). En Algérie, les marges d'import + la logistique COD font qu'aucun parfum ne se vend sous 6000 DA.",
  "",
  "Méthode :",
  "1) PRIX EUROPE : WebSearch sur notino.fr / origines-parfums.com pour avoir le prix marché € (bon volume/concentration), puis × 270.",
  "2) PRIX ALGÉRIE (très utile ici) : WebSearch '<nom> prix algerie', Jumia DZ, parfumerie dz. Ces marques mainstream sont souvent listées en Algérie — utilise ce prix local s'il est crédible.",
  "3) RECOMMANDÉ (DA) = prix marché local algérien si trouvé, sinon € × 270 ; PLANCHER 6000 DA strict ; cohérence intra-marque (les produits d'une même marque doivent avoir des prix proches/logiques) ; arrondi à 500.",
  "4) CONFIANCE : high = prix clair trouvé (EU ou DZ) ; medium = estimé ; low = introuvable (mets au moins 6000, ou le prix actuel s'il est >6000).",
  "",
  "Ces marques sont surtout mainstream/orientales accessibles — sois efficace (le prix de gamme de la marque suffit souvent). Charge WebSearch via ToolSearch. Renvoie une entrée par produit, slug exact.",
].join("\n");
const SCHEMA = { type: "object", additionalProperties: false, properties: { results: { type: "array", items: { type: "object", additionalProperties: false, properties: { slug: { type: "string" }, euro: { type: ["number", "null"] }, euroX270: { type: ["number", "null"] }, algerianDA: { type: ["number", "null"] }, recommendedDA: { type: "number" }, confidence: { type: "string" }, note: { type: "string" } }, required: ["slug", "recommendedDA", "confidence", "note"] } } }, required: ["results"] };

const script = `export const meta = {
  name: 'reprice-research-floor6000',
  description: 'Lot final : marques mid/pas cheres, plancher 6000 DA, marche algerien',
  phases: [{ title: 'Research' }],
}
const DATA = ${JSON.stringify(batches)};
const SCHEMA = ${JSON.stringify(SCHEMA)};
const HEADER = ${JSON.stringify(HEADER)};
function buildPrompt(batch) {
  const rows = batch.items.map((it) => it[0] + ' | ' + it[1] + ' | ' + it[2] + ' | ' + it[3] + ' | ' + it[4] + ' DA').join('\\n');
  return HEADER + '\\n\\nProduits (slug | nom | concentration | volume | prix actuel) :\\n' + rows;
}
log('Lot plancher 6000 : ' + DATA.length + ' agents, ' + DATA.reduce((a,b)=>a+b.items.length,0) + ' produits');
const out = await parallel(DATA.map((batch) => () =>
  agent(buildPrompt(batch), { label: 'prix:' + batch.label.slice(0, 28), phase: 'Research', schema: SCHEMA, agentType: 'general-purpose' })
));
return out.filter(Boolean).flatMap((r) => (r && r.results) ? r.results : []);
`;
fs.writeFileSync("./scripts/wf-reprice-research6.js", script);
console.log("Lots:", batches.length, "| produits:", batches.reduce((a, b) => a + b.items.length, 0));
