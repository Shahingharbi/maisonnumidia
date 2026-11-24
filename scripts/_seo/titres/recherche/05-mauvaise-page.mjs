// Q5 : requêtes servies par la mauvaise fiche (une déclinaison récolte la requête de la version de
// base, ou l'inverse), et requêtes de marque servies par une fiche.
// Base : rp-A (échantillon requête × page). Script jetable :
//   node scripts/_seo/titres/recherche/05-mauvaise-page.mjs
import { rp, produits, catalogue, somme } from "../../../_gsc/lib-analyse.mjs";

const ALIAS = {
  "yves-saint-laurent": ["yves saint laurent", "ysl", "saint laurent"], "giorgio-armani": ["giorgio armani", "armani"],
  "armani": ["giorgio armani", "armani"], "paco-rabanne": ["paco rabanne", "rabanne", "paco"],
  "jean-paul-gaultier": ["jean paul gaultier", "gaultier", "jpg"], "calvin-klein": ["calvin klein", "ck"],
  "dolce-gabbana": ["dolce gabbana", "dolce and gabbana", "dolce", "gabbana", "dg"], "carolina-herrera": ["carolina herrera", "carolina", "herrera"],
  "mont-blanc": ["mont blanc", "montblanc"], "hugo-boss": ["hugo boss", "boss", "hugo"], "louis-vuitton": ["louis vuitton", "vuitton", "lv"],
  "thierry-mugler": ["thierry mugler", "mugler"], "mugler": ["mugler", "thierry mugler"], "bvlgari": ["bvlgari", "bulgari"],
  "parfums-de-marly": ["parfums de marly", "parfum de marly", "marly"], "viktor-rolf": ["viktor rolf", "viktor"],
  "franck-olivier": ["franck olivier", "frank olivier"], "narciso-rodriguez": ["narciso rodriguez", "narciso"],
};
const GENRE_F = /\b(pour elle|for her|elle|her|femme|femmes|women|woman|lady)\b|(نسائي|للنساء)/g;
const GENRE_H = /\b(pour homme|for him|him|homme|hommes|men|man)\b|(رجالي|للرجال)/g;
const STOP = new Set(["de", "du", "la", "le", "les", "l", "d", "the", "of", "by", "a", "et", "and", "pour", "for", "parfum", "parfums", "perfume", "fragrance",
  "prix", "price", "algerie", "algeria", "dz", "original", "originale", "en", "au", "chez", "acheter", "ml", "da", "dinar", "عطر", "سعر", "في", "الجزائر", "ou", "trouver", "combien", "coute", "site", "boutique"]);

function texte(s) {
  return " " + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC")
    .replace(/&/g, " ").replace(/['’`´]/g, " ").replace(/[^a-z0-9؀-ۿ]+/g, " ")
    .replace(/\beau de parfum\b/g, "edp").replace(/\beau de toilette\b/g, "edt").replace(/\bextrait de parfum\b/g, "extrait")
    .replace(/\ble parfum\b/g, "leparfum").replace(/\beau de cologne\b/g, "cologne")
    .replace(/\b\d+ ?ml\b/g, " ").replace(/\s+/g, " ").trim() + " ";
}
function jetons(s, aliasMarque = []) {
  let t = texte(s);
  for (const a of aliasMarque) t = t.replace(new RegExp(` ${a} `, "g"), " ");
  const g = new Set();
  if (GENRE_F.test(t)) g.add("F"); GENRE_F.lastIndex = 0;
  if (GENRE_H.test(t)) g.add("H"); GENRE_H.lastIndex = 0;
  t = t.replace(GENRE_F, " ").replace(GENRE_H, " ");
  const mots = new Set(t.split(" ").filter((w) => w && !STOP.has(w)));
  return { mots, g };
}
const CONC = { EDP: "edp", "EDP Intense": "edp", EDT: "edt", "EDT Intense": "edt", Parfum: "leparfum", "Extrait de Parfum": "extrait", Extrait: "extrait", Cologne: "cologne", EDC: "cologne" };

// Jetons de chaque fiche (nom sans la marque)
const parMarque = new Map();
for (const p of catalogue.products) {
  const al = [...new Set([texte(p.brand).trim(), ...(ALIAS[p.brandSlug] || [])])].sort((a, b) => b.length - a.length);
  const j = jetons(p.name, al);
  const m = { p, mots: j.mots, g: j.g, conc: CONC[p.concentration] || null, al };
  (parMarque.get(p.brandSlug) || parMarque.set(p.brandSlug, []).get(p.brandSlug)).push(m);
}

const lignes = rp("A").filter((l) => l.type === "produit" && !/numidia/i.test(l.requete));
const impParReqPage = new Map(lignes.map((l) => [l.requete + "|" + l.chemin, l]));
const erreurs = [], marqueSeule = [];
let analysees = 0, ambigues = 0;
for (const l of lignes) {
  const servi = produits.get(l.chemin.split("/")[2]);
  if (!servi) continue;
  const membres = parMarque.get(servi.brandSlug) || [];
  const mServi = membres.find((m) => m.p.slug === servi.slug);
  if (!mServi) continue;
  const q = jetons(l.requete, mServi.al);
  const qConc = ["edp", "edt", "leparfum", "extrait", "cologne"].find((c) => q.mots.has(c));
  // un membre est compatible si tous ses mots (hors concentration) et son genre écrit sont dans la requête
  const score = (m) => {
    const mots = [...m.mots].filter((w) => !["edp", "edt", "leparfum", "extrait", "cologne"].includes(w));
    if (!mots.length) return -1;
    if (!mots.every((w) => q.mots.has(w))) return -1;
    if ([...m.g].some((g) => !q.g.has(g))) return -1;
    // les mots de concentration écrits dans le nom (« Sauvage Eau de Parfum ») doivent être tapés aussi
    const concNom = [...m.mots].filter((w) => ["edp", "edt", "leparfum", "extrait", "cologne"].includes(w));
    if (concNom.some((w) => !q.mots.has(w))) return -1;
    let s = mots.length * 10 + concNom.length * 10 + m.g.size * 5;
    if (qConc && m.conc === qConc) s += 3;
    if (q.g.has("F") && m.p.gender === "femme") s += 1;
    if (q.g.has("H") && m.p.gender === "homme") s += 1;
    return s;
  };
  const notes = membres.map((m) => ({ m, s: score(m) })).filter((x) => x.s >= 0).sort((a, b) => b.s - a.s);
  if (!notes.length) {
    // requête de marque pure servie par une fiche ?
    // fiche « signature » (Franck Olivier, Dior Homme, Prada L'Homme) : la requête de marque est la sienne
    const nomVide = mServi.mots.size === 0;
    if (q.mots.size === 0 && !nomVide) marqueSeule.push({ l, servi });
    continue;
  }
  analysees++;
  const meilleur = notes[0];
  if (meilleur.m.p.slug === servi.slug) continue;
  const sServi = notes.find((x) => x.m.p.slug === servi.slug)?.s ?? -1;
  if (sServi === meilleur.s) continue;
  if (notes[1] && notes[1].s === meilleur.s) { ambigues++; continue; }
  // sens de l'erreur
  const motsB = new Set([...meilleur.m.mots]), motsS = new Set([...mServi.mots]);
  const sousEns = (a, b) => [...a].every((w) => b.has(w));
  const sens = sousEns(motsB, motsS) && motsS.size > motsB.size ? "la déclinaison prend la requête de la base"
    : sousEns(motsS, motsB) && motsB.size > motsS.size ? "la base prend la requête de la déclinaison"
    : motsB.size === motsS.size && sousEns(motsB, motsS) ? "même nom, autre concentration / genre"
    : "parfum voisin (autre déclinaison)";
  const bonne = impParReqPage.get(l.requete + "|/parfums/" + meilleur.m.p.slug);
  erreurs.push({ l, servi, bonne: meilleur.m.p, sens, impBonne: bonne?.imp || 0, posBonne: bonne?.pos, clicsBonne: bonne?.clics || 0 });
}

const out = [];
const totProd = somme(lignes);
const sErr = somme(erreurs.map((e) => e.l));
out.push(`Base : rp-A, fiches produit, ${lignes.length} couples requête × fiche, ${totProd.imp} imp. Requêtes rattachables sans ambiguïté à une fiche précise de la même marque : ${analysees} couples (${ambigues} cas à égalité écartés).`);
out.push(`Servies par une AUTRE fiche que celle qu'elles nomment : ${erreurs.length} couples, ${sErr.imp} imp, ${sErr.clics} clics, CTR ${(sErr.ctr * 100).toFixed(1)} %, pos ${sErr.pos.toFixed(1)}.`);
const parSens = {};
for (const e of erreurs) (parSens[e.sens] ??= []).push(e.l);
for (const [s, ls] of Object.entries(parSens)) { const x = somme(ls); out.push(`- ${s} : ${ls.length} couples, ${x.imp} imp, CTR ${(x.ctr * 100).toFixed(1)} %, pos ${x.pos.toFixed(1)}`); }
const bonnesAussi = erreurs.filter((e) => e.impBonne > 0);
out.push(`Dans ${bonnesAussi.length} de ces couples, la bonne fiche reçoit aussi des impressions sur la même requête (partage) ; dans ${erreurs.length - bonnesAussi.length}, elle n'apparaît pas du tout dans l'échantillon.`);
out.push("");
out.push("### Les plus gros cas (par impressions sur la mauvaise fiche) : 30 « déclinaison prend la base », puis 15 des autres sens");
out.push("| requête | servie par | imp | clics | pos | fiche qui correspond | imp / clics / pos de la bonne fiche | cas |");
out.push("|---|---|---|---|---|---|---|---|");
erreurs.sort((a, b) => b.l.imp - a.l.imp);
for (const e of [...erreurs.filter((e) => e.sens === "la déclinaison prend la requête de la base").slice(0, 30), ...erreurs.filter((e) => e.sens !== "la déclinaison prend la requête de la base").slice(0, 15)])
  out.push(`| ${e.l.requete} | ${e.servi.slug} | ${e.l.imp} | ${e.l.clics} | ${e.l.pos.toFixed(1)} | ${e.bonne.slug} | ${e.impBonne ? `${e.impBonne} / ${e.clicsBonne} / ${e.posBonne.toFixed(1)}` : "absente"} | ${e.sens} |`);

// Par couple de fiches
out.push("");
out.push("### Par couple (fiche servie → fiche nommée), cumul des requêtes");
const couples = new Map();
for (const e of erreurs) {
  const k = `${e.servi.slug} → ${e.bonne.slug}`;
  const c = couples.get(k) || couples.set(k, { k, ls: [], ex: e.l.requete, sens: e.sens }).get(k);
  c.ls.push(e.l);
}
out.push("| couple | requêtes | imp | clics | pos | exemple |");
out.push("|---|---|---|---|---|---|");
for (const c of [...couples.values()].sort((a, b) => somme(b.ls).imp - somme(a.ls).imp).slice(0, 25)) {
  const s = somme(c.ls);
  out.push(`| ${c.k} | ${c.ls.length} | ${s.imp} | ${s.clics} | ${s.pos.toFixed(1)} | ${c.ex} |`);
}

// Requêtes de marque servies par une fiche
out.push("");
const sM = somme(marqueSeule.map((x) => x.l));
out.push(`### Requêtes de marque pure (« kayali », « parfum narciso rodriguez prix algérie ») servies par une fiche : ${marqueSeule.length} couples, ${sM.imp} imp, ${sM.clics} clics, CTR ${(sM.ctr * 100).toFixed(1)} %, pos ${sM.pos.toFixed(1)}`);
const parFiche = new Map();
for (const x of marqueSeule) (parFiche.get(x.servi.slug) || parFiche.set(x.servi.slug, []).get(x.servi.slug)).push(x.l);
out.push("| fiche | imp de requêtes de marque | clics | pos | requête n°1 |");
out.push("|---|---|---|---|---|");
for (const [slug, ls] of [...parFiche].sort((a, b) => somme(b[1]).imp - somme(a[1]).imp).slice(0, 20)) {
  const s = somme(ls);
  const t = ls.sort((a, b) => b.imp - a.imp)[0];
  out.push(`| ${slug} | ${s.imp} | ${s.clics} | ${s.pos.toFixed(1)} | ${t.requete} (${t.imp}, pos ${t.pos.toFixed(1)}) |`);
}
console.log(out.join("\n"));

// Pour le script 03 : par fiche, impressions (échantillon) de requêtes de marque pure et de requêtes
// qui nomment une autre fiche.
{
  const fs = await import("fs");
  const par = {};
  const tot = new Map();
  for (const l of lignes) tot.set(l.chemin, (tot.get(l.chemin) || 0) + l.imp);
  for (const x of marqueSeule) { const k = x.l.chemin; (par[k] ??= { marque: 0, autre: 0 }).marque += x.l.imp; }
  for (const e of erreurs) { const k = e.l.chemin; (par[k] ??= { marque: 0, autre: 0 }).autre += e.l.imp; }
  for (const k of Object.keys(par)) par[k].total = tot.get(k) || 0;
  fs.writeFileSync(new URL("./05-par-fiche.json", import.meta.url), JSON.stringify(par));
}
