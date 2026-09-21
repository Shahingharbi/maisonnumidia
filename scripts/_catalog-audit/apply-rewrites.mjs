#!/usr/bin/env node
// Applique a data/products.json les textes reecrits de scripts/_catalog-audit/rewrites/.
// SIMULATION par defaut, --apply pour ecrire.
// Garde-fous : formules interdites (CLAUDE.md), promesses commerciales non autorisees,
// longueur minimale, jamais de changement de slug ni d'autre champ que les 2 textes.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const DIR = "./scripts/_catalog-audit/rewrites";
const NL = new RegExp("[" + String.fromCharCode(10, 13, 9) + "]", "g");
const COMB = new RegExp("[" + String.fromCharCode(0x300) + "-" + String.fromCharCode(0x36f) + "]", "g");
const APO = new RegExp("['" + String.fromCharCode(0x2019) + "]", "g");
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(COMB, "").replace(APO, " ").replace(NL, " ");
const nbMots = (s) => String(s).replace(NL, " ").split(" ").filter(Boolean).length;
const INTERDIT = ["il est important de noter", "en conclusion", "n hesitez", "pour conclure", "---",
  "/5", "certificat", "entrepot", "coffret d origine", "scelle", "douane"];

const catalog = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));

const applied = [], refuses = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(DIR + "/" + f, "utf8"));
  const p = bySlug.get(r.slug);
  if (!p) { refuses.push([r.slug, "slug absent du catalogue"]); continue; }
  const sd = (r.shortDescription || "").trim(), ld = (r.description || "").trim();
  if (!sd || !ld) { refuses.push([r.slug, "texte vide"]); continue; }
  const flat = norm(sd + " " + ld);
  const faute = INTERDIT.find((x) => flat.includes(x));
  if (faute) { refuses.push([r.slug, "formule interdite : " + faute]); continue; }
  if (nbMots(ld) < 170) { refuses.push([r.slug, "description trop courte"]); continue; }
  if (nbMots(sd) < 18) { refuses.push([r.slug, "short trop courte"]); continue; }
  const champs = [];
  if (sd !== p.shortDescription) champs.push("shortDescription");
  if (ld !== p.description) champs.push("description");
  if (!champs.length) continue;
  applied.push([r.slug, champs.join("+"), nbMots(p.description) + " -> " + nbMots(ld) + " mots"]);
  if (APPLY) { p.shortDescription = sd; p.description = ld; }
}

if (APPLY) fs.writeFileSync("./data/products.json", JSON.stringify(catalog, null, 2) + "\n");
fs.writeFileSync("./scripts/_catalog-audit/apply-rewrites-report.json", JSON.stringify({ applied, refuses }, null, 1));
console.log((APPLY ? "APPLIQUE" : "SIMULATION") + " — " + applied.length + " fiches reecrites, " + refuses.length + " refusees");
refuses.forEach((x) => console.log("  refuse " + x[0] + " : " + x[1]));
