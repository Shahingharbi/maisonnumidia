// Q2 : sur les fiches produit, la requête commence-t-elle par la marque (« dior sauvage ») ou par
// le nom (« sauvage dior ») ? Et quand le nom seul (sans marque) domine-t-il ?
// Base : rp-A (échantillon requête × page), requêtes en alphabet latin, hors navigation.
// Script jetable : node scripts/_seo/titres/recherche/02-ordre-mots.mjs
import { rp, produitDe, somme } from "../../../_gsc/lib-analyse.mjs";

const n = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC")
  .replace(/&/g, " ").replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();

// Formes de marque tapées (alias). Les formes courtes mesurées dans CLAUDE.md + les sigles courants.
const ALIAS = {
  "yves-saint-laurent": ["yves saint laurent", "ysl", "saint laurent"],
  "giorgio-armani": ["giorgio armani", "armani"],
  "paco-rabanne": ["paco rabanne", "rabanne"],
  "jean-paul-gaultier": ["jean paul gaultier", "jean paul", "gaultier", "jpg"],
  "calvin-klein": ["calvin klein", "ck"],
  "dolce-gabbana": ["dolce gabbana", "dolce and gabbana", "dolce", "d g", "dg"],
  "carolina-herrera": ["carolina herrera", "carolina", "herrera", "ch"],
  "mont-blanc": ["mont blanc", "montblanc"],
  "montblanc": ["mont blanc", "montblanc"],
  "hugo-boss": ["hugo boss", "boss", "hugo"],
  "louis-vuitton": ["louis vuitton", "lv"],
  "maison-francis-kurkdjian": ["maison francis kurkdjian", "francis kurkdjian", "kurkdjian", "mfk"],
  "viktor-rolf": ["viktor rolf", "viktor and rolf", "viktor"],
  "bvlgari": ["bvlgari", "bulgari"],
  "al-haramain": ["al haramain", "haramain"],
  "franck-olivier": ["franck olivier", "frank olivier", "franck oliver"],
  "giorgio-armani-prive": ["armani prive", "armani"],
  "thierry-mugler": ["thierry mugler", "mugler"],
  "mugler": ["mugler", "thierry mugler"],
  "valentino": ["valentino"],
  "parfums-de-marly": ["parfums de marly", "parfum de marly", "de marly", "marly", "pdm"],
  "tom-ford": ["tom ford", "tomford"],
  "swiss-arabian": ["swiss arabian"],
  "arabian-oud": ["arabian oud"],
  "dkny": ["dkny", "donna karan"],
};
const STOP = new Set(["parfum", "parfums", "perfume", "prix", "price", "عطر", "سعر", "le", "la", "de", "du", "des", "eau", "pour", "l", "d", "en", "a", "the", "of", "by", "et", "and", "n", "no", "algerie", "algeria", "dz"]);
const tokensNom = (nom) => n(nom).split(" ").filter((t) => t && !STOP.has(t));

const lignes = rp("A").filter((l) => l.type === "produit" && !/numidia/i.test(l.requete) && !/[؀-ۿ]/.test(l.requete));
const classes = {};
const parProduit = new Map();
const parMarque = new Map();
let ignorees = 0;
for (const l of lignes) {
  const p = produitDe(l.url);
  if (!p) { ignorees++; continue; }
  const q = " " + n(l.requete) + " ";
  const aliases = [...new Set([n(p.brand), ...(ALIAS[p.brandSlug] || [])])].sort((a, b) => b.length - a.length);
  const tn = tokensNom(p.name);
  const nb = n(p.brand);
  // Nom qui contient la marque (Bleu de Chanel, Miss Dior) ou marque = nom : on ne peut pas trancher l'ordre
  const nomContientMarque = aliases.some((a) => (" " + n(p.name) + " ").includes(" " + a + " "));
  let classe;
  // position de la première occurrence de marque et du premier mot du nom
  let posMarque = -1;
  for (const a of aliases) { const i = q.indexOf(" " + a + " "); if (i >= 0 && (posMarque < 0 || i < posMarque)) posMarque = i; }
  let posNom = -1;
  for (const t of tn) { const i = q.indexOf(" " + t + " "); if (i >= 0 && (posNom < 0 || i < posNom)) posNom = i; }
  if (nomContientMarque || !tn.length) classe = "indéterminé (nom contient la marque)";
  else if (posMarque >= 0 && posNom >= 0) classe = posMarque < posNom ? "marque puis nom" : "nom puis marque";
  else if (posNom >= 0) classe = "nom sans marque";
  else if (posMarque >= 0) classe = "marque sans nom";
  else classe = "ni l'un ni l'autre";
  (classes[classe] ??= []).push(l);
  const k = p.slug;
  const e = parProduit.get(k) || parProduit.set(k, { p, c: {} }).get(k);
  (e.c[classe] ??= []).push(l);
  const m = parMarque.get(p.brand) || parMarque.set(p.brand, { c: {} }).get(p.brand);
  (m.c[classe] ??= []).push(l);
}

const out = [];
const tot = somme(lignes.filter((l) => produitDe(l.url)));
out.push(`Base : rp-A, fiches produit au catalogue, requêtes en alphabet latin hors « numidia » : ${tot.imp} imp, ${tot.clics} clics (${ignorees} lignes de fiches disparues ignorées).`);
out.push("");
out.push("| forme de la requête | imp | part imp | clics | part clics | CTR | pos |");
out.push("|---|---|---|---|---|---|---|");
for (const [c, ls] of Object.entries(classes).sort((a, b) => somme(b[1]).imp - somme(a[1]).imp)) {
  const s = somme(ls);
  out.push(`| ${c} | ${s.imp} | ${((s.imp / tot.imp) * 100).toFixed(1)} % | ${s.clics} | ${((s.clics / tot.clics) * 100).toFixed(1)} % | ${(s.ctr * 100).toFixed(1)} % | ${s.pos.toFixed(1)} |`);
}
const mpn = somme(classes["marque puis nom"] || []).imp, npm = somme(classes["nom puis marque"] || []).imp;
out.push("");
out.push(`Quand la requête contient les deux : marque d'abord ${((mpn / (mpn + npm)) * 100).toFixed(0)} %, nom d'abord ${((npm / (mpn + npm)) * 100).toFixed(0)} % des impressions.`);

// Par marque : part « nom sans marque » parmi les requêtes qui contiennent le nom
out.push("");
out.push("### Par marque (≥ 400 imp classées) : part du nom tapé SANS la marque, et ordre quand les deux sont là");
out.push("| marque | imp | nom sans marque | marque puis nom | nom puis marque | marque sans nom |");
out.push("|---|---|---|---|---|---|");
const rows = [];
for (const [b, e] of parMarque) {
  const g = (c) => somme(e.c[c] || []).imp;
  const total = Object.values(e.c).reduce((s, ls) => s + somme(ls).imp, 0) - g("indéterminé (nom contient la marque)") - g("ni l'un ni l'autre");
  if (total < 400) continue;
  rows.push({ b, total, sans: g("nom sans marque"), mpn: g("marque puis nom"), npm: g("nom puis marque"), msn: g("marque sans nom") });
}
rows.sort((a, b) => b.total - a.total);
for (const r of rows) out.push(`| ${r.b} | ${r.total} | ${((r.sans / r.total) * 100).toFixed(0)} % | ${((r.mpn / r.total) * 100).toFixed(0)} % | ${((r.npm / r.total) * 100).toFixed(0)} % | ${((r.msn / r.total) * 100).toFixed(0)} % |`);

// Fiches où le nom seul domine (≥ 60 % des impressions classées, ≥ 150 imp)
out.push("");
out.push("### Fiches où le nom seul domine (nom sans marque ≥ 60 % des imp classées, ≥ 150 imp)");
out.push("| fiche | marque / nom | imp classées | nom sans marque | requête n°1 |");
out.push("|---|---|---|---|---|");
const fiches = [];
let nbDom = 0, nbFiches = 0, impDom = 0, impTot = 0;
for (const [slug, e] of parProduit) {
  const g = (c) => somme(e.c[c] || []).imp;
  const total = g("nom sans marque") + g("marque puis nom") + g("nom puis marque") + g("marque sans nom");
  if (total < 150) continue;
  nbFiches++; impTot += total;
  const part = g("nom sans marque") / total;
  if (part >= 0.6) { nbDom++; impDom += total; }
  const top = Object.values(e.c).flat().sort((a, b) => b.imp - a.imp)[0];
  fiches.push({ slug, p: e.p, total, part, top, mpnPart: g("marque puis nom") / total, npmPart: g("nom puis marque") / total });
}
for (const f of fiches.filter((f) => f.part >= 0.6).sort((a, b) => b.total - a.total).slice(0, 40))
  out.push(`| ${f.slug} | ${f.p.brand} / ${f.p.name} | ${f.total} | ${(f.part * 100).toFixed(0)} % | ${f.top.requete} (${f.top.imp}) |`);
out.push("");
out.push(`Sur ${nbFiches} fiches à ≥ 150 imp classées, ${nbDom} (${((nbDom / nbFiches) * 100).toFixed(0)} %) sont dominées par le nom seul ; elles portent ${((impDom / impTot) * 100).toFixed(0)} % de ces impressions.`);

out.push("");
out.push("### Fiches où le nom vient AVANT la marque dans la majorité des requêtes à deux termes (≥ 150 imp classées, nom puis marque > marque puis nom)");
out.push("| fiche | imp classées | marque puis nom | nom puis marque | nom sans marque |");
out.push("|---|---|---|---|---|");
for (const f of fiches.filter((f) => f.npmPart > f.mpnPart && f.npmPart >= 0.15).sort((a, b) => b.total - a.total).slice(0, 25))
  out.push(`| ${f.slug} | ${f.total} | ${(f.mpnPart * 100).toFixed(0)} % | ${(f.npmPart * 100).toFixed(0)} % | ${(f.part * 100).toFixed(0)} % |`);

// Par famille de marque : orientales vs occidentales
out.push("");
out.push("### Rayon oriental contre le reste");
for (const [lib, f] of [["orientaux (category parfums-orientaux)", (p) => p.category === "parfums-orientaux"], ["homme/femme", (p) => p.category !== "parfums-orientaux"]]) {
  const acc = {};
  for (const [, e] of parProduit) if (f(e.p)) for (const [c, ls] of Object.entries(e.c)) acc[c] = (acc[c] || 0) + somme(ls).imp;
  const t = (acc["nom sans marque"] || 0) + (acc["marque puis nom"] || 0) + (acc["nom puis marque"] || 0) + (acc["marque sans nom"] || 0);
  out.push(`- ${lib} : ${t} imp classées ; nom sans marque ${((acc["nom sans marque"] / t) * 100).toFixed(0)} %, marque puis nom ${((acc["marque puis nom"] / t) * 100).toFixed(0)} %, nom puis marque ${((acc["nom puis marque"] / t) * 100).toFixed(0)} %, marque sans nom ${((acc["marque sans nom"] / t) * 100).toFixed(0)} %`);
}
console.log(out.join("\n"));
