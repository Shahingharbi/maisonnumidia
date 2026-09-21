#!/usr/bin/env node
// Controle des descriptions reecrites (scripts/_catalog-audit/rewrites/) avant application.
// Verifie : longueur, formules interdites (CLAUDE.md), promesses commerciales non autorisees,
// chiffres interdits (tenue, prix), repetition des accroches, et surtout NOTE HORS FICHE :
// une note olfactive citee dans le texte alors qu'elle n'est pas dans le champ notes du produit.
// Ecrit sans aucun antislash : les regex sont construites par String.fromCharCode (cf. heredoc).
import fs from "fs";

const NL = new RegExp("[" + String.fromCharCode(10, 13, 9) + "]", "g");
const COMB = new RegExp("[" + String.fromCharCode(0x300) + "-" + String.fromCharCode(0x36f) + "]", "g");
const APO = new RegExp("['" + String.fromCharCode(0x2019) + "]", "g");
const PUNCT = new RegExp("[.,;:!?()]", "g");
const LETTERS = "abcdefghijklmnopqrstuvwxyz0123456789";

const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(COMB, "").replace(APO, " ").replace(NL, " ");
const words = (s) => String(s).replace(NL, " ").split(" ").filter(Boolean);

// vrai seulement si needle apparait comme mot entier dans hay
function contains(hay, needle) {
  let i = hay.indexOf(needle);
  while (i !== -1) {
    const before = i === 0 ? " " : hay[i - 1];
    const after = hay[i + needle.length] === undefined ? " " : hay[i + needle.length];
    if (!LETTERS.includes(before) && !LETTERS.includes(after)) return true;
    i = hay.indexOf(needle, i + 1);
  }
  return false;
}

const PHRASES = [
  ["il est important de noter", "formule IA"],
  ["en conclusion", "formule IA"],
  ["n hesitez", "formule IA"],
  ["pour conclure", "formule IA"],
  ["---", "tiret ---"],
  ["/5", "note sur 5"],
  ["certificat", "promesse invérifiable"],
  ["entrepot", "promesse invérifiable"],
  ["coffret d origine", "promesse invérifiable"],
  ["scelle", "promesse invérifiable"],
  ["douane", "promesse invérifiable"],
];

const DIR = "./scripts/_catalog-audit/rewrites";
const catalog = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));

// vocabulaire des notes olfactives de tout le catalogue
const vocab = new Set();
for (const p of catalog.products) {
  for (const k of ["top", "heart", "base"]) for (const n of p.notes[k] || []) {
    const v = norm(n).trim();
    if (v.length > 4) vocab.add(v);
  }
}

// Vocabulaire d'accord / de famille : descriptif, pas une revendication de note precise.
const GENERIQUE = new Set(["agrumes","citrus","aquatique","notes aquatiques","notes marines","marine","marines",
  "sucre","sucree","poudre","poudree","fleurs","fleurs blanches","fruits","fruits confits","fruits rouges",
  "epices","notes epicees","notes florales","notes vertes","notes boisees","notes aromatiques","aromatiques",
  "fumee","fraicheur","notes fruitees","notes sucrees","notes poudrees","notes ambrees","notes lactees",
  "notes gourmandes","notes animales","notes minerales","notes salines","notes solaires","notes terreuses",
  "resines","balsamique","chypre","fougere","cuir"]);

const ok = [], ko = [];
const accroches = new Map();
const files = fs.readdirSync(DIR).filter((x) => x.endsWith(".json"));

for (const f of files) {
  let r;
  try { r = JSON.parse(fs.readFileSync(DIR + "/" + f, "utf8")); }
  catch (e) { ko.push({ slug: f, problems: ["JSON illisible"] }); continue; }
  const p = bySlug.get(r.slug);
  const problems = [];
  if (!p) problems.push("slug absent du catalogue");

  const sd = r.shortDescription || "", ld = r.description || "";
  const nw = words(ld).length, sw = words(sd).length;
  if (nw < 170 || nw > 380) problems.push("description " + nw + " mots");
  if (sw < 18 || sw > 75) problems.push("short " + sw + " mots");

  const flat = norm(sd + " " + ld);
  for (const [needle, label] of PHRASES) if (flat.includes(needle)) problems.push(label + " (" + needle + ")");
  if ((sd + ld).includes(String.fromCharCode(0x2605))) problems.push("étoile");

  // chiffres interdits : "8 heures", "12 000 DA"
  const toks = norm(sd + " " + ld).replace(PUNCT, " ").split(" ").filter(Boolean);
  for (let i = 0; i < toks.length - 1; i++) {
    const isNum = toks[i].length > 0 && [...toks[i]].every((c) => "0123456789".includes(c));
    if (!isNum) continue;
    const next = toks[i + 1];
    if (next.startsWith("heure") || next === "h") problems.push("tenue chiffrée");
    if (next === "da" || next.startsWith("dinar")) problems.push("prix cité");
  }

  // notes citees hors fiche
  if (p) {
    const fiche = ["top", "heart", "base"].flatMap((k) => (p.notes[k] || []).map((n) => norm(n).trim()));
    const couvert = (v) => fiche.some((n) => n === v || n.includes(v) || v.includes(n));
    const intruses = [...vocab].filter((v) => !GENERIQUE.has(v) && !couvert(v) && contains(flat, v));
    if (intruses.length) {
      const extrait = (v) => { const i = flat.indexOf(v); return flat.slice(Math.max(0, i - 35), i + v.length + 30); };
      problems.push("note hors fiche : " + intruses.slice(0, 3).map((v) => v + " [..." + extrait(v) + "...]").join(" ; "));
    }
  }

  const acc = norm(sd).split(".")[0].trim().slice(0, 40);
  if (acc) accroches.set(acc, (accroches.get(acc) || 0) + 1);
  (problems.length ? ko : ok).push({ slug: r.slug, problems });
}

console.log("fichiers : " + files.length + "  |  conformes : " + ok.length + "  |  a revoir : " + ko.length);
for (const x of ko.slice(0, 25)) console.log("  ! " + x.slug + " -> " + x.problems.join(" | "));
if (ko.length > 25) console.log("  ... " + (ko.length - 25) + " autres dans rewrite-check.json");
const repet = [...accroches.entries()].filter((e) => e[1] > 3).sort((a, b) => b[1] - a[1]);
console.log(repet.length ? "accroches repetees : " + repet.slice(0, 5).map((e) => e[0] + " x" + e[1]).join(" | ") : "accroches variees OK");
fs.writeFileSync("./scripts/_catalog-audit/rewrite-check.json", JSON.stringify({ ok: ok.map((x) => x.slug), ko }, null, 1));
