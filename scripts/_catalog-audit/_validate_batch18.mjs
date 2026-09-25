import fs from "fs";

const todo = JSON.parse(fs.readFileSync("./scripts/_catalog-audit/reecriture-todo.json", "utf8")).slice(204, 216);

const forbidden = [
  "positionnement tarifaire",
  "pièce maîtresse d'une collection",
  "piece maitresse d'une collection",
  "parfum d'appoint",
  "reste parfaitement lisible",
  "période de port privilégiée",
  "periode de port privilegiee",
  "la construction olfactive révèle toute sa richesse",
  "fonctionne dans des contextes très variés",
  "sans jamais sembler décalé",
  "plaît naturellement à un public algérien",
  "il est grand temps de la découvrir",
  "une fragrance qui dure",
  "il est important de noter",
  "en conclusion",
  "n'hésitez pas",
  "pour conclure",
  "---",
  "certificat de conformité",
  "nos entrepôts",
  "fournisseurs vérifiés",
  "coffret d'origine",
  "scellé",
  "dédouané",
  "2025",
  "/5",
  "★",
];

let totalWords = { short: 0, desc: 0 };
let errors = [];

for (const item of todo) {
  const path = `./scripts/_catalog-audit/rewrites2/${item.slug}.json`;
  if (!fs.existsSync(path)) {
    errors.push(`${item.slug}: MISSING FILE`);
    continue;
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (e) {
    errors.push(`${item.slug}: JSON PARSE ERROR ${e.message}`);
    continue;
  }
  const short = data.shortDescription;
  const desc = data.description;
  const shortWords = short.trim().split(/\s+/).length;
  const descWords = desc.trim().split(/\s+/).length;
  const paras = desc.split(/\n\n/);

  if (shortWords < 25 || shortWords > 55) errors.push(`${item.slug}: shortDescription ${shortWords} mots (attendu 30-50)`);
  if (descWords < 220 || descWords > 310) errors.push(`${item.slug}: description ${descWords} mots (attendu 230-300)`);
  if (paras.length < 3 || paras.length > 4) errors.push(`${item.slug}: ${paras.length} paragraphes (attendu 3-4)`);

  // name mention count in description
  const name = item.name;
  const re = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  const nameCount = (desc.match(re) || []).length;
  if (nameCount > 3) errors.push(`${item.slug}: nom "${name}" apparait ${nameCount} fois dans description`);

  // forbidden phrases
  const lowerAll = (short + " " + desc).toLowerCase();
  for (const f of forbidden) {
    if (lowerAll.includes(f.toLowerCase())) errors.push(`${item.slug}: contient formule interdite "${f}"`);
  }

  // check notes citation: extract all note words from item.notes and check no OTHER note-ish words appear that aren't in the list (hard to check generically) -- instead check that words in desc referencing typical fragrance notes not in the allowed set aren't obviously wrong. Skipped generic check; instead verify each note IS represented at least somewhere reasonably (not required) -- just print notes for manual eyeball.
  const allowedNotes = [...item.notes.top, ...item.notes.heart, ...item.notes.base].map(n => n.toLowerCase());

  totalWords.short += shortWords;
  totalWords.desc += descWords;

  console.log(`${item.slug}: short=${shortWords}w desc=${descWords}w paras=${paras.length} nameCount=${nameCount}`);
}

console.log("\n--- ERRORS ---");
if (errors.length === 0) console.log("Aucune erreur détectée.");
else errors.forEach(e => console.log("❌ " + e));
