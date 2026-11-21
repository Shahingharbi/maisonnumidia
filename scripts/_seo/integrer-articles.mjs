#!/usr/bin/env node
// Intègre dans data/blog.ts les articles relus de content/blog-brouillons/ (JSON produits par le
// workflow articles-seo-geo), après contrôle. SIMULATION par défaut, --apply pour écrire.
//
//   node scripts/_seo/integrer-articles.mjs [--apply]
//
// Contrôles bloquants : chaque lien interne et chaque jeton {{prix:slug}} vise une page qui existe
// (fiche en stock, marque, article, catégorie, page filtrée non doublon), meta description ≤ 155
// caractères sans tiret long ni prix, aucune formule interdite du CLAUDE.md.
// Un article de même slug est remplacé ; ceux listés dans `remplace` sont retirés (301 à poser
// dans next.config.ts : le script affiche la ligne).
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const DIR = "./content/blog-brouillons";
const BLOG = "./data/blog.ts";
const cat = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const fiches = new Map(cat.products.map((p) => [p.slug, p]));
const marques = new Set(cat.brands.map((b) => b.slug));

const src = fs.readFileSync(BLOG, "utf8");
const debutTableau = src.indexOf("export const articles: BlogArticle[] = [");
const finTableau = src.indexOf("\n];", debutTableau);
const entrees = [...src.matchAll(/\n  \{\n    slug: "([^"]+)"/g)].filter((m) => m.index > debutTableau && m.index < finTableau);
const blocs = entrees.map((m, i) => ({ slug: m[1], debut: m.index, fin: i + 1 < entrees.length ? entrees[i + 1].index : finTableau }));

const brouillons = fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(`${DIR}/${f}`, "utf8")));
const retires = new Set(brouillons.flatMap((a) => a.remplace || []));
const slugsBlog = new Set([...blocs.map((b) => b.slug), ...brouillons.map((a) => a.slug)].filter((s) => !retires.has(s)));

const genreOk = (section, marque) => {
  const ps = cat.products.filter((p) => p.brandSlug === marque);
  const f = { "parfums-homme": (p) => p.gender === "homme" || p.gender === "unisexe", "parfums-femme": (p) => p.gender === "femme" || p.gender === "unisexe", "parfums-orientaux": (p) => p.category === "parfums-orientaux" }[section];
  const sel = ps.filter(f);
  if (!sel.length) return "aucun produit de la marque dans cette section";
  if (sel.length === ps.length) return `doublon de /marques/${marque} : lier la page marque`;
  return null;
};
function verifierLien(url) {
  const [chemin] = url.split(/[?#]/);
  if (/^https?:/.test(chemin)) return null;
  if (["/", "/parfums-homme", "/parfums-femme", "/parfums-orientaux", "/livraison", "/blog", "/marques", "/plan-du-site"].includes(chemin)) return null;
  let m;
  if ((m = chemin.match(/^\/parfums\/([^/]+)$/))) { const p = fiches.get(m[1]); return !p ? "fiche inexistante" : !p.inStock ? "fiche en rupture" : null; }
  if ((m = chemin.match(/^\/marques\/([^/]+)$/))) return marques.has(m[1]) ? null : "marque inexistante";
  if ((m = chemin.match(/^\/(parfums-(?:homme|femme|orientaux))\/([^/]+)$/))) return genreOk(m[1], m[2]);
  if ((m = chemin.match(/^\/blog\/([^/]+)$/))) return slugsBlog.has(m[1]) ? null : "article inexistant";
  return "chemin inconnu";
}
const INTERDITS = [/il est important de noter/i, /en conclusion/i, /n'hésitez pas/i, /\bCOD\b/, /whatsapp/i, /\b2025\b/, /^---/m, /★|☆|\d([.,]\d)?\s?\/\s?5\b/];

let erreurs = 0;
for (const a of brouillons) {
  const pb = [];
  const textes = [a.content, a.excerpt, ...(a.faq || []).flatMap((f) => [f.question, f.answer])].join("\n");
  for (const [, url] of textes.matchAll(/\]\(([^)]+)\)/g)) { const e = verifierLien(url); if (e) pb.push(`lien ${url} : ${e}`); }
  for (const [, s] of textes.matchAll(/\{\{prix:([a-z0-9-]+)\}\}/g)) { const p = fiches.get(s); if (!p || !p.inStock) pb.push(`jeton prix ${s} : ${p ? "rupture" : "inexistant"}`); }
  if ((a.faq || []).some((f) => /\{\{prix:/.test(f.answer))) pb.push("jeton de prix dans la FAQ (non remplacé à l'affichage)");
  if (a.metaDescription.length > 155) pb.push(`meta description ${a.metaDescription.length} caractères`);
  if (/—|\d[\d\s]*\s?DA\b/.test(a.metaDescription)) pb.push("meta description : tiret long ou prix");
  if (/maison numidia/i.test(a.metaTitle)) pb.push("metaTitle contient Maison Numidia");
  for (const re of INTERDITS) if (re.test(textes)) pb.push(`formule interdite ${re}`);
  console.log(`${pb.length ? "✗" : "✓"} ${a.slug} (${a.content.split(/\s+/).length} mots, ${(a.faq || []).length} questions)`);
  pb.forEach((p) => console.log("    " + p));
  erreurs += pb.length;
}
if (erreurs) { console.log(`\n${erreurs} problème(s) : rien n'est écrit.`); process.exit(1); }

const ts = (v) => JSON.stringify(v);
function entree(a) {
  const champs = [
    `    slug: ${ts(a.slug)},`, `    title: ${ts(a.title)},`, `    metaTitle: ${ts(a.metaTitle)},`,
    `    metaDescription: ${ts(a.metaDescription)},`, `    publishedAt: ${ts(a.publishedAt)},`,
    `    category: ${ts(a.category)},`, `    readTime: ${a.readTime},`, `    excerpt: ${ts(a.excerpt)},`,
    `    content: ${ts(a.content)},`,
    `    author: { name: ${ts(a.author?.name || "L'équipe Maison Numidia")}, role: ${ts(a.author?.role || "Parfumerie en ligne, Blida")} },`,
    `    faq: [\n${(a.faq || []).map((f) => `      { question: ${ts(f.question)}, answer: ${ts(f.answer)} },`).join("\n")}\n    ],`,
  ];
  return `\n  {\n${champs.join("\n")}\n  },`;
}

let out = src.slice(0, finTableau);
const parSlug = new Map(brouillons.map((a) => [a.slug, a]));
// On reconstruit le tableau bloc par bloc : remplacés, retirés, conservés, puis les nouveaux à la fin.
let corps = "";
for (const b of blocs) {
  if (retires.has(b.slug)) { console.log(`retiré : ${b.slug}`); continue; }
  if (parSlug.has(b.slug)) { corps += entree(parSlug.get(b.slug)); console.log(`remplacé : ${b.slug}`); parSlug.delete(b.slug); continue; }
  let t = src.slice(b.debut, b.fin).replace(/\s+$/, "");
  if (!t.endsWith(",")) t += ",";
  corps += t;
}
for (const a of parSlug.values()) { corps += entree(a); console.log(`ajouté : ${a.slug}`); }
out = src.slice(0, blocs[0].debut) + corps + "\n" + src.slice(finTableau);

for (const s of retires) console.log(`→ 301 à poser : { source: "/blog/${s}", destination: "/blog/${brouillons.find((a) => (a.remplace || []).includes(s)).slug}", permanent: true },`);
if (APPLY) { fs.writeFileSync(BLOG, out); console.log("\ndata/blog.ts écrit."); } else console.log("\nSIMULATION : relancer avec --apply.");
