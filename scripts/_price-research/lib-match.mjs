// Helpers de normalisation partagés (copie des lignes 17-195 de match-v3.mjs, 15/09/2026).
// match-v3.mjs garde sa propre copie pour ne pas perturber le pipeline de prix en cours.
// ─── Normalisation ────────────────────────────────────────────────────────────
const norm = (s) => String(s || "")
  .toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/n[°º]\s?(\d)/g, "n$1")
  .replace(/&/g, " ")
  .replace(/['’`]/g, " ")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

// Mots sans valeur distinctive (format, marketing, genre générique, liaisons)
const FILLER = new Set([
  "eau", "de", "du", "des", "la", "le", "les", "l", "d", "et", "and", "by", "the", "of", "a", "un", "une",
  "for", "pour", "with", "you", "sur", "avec", "en", "in",
  "edp", "edt", "edc", "toilette", "cologne_conc",
  "ml", "oz", "fl", "cl",
  "vaporisateur", "vapo", "spray", "natural", "naturel", "flacon", "bottle",
  "new", "nouveau", "nouvelle", "nouveaute", "promo", "offre", "original", "originaux", "authentique",
  "algerie", "dz", "prix", "parfums", "perfume", "fragrance",
  "men", "women", "man", "woman", "homme", "femme", "him", "her", "lui", "elle", "unisex", "unisexe", "mixte",
]);
// Mots de déclinaison : présents chez le concurrent mais pas chez nous = autre parfum
const FLANKER = new Set([
  "elixir", "intense", "intensely", "absolu", "absolute", "absolutely", "extreme", "noir", "nuit", "night",
  "bleu", "blue", "black", "dark", "powerfully", "freezing", "energy", "flame", "essence", "essenza",
  "profumo", "profondo", "eclat", "passione", "ultra", "gold", "platinum", "royal", "prestige", "collector",
  "legend", "azure", "sport", "leather", "musc", "vetiver", "exclusif", "day", "soir", "supreme", "reserve",
  "privee", "infrared", "fresh", "fraiche", "tendre", "cologne", "sheer", "florale", "floral", "blossom",
  "rouge", "red", "white", "blanc", "pink", "rose", "silver", "electrique", "electric", "summer", "winter",
  "limited", "edition", "lumiere", "velvet", "oud", "tobacco", "vanille", "vanilla", "amber", "ambre",
  "aqua", "acqua", "marine", "ocean", "wild", "savage", "absolue", "lady", "girl", "boy", "parfum_flanker",
  "extrait", "concentree", "concentrate", "forte", "deep", "hot", "sexy", "golden", "crystal", "glow",
  "star", "stars", "eros", "x", "ii", "iii", "iv",
]);

// Alias de marques : chaque entrée = liste de signatures (tous les mots d'une signature requis)
const BRAND_ALIASES = {
  "yves saint laurent": ["ysl", "saint laurent", "yves saint laurent"],
  "giorgio armani": ["armani"],
  "paco rabanne": ["rabanne"],
  "dolce gabbana": ["dolce gabbana", "d g", "dolce"],
  "carolina herrera": ["herrera"],
  "jean paul gaultier": ["gaultier", "jpg"],
  "calvin klein": ["calvin klein", "ck"],
  "hugo boss": ["boss", "hugo boss"],
  "maison francis kurkdjian": ["kurkdjian", "mfk"],
  "parfums de marly": ["marly", "pdm"],
  "viktor rolf": ["viktor rolf", "viktor"],
  "van cleef arpels": ["van cleef", "cleef"],
  "zadig voltaire": ["zadig"],
  "mont blanc": ["montblanc", "mont blanc"],
  "narciso rodriguez": ["narciso"],
  "al haramain": ["haramain", "alharamain"],
  "al rehab": ["rehab", "alrehab"],
  "arabian oud": ["arabian oud"],
  "swiss arabian": ["swiss arabian"],
  "jo malone london": ["malone"],
  "victoria s secret": ["victoria secret", "victorias secret", "victoria s secret"],
  "antonio banderas": ["banderas"],
  "elizabeth arden": ["arden"],
  "elizabeth taylor": ["elizabeth taylor"],
  "maison margiela": ["margiela", "replica"],
  "roberto cavalli": ["cavalli"],
  "salvatore ferragamo": ["ferragamo"],
  "donna karan": ["dkny", "donna karan"],
  "s t dupont": ["dupont"],
  "jennifer lopez": ["jlo", "j lo", "jennifer lopez"],
  "frederic malle": ["frederic malle", "malle"],
  "penhaligon s": ["penhaligon", "penhaligons"],
  "juliette has a gun": ["juliette has a gun", "juliette"],
  "adopt mon parfum": ["adopt"],
  "issey miyake": ["miyake"],
  "lolita lempicka": ["lempicka"],
  "karl lagerfeld": ["lagerfeld"],
  "emanuel ungaro": ["ungaro"],
  "acqua di parma": ["acqua di parma"],
  "ex nihilo": ["nihilo"],
  "serge lutens": ["lutens"],
  "memo paris": ["memo"],
  "roja dove": ["roja"],
  "louis vuitton": ["vuitton"],
  "guy laroche": ["laroche"],
  "ralph lauren": ["ralph lauren", "polo ralph"],
  "michael kors": ["kors"],
  "marc jacobs": ["marc jacobs"],
  "jimmy choo": ["jimmy choo", "choo"],
  "tom ford": ["tom ford"],
  "pierre cardin": ["cardin"],
  "nina ricci": ["nina ricci", "ricci"],
  "kate spade": ["kate spade"],
  "britney spears": ["britney"],
  "paris hilton": ["paris hilton"],
  "ariana grande": ["ariana grande", "ariana"],
  "mariah carey": ["mariah carey"],
  "anna sui": ["anna sui"],
  "jean patou": ["patou"],
  "yves rocher": ["yves rocher"],
  "elie saab": ["elie saab", "saab"],
  "issey": ["miyake"],
  "joop": ["joop"],
  "guess": ["guess"],
  "coach": ["coach"],
  "kilian": ["kilian"],
  "initio": ["initio"],
  "lancome": ["lancome"],
  "hermes": ["hermes"],
  "chloe": ["chloe"],
  "beyonce": ["beyonce"],
  "franck olivier": ["franck olivier"],
  "el nabil": ["el nabil", "elnabil"],
  "bvlgari": ["bvlgari", "bulgari"],
  "miu miu": ["miu miu"],
  "acqua": [],
};
const BRAND_GENERIC = new Set(["maison", "parfums", "parfum", "paris", "london", "de", "the", "by", "perfumes", "fragrances", "al", "house", "prives"]);

function brandSignatures(brand) {
  const key = norm(brand);
  const sigs = [];
  const base = key.split(" ").filter((t) => t.length > 1 && !BRAND_GENERIC.has(t));
  if (base.length) sigs.push(base);
  for (const a of BRAND_ALIASES[key] || []) sigs.push(norm(a).split(" ").filter(Boolean));
  return sigs;
}
// Orthographes alternatives vues chez les concurrents (translittérations de l'arabe surtout)
const TOKEN_ALIASES = { khamra: "khamrah", assad: "asad", oudh: "oud", oudhs: "oud", bulgari: "bvlgari", aoud: "oud" };
// Retire les contenances ("100 ml", "3.4 oz") et les accroches "(DUPE Delina)" avant découpage,
// sinon elles comptent comme mots en trop
const cleanName = (s) => String(s || "")
  .replace(/\(\s*dupe[^)]*\)/gi, " ")
  .replace(/\bdupe\b.*$/i, " ")
  .replace(/\d+(?:[.,]\d+)?\s*(?:ml|oz|fl\.?\s*oz)\b/gi, " ");
const tokensOf = (s) => norm(cleanName(s)).split(" ").filter(Boolean).map((t) => TOKEN_ALIASES[t] || t);

// ─── Détection concentration / "Parfum" comme déclinaison ─────────────────────
function concOf(text) {
  const t = norm(text);
  if (/\bextrait\b/.test(t)) return "EXTRAIT";
  if (/eau de toilette|\bedt\b/.test(t)) return "EDT";
  if (/eau de cologne|\bedc\b/.test(t)) return "EDC";
  if (/eau de parfum|\bedp\b/.test(t)) return "EDP";
  // on n'efface que "Parfum Homme ..." en tête de libellé (formule générique), pas "Dior Homme Parfum"
  const stripped = t.replace(/parfums? de marly/g, "").replace(/^parfums?\s+(homme|femme|pour|mixte|unisexe|niche|oriental)\b/g, "").replace(/\bparfums?\s+(niche|oriental|arabe)\b/g, "");
  if (/\bparfum\b/.test(stripped)) return "PARFUM";
  return null;
}
// strict = le mot "Parfum"/"Extrait" est dans NOTRE nom (déclinaison, ex. "Sauvage Parfum") ;
// sinon c'est juste la concentration d'un niche, souvent absente du nom chez les concurrents.
function ourConc(p) {
  const n = norm(p.name);
  if (/\bextrait\b/.test(n)) return { code: "EXTRAIT", strict: true };
  if (/\bparfum\b/.test(n.replace(/eau de parfum/g, ""))) return { code: "PARFUM", strict: true };
  if (/extrait/i.test(p.concentration)) return { code: "EXTRAIT", strict: false };
  if (p.concentration === "Parfum") return { code: "PARFUM", strict: false };
  if (/^EDT/.test(p.concentration)) return { code: "EDT", strict: false };
  if (/Cologne|EDC/.test(p.concentration)) return { code: "EDC", strict: false };
  return { code: "EDP", strict: false };
}
function concCompatible(theirs, ours) {
  if (!theirs) return !ours.strict;
  if (theirs === ours.code) return true;
  const rich = (c) => c === "PARFUM" || c === "EXTRAIT";
  return !ours.strict && rich(ours.code) && rich(theirs);
}

// ─── Genre écrit dans le nom ───────────────────────────────────────────────────
function genderWord(s) {
  const t = norm(s);
  if (/\b(femme|women|woman|her|elle|lady|donna|pour elle)\b/.test(t)) return "f";
  if (/\b(homme|men|man|him|lui|uomo|pour lui)\b/.test(t)) return "h";
  return null;
}

// ─── Volume ────────────────────────────────────────────────────────────────────
const volOf = (s) => { const m = String(s || "").toLowerCase().match(/(\d{2,3})(?:[.,]\d)?\s*-?\s*ml/); return m ? parseInt(m[1], 10) : null; };

// ─── Formats à exclure ─────────────────────────────────────────────────────────
const NON_PERFUME = /d[ée]odorant|deo\b|gel douche|shower|savon|soap|lait corporel|body lotion|body milk|cr[èe]me|\bstick\b|roll-?on|brume|body mist|mist\b|huile|oil\b|miniature|\bmini\b|testeur|\btester\b|shampo|bougie|candle|diffuseur|coffret|\bset\b|gift|recharge|refill|travel|vial|[ée]chantillon|sample|d[ée]cant|pochette|trousse|lotion|after ?shave|apr[eè]s[- ]rasage|baume|gel moussant|hair|cheveux|musc intime|poudre/i;
export { norm, FILLER, FLANKER, BRAND_ALIASES, BRAND_GENERIC, brandSignatures, TOKEN_ALIASES, cleanName, tokensOf, concOf, genderWord, volOf, NON_PERFUME };
