// Génère le workflow de recherche de prix (data embarquée) -> scripts/wf-reprice-research.js
import fs from "fs";

const db = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const byBrand = {};
for (const p of db.products) {
  (byBrand[p.brand] ||= []).push([p.slug, p.name, p.concentration, p.volume, p.price]);
}
const brands = Object.keys(byBrand).sort();
const MAX = 14;
const batches = [];
let cur = { label: "", items: [] };
for (const b of brands) {
  const items = byBrand[b];
  if (items.length > MAX) {
    for (let i = 0; i < items.length; i += MAX) batches.push({ label: b, items: items.slice(i, i + MAX) });
    continue;
  }
  if (cur.items.length + items.length > MAX && cur.items.length > 0) { batches.push(cur); cur = { label: "", items: [] }; }
  cur.label = cur.label ? cur.label + "+" + b : b;
  cur.items.push(...items);
}
if (cur.items.length) batches.push(cur);

const HEADER = [
  "Tu es un expert en pricing de parfums. Pour CHAQUE produit listé, trouve son VRAI prix marché actuel et recommande un prix en Dinar Algérien (DA). Sois rigoureux, NE DEVINE PAS.",
  "",
  "Méthode (croise les sources) :",
  "1) PRIX EUROPE (source principale, fiable) : utilise WebSearch sur les détaillants discount européens (notino.fr, origines-parfums.com, premiere-avenue.com, marionnaud.fr). Trouve le prix € pour la bonne concentration ET le bon volume. Si seul un autre volume est listé, ajuste (NON linéaire : 50ml≈0.62×100ml, 75ml≈0.82×, 125ml≈1.15×, 200ml≈1.5×). Astuce efficacité : chercher la page MARQUE d'un détaillant révèle souvent plusieurs produits d'un coup.",
  "2) PRIX ALGÉRIE (cross-check secondaire) : WebSearch '<marque> <nom> prix algerie', '<nom> parfum dz', Jumia Algérie, parfumeries .dz. Les listings algériens en ligne sont rares — ne note un prix QUE si tu trouves une annonce crédible, sinon laisse vide (null).",
  "3) PRIX RECOMMANDÉ (DA) : convertis € × 270. Si un prix marché algérien crédible existe, pondère-le (le marché local fait foi). NE descends JAMAIS sous le prix actuel sauf si le produit est clairement sur-évalué vs marché (alors signale-le dans note). Arrondis à 500.",
  "4) CONFIANCE honnête : 'high' = prix européen clair trouvé pour CE produit exact ; 'medium' = estimé/ajusté depuis un autre volume ou produit proche ; 'low' = introuvable (alors recommandedDA = prix actuel, et dis-le).",
  "",
  "Tu dois charger WebSearch via ToolSearch (query \"select:WebSearch\") avant de l'utiliser. Renvoie EXACTEMENT une entrée par produit fourni, avec le slug tel quel.",
].join("\n");

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          slug: { type: "string" },
          euro: { type: ["number", "null"] },
          euroX270: { type: ["number", "null"] },
          algerianDA: { type: ["number", "null"] },
          recommendedDA: { type: "number" },
          confidence: { type: "string" },
          note: { type: "string" },
        },
        required: ["slug", "recommendedDA", "confidence", "note"],
      },
    },
  },
  required: ["results"],
};

const script = `export const meta = {
  name: 'reprice-research',
  description: 'Recherche prix marche reel (Europe + Algerie) par produit, croise, pour repricing sans erreur',
  phases: [{ title: 'Research' }],
}
const DATA = ${JSON.stringify(batches)};
const SCHEMA = ${JSON.stringify(SCHEMA)};
const HEADER = ${JSON.stringify(HEADER)};
function buildPrompt(batch) {
  const rows = batch.items.map((it) => it[0] + ' | ' + it[1] + ' | ' + it[2] + ' | ' + it[3] + ' | ' + it[4] + ' DA').join('\\n');
  return HEADER + '\\n\\nProduits (slug | nom | concentration | volume | prix actuel) :\\n' + rows;
}
log('Recherche prix sur ' + DATA.length + ' lots (' + DATA.reduce((a,b)=>a+b.items.length,0) + ' produits)');
const out = await parallel(DATA.map((batch) => () =>
  agent(buildPrompt(batch), { label: 'prix:' + batch.label.slice(0, 38), phase: 'Research', schema: SCHEMA, agentType: 'general-purpose' })
));
return out.filter(Boolean).flatMap((r) => (r && r.results) ? r.results : []);
`;

fs.writeFileSync("./scripts/wf-reprice-research.js", script);
console.log("Lots:", batches.length, "| produits:", db.products.length);
console.log("Workflow écrit: scripts/wf-reprice-research.js");
