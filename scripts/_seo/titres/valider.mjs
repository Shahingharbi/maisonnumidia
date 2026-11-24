#!/usr/bin/env node
// Contrôle des titres rédigés selon scripts/_seo/titres/CHARTE-finale.md.
//
//   node scripts/_seo/titres/valider.mjs scripts/_seo/titres/sorties/lot-001.json   (un lot)
//   node scripts/_seo/titres/valider.mjs --tout                                     (tous les lots, contrôles croisés)
//
// Un lot = [{ "chemin": "/parfums/x", "titre": "…", "pourquoi": "…" }]. Le titre est complet
// (suffixe compris), écrit avec des espaces normales (lib/titres.ts pose les insécables).
// Code de sortie 1 s'il reste une erreur ; les avertissements n'empêchent rien.
//
// Ce que le script vérifie (charte §1, §3, §8), et que la relecture n'a pas à refaire :
// - longueur : 60 caractères au plus, avertissement sous 40 ;
// - casse de phrase : un mot courant ne prend pas de majuscule hors tête de titre, hors nom officiel ;
// - signes et mots interdits ; pas d'année hors article ;
// - suffixe « | Maison Numidia » : jamais sur les fiches et articles ; ailleurs, présent s'il tient ;
// - faits : contenance, concentration, genre écrits dans le titre = catalogue ;
// - le nom du parfum (ou la marque) est bien dans le titre ;
// - « original » jamais après « eau de … » ni après une contenance ;
// - « parfum » seul interdit quand une sœur s'appelle « {Base} Parfum » ou « {Base} Le Parfum » ;
// - --tout : un titre par page, aucun titre partagé, tête unique par marque (désignation + description).
import fs from "fs";

const MAX = 60;
const MIN = 40;
const SUFFIXE = " | Maison Numidia";
const D = "scripts/_seo/titres";

const dossiers = new Map();
for (const f of fs.readdirSync(`${D}/dossiers`).filter((f) => /^(lot-\d+|speciaux)\.json$/.test(f)))
  for (const d of JSON.parse(fs.readFileSync(`${D}/dossiers/${f}`, "utf8"))) dossiers.set(d.chemin, d);

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();

// Mots courants qui ne prennent pas de majuscule au milieu d'un titre (charte §1)
const COURANTS = new Set(
  ("prix original originale originaux originales authentique homme hommes femme femmes mixte unisexe parfum parfums " +
    "livraison paiement wilayas wilaya eau toilette cologne extrait essence pour en de du des la le les et au aux a " +
    "avis notes note guide guides meilleur meilleurs meilleure meilleures collection toute toutes tous tout acheter achat " +
    "boutique marque marques gamme versions version disponible disponibles stock rupture epuise sur dans ou vs " +
    "classement top selection conseils comment pas cher vrai faux voir autres autre proches quelle quel difference par budget " +
    "orientaux oriental arabe arabes parfumerie").split(" ")
);
const INTERDITS = [
  [/\bCOD\b/, "sigle COD"], [/\bpromo/i, "promo"], [/\bsoldes?\b/i, "soldes"], [/\bpas cher/i, "pas cher"],
  [/meilleur prix|prix le plus bas/i, "promesse de prix"], [/\bgaranti/i, "garanti"], [/\bauthentique/i, "authentique"],
  [/100\s?%/, "100 %"], [/livraison gratuite/i, "livraison gratuite"], [/\ben stock\b|\bdisponibles?\b/i, "en stock / disponible"],
  [/\bavis\b|\bnotes?\b|étoiles?/i, "avis, note, étoiles"], [/whatsapp/i, "WhatsApp"], [/\b\d[\d\s.]*\s?(DA|DZD|dinars?)\b/i, "montant"],
  [/toute la collection/i, "toute la collection"], [/r[ée]f[ée]rences?/i, "nombre de références"], [/\boriginaux\b/i, "originaux"],
  [/\bYSL\b/, "YSL (écrire Yves Saint Laurent)"], [/\b2025\b/, "2025"],
  [/[—–]|\s-\s/, "tiret comme séparateur"], [/[()[\]!»«≡·★☆✔⚡]/, "signe interdit"],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, "émoji"], [/maison numidia.*maison numidia/i, "Maison Numidia en double"],
  [/[؀-ۿ]/, "arabe dans un titre"],
];
const CONC = [
  { re: /\beau de toilette\b|\bedt\b/i, ok: (p) => p.conc === "EDT" || /toilette/i.test(p.nom) },
  { re: /\beau de parfum\b|\bedp\b/i, ok: (p) => p.conc === "EDP" || /eau de parfum|edp/i.test(p.nom) },
  { re: /\bextrait\b/i, ok: (p) => p.conc === "Extrait de Parfum" || /extrait/i.test(p.nom) },
  { re: /\beau de cologne\b/i, ok: (p) => p.conc === "Cologne" || /cologne/i.test(p.nom) },
];
const SANS_SUFFIXE = new Set(["produit", "article"]);

function verifier(item) {
  const err = [], avert = [];
  const d = dossiers.get(item.chemin);
  const t = item.titre || "";
  if (!d) err.push("chemin inconnu");
  if (!t.trim()) return { err: ["titre vide"], avert };
  if (t !== t.trim()) err.push("espaces en début ou fin");
  if (/\s{2,}| | /.test(t)) err.push("double espace ou espace insécable (écrire des espaces normales)");
  if (t.length > MAX) err.push(`${t.length} caractères (max ${MAX})`);
  if (t.length < MIN) avert.push(`court (${t.length} caractères)`);
  // Un article peut reprendre les mots de sa requête (« lattafa khamrah avis », « parfum pas cher original ») :
  // ce sont les fiches et les pages marque qui ne doivent pas promettre un prix bas ni afficher d'avis.
  const ARTICLE_PERMIS = new Set(["pas cher", "avis, note, étoiles"]);
  for (const [re, quoi] of INTERDITS) if (re.test(t) && !(d?.type === "article" && ARTICLE_PERMIS.has(quoi) && !/étoile|★|\d\/5/.test(t))) err.push(`interdit : ${quoi}`);
  if (!d) return { err, avert };
  if (d.type !== "article" && /\b20\d\d\b/.test(t) && !/\b20\d\d\b/.test(d.nom || "")) err.push("année hors article");

  // Suffixe
  const aSuffixe = t.endsWith(SUFFIXE);
  if (SANS_SUFFIXE.has(d.type) && /maison numidia/i.test(t)) err.push("pas de « Maison Numidia » sur une fiche ou un article");
  if (!SANS_SUFFIXE.has(d.type) && d.type !== "accueil" && !aSuffixe && t.length + SUFFIXE.length <= MAX)
    err.push("suffixe « | Maison Numidia » absent alors qu'il tient");
  if (/\|/.test(t) && !/ \| (Parfumerie )?Maison Numidia$/.test(t)) err.push("« | » seulement devant Maison Numidia");

  // Casse : un seul segment exempté par « | » ; le premier mot du titre et celui après « | » peuvent prendre la majuscule
  const officielBrut = [d.nom, d.marque, d.h1].filter(Boolean).join(" ");
  t.split(/\s\|\s/).forEach((seg) => {
    seg.split(/\s+/).forEach((m, i) => {
      if (i === 0) return;
      const brut = m.replace(/[^\p{L}'’.]/gu, "").replace(/^[dl]['’]/i, "");
      if (!/^\p{Lu}\p{Ll}/u.test(brut)) return;
      const n = norm(brut);
      if (!COURANTS.has(n)) return;
      if (officielBrut.includes(brut)) return; // fait partie du nom officiel (Le Parfum, Pour Monsieur, Eau Tendre)
      if (n === "cologne" && /eau de Cologne/.test(t)) return;
      if (n === "parfumerie" && d.type === "accueil") return;
      err.push(`majuscule à « ${brut} »`);
    });
  });
  if (/ : \p{Lu}/u.test(t.replace(/ : (Maison|Parfumerie)/, "")) && !/ : [A-Z0-9][\w.]*\s/.test("")) {
    const apres = t.split(" : ")[1] || "";
    const mot = apres.split(/\s+/)[0] || "";
    if (/^\p{Lu}\p{Ll}/u.test(mot) && COURANTS.has(norm(mot))) err.push(`majuscule après « : » (${mot})`);
  }

  if (d.type === "produit") {
    const tn = norm(t);
    // « Eau de Lacoste L.12.12 … » s'écrit « Lacoste L.12.12 … » ; « Emporio Armani X » s'écrit « X d'Armani »
    let nomRef = d.nom.replace(/^Eau de \S+\s+/i, "").replace(/^Emporio Armani\s+/i, "");
    const cle = norm(nomRef).split(" ").filter((w) => w.length > 1).slice(0, 2).join(" ");
    if (cle && !tn.includes(cle)) {
      const premier = cle.split(" ")[0];
      (tn.includes(premier) ? avert : err).push(`nom du parfum absent (« ${d.nom} »)`);
    }
    for (const c of CONC) if (c.re.test(t) && !c.ok(d)) err.push(`concentration fausse : ${t.match(c.re)[0]} (catalogue : ${d.conc})`);
    const ml = t.match(/(\d+)\s?ml\b/i);
    if (ml && d.volume && norm(d.volume).replace(/\s/g, "") !== `${ml[1]}ml`) err.push(`contenance fausse : ${ml[0]} (catalogue : ${d.volume})`);
    if (/\bhomme\b/i.test(t) && d.genre === "femme" && !/homme/i.test(d.nom)) err.push("« homme » pour un parfum femme");
    if (/\bfemme\b/i.test(t) && d.genre === "homme" && !/femme/i.test(d.nom)) err.push("« femme » pour un parfum homme");
    if (/\bmixte\b/i.test(t) && d.genre !== "unisexe") err.push("« mixte » pour un parfum genré");
    if (!d.enStock && /\bprix\b|\boriginal/i.test(t)) err.push("fiche en rupture : ni prix ni original (charte 3.6)");
    if (d.enStock && /épuisé/i.test(t)) err.push("« épuisé » sur une fiche en stock");
    if (/eau de (parfum|toilette|cologne)[^:|]*\boriginal|\d+ ml original/i.test(t)) err.push("« original » après « eau de … » ou une contenance");
    // « parfum » seul interdit si une sœur s'appelle {Base} Parfum / Le Parfum (sauf sur cette sœur)
    const soeurParfum = (d.variantes || []).some((v) => /\b(le )?parfum$/i.test(v.nom.trim()));
    if (soeurParfum && !/\bparfum$/i.test(d.nom.trim())) {
      const reste = t.replace(/eau de parfum|extrait de parfum|essence de parfum/gi, "").replace(new RegExp(d.nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "");
      if (/\bparfums?\b/i.test(reste)) err.push("« parfum » seul alors qu'une sœur s'appelle « … Parfum » (charte 3.4)");
    }
  }
  if (d.type === "marque" || d.type === "fille") {
    const m = norm(d.marque);
    const court = m.split(" ").slice(-1)[0];
    if (!norm(t).includes(m) && !norm(t).includes(court)) err.push(`marque absente (« ${d.marque} »)`);
    if (!/\bprix\b/i.test(t) || !/Algérie/.test(t)) err.push("« prix » et « Algérie » obligatoires (charte §4-5)");
    if (d.type === "fille" && !/\b(homme|femme|oriental|orientaux)\b/i.test(t)) err.push("genre ou « oriental » obligatoire (charte §5)");
  }
  return { err, avert };
}

function lire(f) {
  const a = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!Array.isArray(a)) throw new Error(`${f} : un tableau est attendu`);
  return a;
}

const argv = process.argv.slice(2);
const tout = argv.includes("--tout");
const fichiers = tout
  ? fs.readdirSync(`${D}/sorties`).filter((f) => f.endsWith(".json")).map((f) => `${D}/sorties/${f}`)
  : argv.filter((a) => !a.startsWith("--"));
if (!fichiers.length) { console.error("usage : valider.mjs <lot.json> | --tout"); process.exit(2); }

let nErr = 0, nAvert = 0, n = 0;
const parTitre = new Map(), vus = new Map(), tetes = new Map();
const rapport = [];
// Fiches retirées du catalogue depuis la rédaction (fusions) : ignorées, publier.mjs les écarte aussi
const auCatalogue = new Set(JSON.parse(fs.readFileSync("data/products.json", "utf8")).products.map((p) => p.slug));
for (const f of fichiers) {
  for (const item of lire(f)) {
    const [, a, b] = (item.chemin || "").split("/");
    if (a === "parfums" && b && !auCatalogue.has(b)) { vus.set(item.chemin, f); continue; }
    n++;
    const { err, avert } = verifier(item);
    if (vus.has(item.chemin)) err.push(`chemin en double (aussi dans ${vus.get(item.chemin)})`);
    vus.set(item.chemin, f);
    const k = norm(item.titre || "");
    if (parTitre.has(k)) err.push(`même titre que ${parTitre.get(k)}`);
    else parTitre.set(k, item.chemin);
    const d = dossiers.get(item.chemin);
    if (d?.type === "produit") {
      const tete = `${norm(d.marque)}|${norm((item.titre || "").split(" : ")[0])}`;
      if (tetes.has(tete)) err.push(`même tête que ${tetes.get(tete)} (charte 3.4)`);
      else tetes.set(tete, item.chemin);
    }
    nErr += err.length; nAvert += avert.length;
    if (err.length || avert.length)
      rapport.push(`${err.length ? "✗" : "·"} ${item.chemin}  « ${item.titre} »\n${[...err.map((e) => "    erreur : " + e), ...avert.map((a) => "    avert. : " + a)].join("\n")}`);
  }
}
console.log(rapport.join("\n"));
if (tout) {
  const manquants = [...dossiers.keys()].filter((c) => !vus.has(c));
  if (manquants.length) console.log(`${manquants.length} pages sans titre, ex. ${manquants.slice(0, 5).join(", ")}`);
}
console.log(`\n${n} titres, ${nErr} erreurs, ${nAvert} avertissements`);
process.exitCode = nErr ? 1 : 0;
