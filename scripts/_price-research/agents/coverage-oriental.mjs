#!/usr/bin/env node
// Compte rapide (par nom) des 71 cibles orientales présentes dans un fichier raw2.
// Usage: node scripts/_price-research/agents/coverage-oriental.mjs cle [--verbose]
import fs from "fs";

const key = process.argv[2];
const verbose = process.argv.includes("--verbose");
const targets = JSON.parse(fs.readFileSync("./scripts/_price-research/oriental-targets.json", "utf8"));
const items = JSON.parse(fs.readFileSync(`./scripts/_price-research/raw2/${key}.json`, "utf8"));

const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/['’`]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const BRAND_ALIASES = {
  "al haramain": ["haramain"], lattafa: ["lattafa"], rasasi: ["rasasi", "rassassi", "rasassi"],
  "swiss arabian": ["swiss arabian"], ajmal: ["ajmal"], montale: ["montale"], mancera: ["mancera"],
  afnan: ["afnan"], armaf: ["armaf"], "arabian oud": ["arabian oud"], "al rehab": ["rehab"],
  "el nabil": ["nabil"], orientica: ["orientica"], "tom ford": ["tom ford"], zara: ["zara"], "penhaligon s": ["penhaligon"],
};
const ORIENTAL_BRANDS = ["lattafa", "haramain", "rasasi", "rassassi", "swiss arabian", "ajmal", "montale", "mancera", "afnan", "armaf", "arabian oud", "rehab", "nabil", "orientica", "ard al zaafaran", "maison alhambra", "fragrance world", "french avenue", "khadlaj", "zimaya", "rayhaan", "ibraheem al qurashi", "abdul samad"];
const STOP = new Set(["pour", "homme", "femme", "for", "him", "her", "edition", "de", "the", "of", "al", "el", "eau", "parfum"]);

const fix = (s) => s.replace(/ khamra /g, " khamrah ").replace(/ assad /g, " asad ").replace(/ rassassi /g, " rasasi ");
const hay = items.map((it) => ({ it, h: fix(" " + norm(`${it.brand || ""} ${it.name}`) + " ") }));
const oriental = hay.filter(({ h }) => ORIENTAL_BRANDS.some((b) => h.includes(` ${b}`)));

let found = 0;
const lines = [];
for (const t of targets) {
  const bn = norm(t.brand);
  const aliases = BRAND_ALIASES[bn] || [bn];
  const words = norm(t.name).split(" ").filter((w) => w && !STOP.has(w));
  const hits = hay.filter(({ h }) => aliases.some((a) => h.includes(a)) && words.every((w) => h.includes(` ${w}`)));
  // exclut les flankers évidents quand la cible est le modèle de base
  const strict = hits.filter(({ h }) => !/ (intense|elixir|noir|tobacco|bleu|gold|knight|femme|pour elle|evening|day|extreme|rouge|ice|viper|tropical|candy|moi|qahwa|dukhan|waha) /.test(h.replace(norm(t.name), "")) || words.some((w) => / (intense|noir|tobacco|bleu|gold|knight|femme|elle|evening|day)/.test(" " + w)));
  const use = strict.length ? strict : hits;
  if (use.length) found++;
  lines.push(`${use.length ? "OK " : "-- "} ${t.brand} ${t.name} ${t.volume}${use.length ? "  => " + use.slice(0, 3).map(({ it }) => `${it.name} [${it.price}]`).join(" | ") : ""}`);
}
console.log(`[${key}] ${items.length} produits, ${oriental.length} orientaux (marques du Golfe/Montale/Mancera/Armaf…), cibles trouvées ~${found}/71`);
if (verbose) console.log(lines.join("\n"));
