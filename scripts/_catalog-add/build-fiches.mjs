#!/usr/bin/env node
// Assemble les nouvelles fiches produit à partir de :
//   - scripts/_catalog-add/candidates.json      (marque, volume, prix marché algérien)
//   - scripts/_catalog-add/research/<slug>.json (Fragrantica : nom officiel, ID, genre, notes, famille)
//   - scripts/_catalog-add/texts/<slug>.json    (shortDescription + description rédigées)
// Sortie : scripts/_catalog-add/fiches.json (à relire avant injection dans data/products.json).
// Rien n'est inventé : ce qui n'est pas confirmé fait sortir le parfum du lot (fichier ecartes.json).
import fs from "fs";

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "");
const slugify = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Maisons dont le catalogue est classé "parfums-orientaux" (cf. répartition actuelle)
const MAISONS_ORIENTALES = new Set(["lattafa", "al haramain", "swiss arabian", "rasasi", "ajmal", "afnan",
  "orientica", "al rehab", "el nabil", "arabian oud", "armaf", "zimaya", "assaf", "khadlaj", "ard al zaafaran",
  "maison alhambra", "french avenue", "paris corner", "bharara", "asdaaf", "nusuk", "surrati"]);
const MOTS_ORIENTAUX = ["oud", "oudh", "agarwood", "encens", "myrrhe", "ambre gris", "bakhoor", "attar"];
const FAMILLE_FEMININE = ["floral", "fruite", "gourmand", "poudre", "vanille"];

// Recherche par MOT ENTIER : en sous-chaîne, "poudré" contient "oud" et faisait basculer
// Narciso Poudrée dans les parfums orientaux.
function contientMot(texte, mot) {
  const lettres = "abcdefghijklmnopqrstuvwxyz0123456789";
  let i = texte.indexOf(mot);
  while (i !== -1) {
    const avant = i === 0 ? " " : texte[i - 1];
    const apres = texte[i + mot.length] === undefined ? " " : texte[i + mot.length];
    if (!lettres.includes(avant) && !lettres.includes(apres)) return true;
    i = texte.indexOf(mot, i + 1);
  }
  return false;
}

function categorieDe(genre, marque, famille, notes) {
  const texte = norm(famille + " " + notes.join(" "));
  const oriental = MAISONS_ORIENTALES.has(norm(marque)) || MOTS_ORIENTAUX.some((m) => contientMot(texte, m));
  if (oriental) return "parfums-orientaux";
  if (genre === "homme") return "parfums-homme";
  if (genre === "femme") return "parfums-femme";
  // Unisexe non oriental : on suit le caractère de la famille. Les listes Homme et Femme
  // affichent de toute façon les unisexes, puisque leur filtre porte sur `gender` (règle n°2).
  return FAMILLE_FEMININE.some((f) => norm(famille).includes(f)) ? "parfums-femme" : "parfums-homme";
}

// Saisons et occasions : lecture éditoriale de la famille olfactive, pas une donnée produit.
function saisonsDe(famille, notes) {
  const t = norm(famille + " " + notes.join(" "));
  const frais = ["agrume", "aquatique", "marin", "citron", "bergamote", "menthe", "cologne", "vert"].some((x) => t.includes(x));
  const chaud = ["oriental", "oud", "vanille", "ambre", "gourmand", "epice", "cuir", "tabac", "resine"].some((x) => t.includes(x));
  if (frais && !chaud) return { seasons: ["Printemps", "Été"], occasions: ["Journée", "Bureau"] };
  if (chaud && !frais) return { seasons: ["Automne", "Hiver"], occasions: ["Soirée", "Occasions spéciales"] };
  return { seasons: ["Printemps", "Automne"], occasions: ["Bureau", "Soirée"] };
}

// Longévité / sillage : déduits de la CONCENTRATION (norme du métier), jamais mesurés sur ce parfum.
// Le texte de la page ne doit donc pas les présenter comme un fait propre au parfum (CLAUDE.md règle n°10).
const PAR_CONCENTRATION = {
  EDC: { longevity: 2, sillage: 2 }, Cologne: { longevity: 2, sillage: 2 },
  EDT: { longevity: 3, sillage: 3 }, "EDT Intense": { longevity: 4, sillage: 3 },
  EDP: { longevity: 4, sillage: 4 }, "EDP Intense": { longevity: 5, sillage: 4 },
  Parfum: { longevity: 5, sillage: 4 }, "Extrait de Parfum": { longevity: 5, sillage: 4 },
};

const GENRE_H1 = { homme: "Homme", femme: "Femme", unisexe: "Mixte" };

// Fragrantica renvoie parfois la maison avec une précision entre parenthèses
// ("Giorgio Armani (ligne Emporio Armani)", "Paco Rabanne (Rabanne)") : on ne garde
// que le nom de maison, qui doit correspondre à une entrée de brands[].
const nettoieMarque = (m) => String(m || "").replace(/\s*\([^)]*\)/g, "").trim();

// Le nom officiel contient souvent la concentration et le nom de la maison
// ("Q by Dolce&Gabbana Eau de Parfum Intense") : la fiche ne garde que le nom commercial
// ("Q Intense"), sinon le h1, le titre et le slug répètent la marque et la concentration
// (interdit par les règles SEO : jamais de concentration dans l'URL).
function nettoieNom(nom, marque) {
  let n = " " + String(nom || "").trim() + " ";
  n = n.replace(/\s+Eau de (Parfum|Toilette|Cologne)\s+/gi, " ");
  n = n.replace(/\s+(EDP|EDT|EDC)\s+/gi, " ");
  n = n.replace(/\s+Extrait de Parfum\s+/gi, " ");
  n = n.replace(new RegExp("\\s+by\\s+" + marque.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*") + "\\s+", "gi"), " ");
  const tetes = [marque, marque.replace(/\s+/g, "")];
  for (const t of tetes) {
    const re = new RegExp("^\\s*" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s*") + "\\s+", "i");
    if (re.test(n) && n.replace(re, " ").trim().length > 2) n = n.replace(re, " ");
  }
  // La maison peut aussi réapparaître au milieu du nom : Fragrantica donne
  // "Irresistible Givenchy Very Floral", ce qui ferait un h1 avec deux fois "Givenchy".
  const partout = new RegExp("(^|\\s)" + marque.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+") + "(\\s|$)", "gi");
  if (partout.test(n) && n.replace(partout, " ").trim().length > 2) n = n.replace(partout, " ");
  return n.replace(/\s+/g, " ").trim();
}

/**
 * Le dernier mot de la maison ouvre parfois le nom ("Armani Code Elixir" chez Giorgio Armani,
 * "Gaultier Divine" chez Jean Paul Gaultier). On ne le retire que si AUCUN produit existant
 * de cette marque ne nomme ses parfums ainsi — chez Hugo Boss, "Boss Bottled" est justement
 * la convention du catalogue, et l'enlever casserait la cohérence.
 */
function retireTeteRedondante(nom, marque, nomsExistants) {
  const dernier = marque.split(/\s+/).pop();
  if (!dernier || dernier.length < 3) return nom;
  const tokens = nom.split(/\s+/);
  if (tokens.length < 3) return nom;
  if (norm(tokens[0]) !== norm(dernier)) return nom;
  if (nomsExistants.some((x) => norm(x).startsWith(norm(dernier) + " "))) return nom;
  return tokens.slice(1).join(" ");
}

// Fragrantica n'écrit pas toujours la maison comme le catalogue : "Rabanne" est la nouvelle
// dénomination de Paco Rabanne, "Montblanc" s'écrit "Mont Blanc" chez nous. Sans ces alias,
// build-fiches croit devoir créer une marque qui existe déjà et produit un brandSlug orphelin.
const ALIAS_MARQUE = {
  rabanne: "Paco Rabanne",
  montblanc: "Mont Blanc",
  "mont blanc": "Mont Blanc",
  ysl: "Yves Saint Laurent",
  "emporio armani": "Giorgio Armani",
  "armani": "Giorgio Armani",
  "dolce gabbana": "Dolce & Gabbana",
  "dolce&gabbana": "Dolce & Gabbana",
  "carolina herrera": "Carolina Herrera",
  "maison francis kurkdjian": "Maison Francis Kurkdjian",
  "van cleef arpels": "Van Cleef & Arpels",
  "viktor&rolf": "Viktor&Rolf",
  "viktor & rolf": "Viktor&Rolf",
  "initio parfums prives": "Initio",
  "initio parfums privés": "Initio",
  "lacoste fragrances": "Lacoste",
};

const catalogue = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const slugsPris = new Set(catalogue.products.map((p) => p.slug));
// Parfums déjà injectés lors d'une vague précédente : leur fichier de recherche est toujours
// là, mais les remonter créerait un doublon avec un slug suffixé en -2.
const dejaInjectes = fs.existsSync("./scripts/_catalog-add/provenance.json")
  ? new Set(JSON.parse(fs.readFileSync("./scripts/_catalog-add/provenance.json", "utf8")).map((x) => x.slugCandidat))
  : new Set();
const marquesParNom = new Map(catalogue.brands.map((b) => [norm(b.name), b]));
// Le libellé affiché doit suivre celui des produits existants de la même marque :
// brands[] dit "Giorgio Armani" mais les 40 fiches Armani affichent "Armani".
const libelleParSlug = new Map();
for (const b of catalogue.brands) {
  const compte = new Map();
  catalogue.products.filter((p) => p.brandSlug === b.slug).forEach((p) => compte.set(p.brand, (compte.get(p.brand) || 0) + 1));
  const dominant = [...compte.entries()].sort((x, y) => y[1] - x[1])[0];
  libelleParSlug.set(b.slug, dominant ? dominant[0] : b.name);
}
const candidats = new Map(JSON.parse(fs.readFileSync("./scripts/_catalog-add/candidates.json", "utf8")).map((c) => [c.slug, c]));

const DIR_R = "./scripts/_catalog-add/research";
const DIR_T = "./scripts/_catalog-add/texts";
const fiches = [], ecartes = [], marquesACreer = new Map();

for (const f of fs.readdirSync(DIR_R).filter((x) => x.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(DIR_R + "/" + f, "utf8"));
  const c = candidats.get(r.slug);
  const jette = (raison) => ecartes.push({ slug: r.slug, raison });
  if (dejaInjectes.has(r.slug)) continue;
  if (!c) { jette("pas dans candidates.json"); continue; }
  if (r.existe === false) { jette("parfum inexistant d'après Fragrantica"); continue; }
  if (r.confiance === "basse") { jette("confiance basse"); continue; }
  const fg = r.fragrantica || {};
  if (!fg.id) { jette("pas d'ID Fragrantica (image impossible)"); continue; }
  if (!fg.nomOfficiel) { jette("pas de nom officiel"); continue; }
  const notes = r.notes || {};
  const toutes = [...(notes.top || []), ...(notes.heart || []), ...(notes.base || [])];
  if (toutes.length < 3) { jette("moins de 3 notes olfactives"); continue; }
  if (!r.famille) { jette("pas de famille olfactive"); continue; }
  const genre = fg.genre;
  if (!["homme", "femme", "unisexe"].includes(genre)) { jette("genre non confirmé"); continue; }

  // La marque de Fragrantica fait foi (leçon Madawi : la boutique se trompe de maison).
  const marqueBrute0 = nettoieMarque(fg.marqueOfficielle) || c.marque;
  const marqueBrute = ALIAS_MARQUE[norm(marqueBrute0)] || marqueBrute0;
  const marqueConnue = marquesParNom.get(norm(marqueBrute));
  const brandSlug = marqueConnue ? marqueConnue.slug : slugify(marqueBrute);
  const marque = marqueConnue ? libelleParSlug.get(brandSlug) || marqueConnue.name : marqueBrute;
  if (!marqueConnue) marquesACreer.set(brandSlug, marque);
  const nomsMarque = catalogue.products.filter((p) => p.brandSlug === brandSlug).map((p) => p.name);
  const nom = retireTeteRedondante(nettoieNom(fg.nomOfficiel, marque), marque, nomsMarque);
  if (!nom) { jette("nom vide après nettoyage"); continue; }

  // Même maison + même nom (aux accents et à la casse près) = le parfum est déjà au catalogue,
  // même si le slug diffère : "Legend Red" existait sous le slug mont-blanc-legend-rouge.
  const jumeau = catalogue.products.find((p) => p.brandSlug === brandSlug && norm(p.name).replace(/[^a-z0-9]/g, "") === norm(nom).replace(/[^a-z0-9]/g, ""));
  if (jumeau) { jette(`doublon de ${jumeau.slug} (même marque, même nom "${jumeau.name}")`); continue; }

  // Slug : <marque>-<nom officiel>, convention de 75 % du catalogue.
  // On supprime les mots répétés ("narciso-rodriguez-narciso-poudree" -> "narciso-rodriguez-poudree"),
  // SAUF si ça laisse le slug pendu sur un mot outil : "Le Sel d'Issey" chez Issey Miyake
  // donnait "issey-miyake-le-sel-d".
  const bruts = (brandSlug + "-" + slugify(nom)).split("-").filter(Boolean);
  const vus = new Set();
  const dedupes = bruts.filter((t) => !vus.has(t) && vus.add(t));
  const OUTILS = new Set(["d", "l", "de", "du", "la", "le", "les", "en", "et", "a", "in", "of", "the"]);
  const tokens = OUTILS.has(dedupes[dedupes.length - 1]) ? bruts : dedupes;
  const coupe = (n) => tokens.slice(0, n).join("-");
  let slug = coupe(8);
  while (slug.length > 48 && slug.split("-").length > 4) slug = coupe(slug.split("-").length - 1);

  // Un slug déjà pris par une fiche du catalogue = presque toujours le MÊME parfum sous une
  // graphie différente (Cacharel "Lou Lou" vs "LouLou"). On refuse au lieu de suffixer en -2 :
  // un doublon publié coûte bien plus cher qu'un ajout manqué.
  if (slugsPris.has(slug)) {
    const existant = catalogue.products.find((p) => p.slug === slug);
    jette(`doublon probable de ${slug}${existant ? ` ("${existant.brand} ${existant.name}")` : ""}`);
    continue;
  }
  let n = 2;
  while (fiches.some((x) => x.slug === slug)) slug = coupe(tokens.length) + "-" + n++;
  slugsPris.add(slug);

  const concentration = r.concentrationConfirmee || c.concentration || "EDP";
  const perf = PAR_CONCENTRATION[concentration] || { longevity: 4, sillage: 3 };
  const categorie = categorieDe(genre, marque, r.famille, toutes);
  const { seasons, occasions } = saisonsDe(r.famille, toutes);

  const fichierTexte = DIR_T + "/" + slug + ".json";
  const textes = fs.existsSync(fichierTexte) ? JSON.parse(fs.readFileSync(fichierTexte, "utf8")) : null;

  fiches.push({
    id: slug,
    slug,
    name: nom,
    h1: `${marque} ${nom} Parfum ${GENRE_H1[genre]} Algérie`,
    brand: marque,
    brandSlug,
    gender: genre,
    category: categorie,
    family: r.famille,
    concentration,
    volume: c.volume,
    price: c.prix,
    originalPrice: null,
    shortDescription: textes ? textes.shortDescription : null,
    description: textes ? textes.description : null,
    notes: { top: notes.top || [], heart: notes.heart || [], base: notes.base || [] },
    occasions,
    seasons,
    longevity: perf.longevity,
    sillage: perf.sillage,
    image: `/images/products/${slug}.jpg`,
    inStock: true,
    featured: false,
    badge: null,
    isOriental: categorie === "parfums-orientaux",
    related: [],
    _source: { fragrantica: fg.url, fragranticaId: fg.id, boutiques: c.nbBoutiques, slugCandidat: r.slug },
  });
}

// related : même marque d'abord, puis même catégorie et même genre, prix le plus proche.
// On ne lie QUE vers des fiches publiables : celles du catalogue et celles de ce lot dont
// le texte est prêt. Lier vers une fiche encore sans texte produit un related cassé le
// jour où le lot part en ligne sans elle.
const publiables = fiches.filter((f) => f.description);
const bassin = catalogue.products.concat(publiables);
for (const f of fiches) {
  const proches = bassin
    .filter((p) => p.slug !== f.slug)
    .map((p) => ({ p, score: (p.brandSlug === f.brandSlug ? 4 : 0) + (p.category === f.category ? 2 : 0) + (p.gender === f.gender ? 1 : 0) }))
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score || Math.abs(a.p.price - f.price) - Math.abs(b.p.price - f.price));
  f.related = proches.slice(0, 3).map((x) => x.p.slug);
}

const sansTexte = fiches.filter((f) => !f.description);
fs.writeFileSync("./scripts/_catalog-add/fiches.json", JSON.stringify(fiches, null, 1));
fs.writeFileSync("./scripts/_catalog-add/ecartes.json", JSON.stringify(ecartes, null, 1));
fs.writeFileSync("./scripts/_catalog-add/textes-todo.json", JSON.stringify(
  sansTexte.map((f) => ({ slug: f.slug, slugCandidat: f._source.slugCandidat, brand: f.brand, name: f.name, gender: f.gender, concentration: f.concentration, volume: f.volume, family: f.family, notes: f.notes, occasions: f.occasions, seasons: f.seasons })), null, 1));
console.log("fiches montées : " + fiches.length + " (dont " + sansTexte.length + " sans texte) | écartées : " + ecartes.length);
const parRaison = {};
ecartes.forEach((e) => (parRaison[e.raison] = (parRaison[e.raison] || 0) + 1));
console.log("raisons :", parRaison);
if (marquesACreer.size) console.log("marques à créer dans brands[] : " + [...marquesACreer.values()].join(", "));
fiches.slice(0, 8).forEach((f) => console.log("  " + f.slug + " | " + f.brand + " " + f.name + " | " + f.gender + "/" + f.category + " | " + f.concentration + " " + f.volume + " | " + f.price + " DA | related " + f.related.length));
