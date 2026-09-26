import fs from "fs";

const todo = JSON.parse(fs.readFileSync("./scripts/_catalog-add/retry-todo.json", "utf8")).slice(0, 5);
const forbidden = [
  "Il est important de noter",
  "En conclusion",
  "N'hésitez pas",
  "Pour conclure",
  "certificat de conformité",
  "nos entrepôts",
  "fournisseurs vérifiés",
  "coffret d'origine",
  "scellé",
  "dédouané",
  "---",
  "2025",
];

for (const item of todo) {
  const f = `./scripts/_catalog-add/texts/${item.slug}.json`;
  const raw = fs.readFileSync(f, "utf8");
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    console.log(item.slug, "JSON PARSE ERROR", e.message);
    continue;
  }
  const desc = obj.description;
  const words = desc.trim().split(/\s+/).length;
  const paras = desc.split("\n\n").length;
  const shortWords = obj.shortDescription.trim().split(/\s+/).length;
  const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nameCount = (desc.match(new RegExp(escaped, "g")) || []).length;
  const hits = [];
  for (const bad of forbidden) {
    if (desc.includes(bad) || obj.shortDescription.includes(bad)) hits.push(bad);
  }
  const allNotes = [
    ...(item.notes.top || []),
    ...(item.notes.heart || []),
    ...(item.notes.base || []),
  ];
  console.log(
    item.slug,
    "| descWords:", words,
    "| paras:", paras,
    "| shortWords:", shortWords,
    "| nameCount:", nameCount,
    "| forbiddenHits:", hits,
    "| notes:", JSON.stringify(allNotes)
  );
}
