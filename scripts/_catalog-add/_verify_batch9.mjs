import fs from "fs";

const slugs = [
"hugo-boss-the-scent-for-her-magnetic",
"hugo-boss-the-scent-for-him-magnetic",
"hugo-boss-the-scent-pure-accord-for-her",
"hugo-boss-x-krink",
"jean-paul-gaultier-classique-airlines",
"jean-paul-gaultier-divine",
"jean-paul-gaultier-classique-pride-edition-2026",
"jean-paul-gaultier-la-cologne-fleur-du-male",
"jean-paul-gaultier-le-male-terrible",
"jean-paul-gaultier-scandal-elixir",
"jean-paul-gaultier-scandal-intense",
"lancome-off-now",
"lancome-over-the-top",
"lancome-hypnose-senses"
];

const forbidden = [
  "Il est important de noter",
  "En conclusion",
  "N’hésitez pas",
  "N'hésitez pas",
  "Pour conclure",
  "---",
  "certificat de conformité",
  "nos entrepôts",
  "fournisseurs vérifiés",
  "coffret d'origine",
  "scellé",
  "dédouané",
  "2025",
  "★",
  "Que vous soyez"
];

// load todo data for notes-leak check
const todo = JSON.parse(fs.readFileSync("./scripts/_catalog-add/textes-todo.json", "utf8"));
const bySlug = {};
for (const item of todo) bySlug[item.slug] = item;

let allOk = true;
for (const s of slugs) {
  const p = `scripts/_catalog-add/texts/${s}.json`;
  if (!fs.existsSync(p)) { console.log("MISSING FILE:", s); allOk = false; continue; }
  const raw = fs.readFileSync(p, "utf8");
  let obj;
  try { obj = JSON.parse(raw); } catch (e) { console.log("JSON PARSE ERROR:", s, e.message); allOk = false; continue; }
  if (obj.slug !== s) { console.log("SLUG MISMATCH:", s, obj.slug); allOk = false; }
  const shortWords = obj.shortDescription.trim().split(/\s+/).length;
  const descWords = obj.description.trim().split(/\s+/).length;
  const paras = obj.description.split("\n\n").length;
  let flag = "";
  for (const f of forbidden) {
    if (obj.description.includes(f) || obj.shortDescription.includes(f)) flag += " [FORBIDDEN:" + f + "]";
  }
  if (shortWords < 30 || shortWords > 50) flag += ` [SHORT_WORDS=${shortWords}]`;
  if (descWords < 220 || descWords > 300) flag += ` [DESC_WORDS=${descWords}]`;
  if (paras < 3 || paras > 4) flag += ` [PARAS=${paras}]`;
  console.log(s, "short:" + shortWords, "desc:" + descWords, "paras:" + paras, flag);
  if (flag) allOk = false;
}
console.log(allOk ? "ALL OK" : "SOME ISSUES");
