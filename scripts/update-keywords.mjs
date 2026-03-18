import { readFileSync, writeFileSync } from 'fs';

const kw = JSON.parse(readFileSync('data/keywords.json', 'utf8'));

// Keyword → { status, slug, note }
const updates = {
  // === Déjà existants avant batches ===
  "one million parfum":          { status: "done", slug: "/parfums/1-million-paco-rabanne",         note: "1 Million Paco Rabanne" },
  "parfum prada femme":          { status: "done", slug: "/parfums/prada-candy",                    note: "Prada Candy" },
  "mon paris parfum":            { status: "done", slug: "/parfums/mon-paris-ysl",                  note: "Mon Paris YSL" },
  "parfum mon paris":            { status: "done", slug: "/parfums/mon-paris-ysl",                  note: "Mon Paris YSL" },
  "burberry parfum":             { status: "done", slug: "/parfums/burberry-brit-homme",            note: "Burberry Brit" },
  "kenzo parfum":                { status: "done", slug: "/parfums/kenzo-l-eau-homme",              note: "Kenzo L'Eau" },
  "elie saab parfum":            { status: "done", slug: "/parfums/elie-saab-le-parfum",            note: "Elie Saab Le Parfum" },
  "tresor parfum":               { status: "done", slug: "/parfums/tresor-lancome",                 note: "Lancôme Trésor" },
  "alien parfum":                { status: "done", slug: "/parfums/alien-mugler",                   note: "Mugler Alien" },
  "mugler alien parfum":         { status: "done", slug: "/parfums/alien-mugler",                   note: "Mugler Alien" },
  "miss dior parfum":            { status: "done", slug: "/parfums/miss-dior",                      note: "Miss Dior" },
  "le male le parfum":           { status: "done", slug: "/parfums/le-male-le-parfum",              note: "JPG Le Male Le Parfum" },
  "dior homme parfum":           { status: "done", slug: "/parfums/dior-homme",                     note: "Dior Homme" },
  "parfum you":                  { status: "done", slug: "/parfums/you-cacharel",                   note: "Cacharel You" },
  "l impératrice parfum":        { status: "done", slug: "/parfums/dolce-gabbana-l-imperatrice",    note: "D&G L'Impératrice" },
  "dolce gabbana parfum":        { status: "done", slug: "/parfums/dolce-gabbana-light-blue",       note: "D&G Light Blue" },
  "valentino parfum homme":      { status: "done", slug: "/parfums/valentino-uomo",                 note: "Valentino Uomo" },
  "my way parfum":               { status: "done", slug: "/parfums/armani-my-way",                  note: "Armani My Way" },
  "parfum boss bottled":         { status: "done", slug: "/parfums/hugo-boss-bottled",              note: "Hugo Boss Bottled" },
  "parfum carolina herrera":     { status: "done", slug: "/parfums/good-girl-carolina-herrera",     note: "Good Girl Carolina Herrera" },
  "parfum lancome tresor":       { status: "done", slug: "/parfums/tresor-lancome",                 note: "Lancôme Trésor" },
  // === Batch A ===
  "evidence parfum":             { status: "done", slug: "/parfums/evidence-yves-rocher",           note: "Evidence Yves Rocher" },
  "oxygene parfum":              { status: "done", slug: "/parfums/oxygene-lanvin",                 note: "Oxygène Lanvin" },
  "parfum elixir":               { status: "done", slug: "/parfums/libre-le-parfum-ysl",            note: "YSL Libre Le Parfum" },
  "amouage parfum":              { status: "done", slug: "/parfums/amouage-reflection",             note: "Amouage Reflection Man" },
  "jimmy choo parfum":           { status: "done", slug: "/parfums/jimmy-choo-femme",               note: "Jimmy Choo Femme EDP" },
  "calvin klein parfum":         { status: "done", slug: "/parfums/ck-one",                         note: "CK One" },
  "parfum chloe":                { status: "done", slug: "/parfums/chloe-signature",                note: "Chloé Signature" },
  "si parfum":                   { status: "done", slug: "/parfums/armani-si",                      note: "Armani Si" },
  "dior jadore parfum":          { status: "done", slug: "/parfums/dior-jadore",                    note: "Dior J'adore" },
  "parfum givenchy femme":       { status: "done", slug: "/parfums/givenchy-irresistible",          note: "Givenchy Irresistible" },
  "parfum lanvin":               { status: "done", slug: "/parfums/eclat-arpege-lanvin",            note: "Éclat d'Arpège Lanvin" },
  "lanvin parfum femme":         { status: "done", slug: "/parfums/eclat-arpege-lanvin",            note: "Éclat d'Arpège Lanvin" },
  "marc jacobs parfum":          { status: "done", slug: "/parfums/marc-jacobs-daisy",              note: "Marc Jacobs Daisy" },
  "nishane parfum":              { status: "done", slug: "/parfums/nishane-ani",                    note: "Nishane Ani" },
  "creed parfum":                { status: "done", slug: "/parfums/creed-aventus",                  note: "Creed Aventus" },
  "stronger with you parfum":    { status: "done", slug: "/parfums/stronger-with-you-intensely",    note: "Armani Stronger With You Intensely" },
  // === Batch B ===
  "5eme avenue parfum":          { status: "done", slug: "/parfums/5th-avenue-elizabeth-arden",     note: "Elizabeth Arden 5th Avenue" },
  "mont blanc parfum femme":     { status: "done", slug: "/parfums/mont-blanc-lady-emblem",         note: "Mont Blanc Lady Emblem" },
  "jean patou parfum":           { status: "done", slug: "/parfums/joy-jean-patou",                 note: "Joy Jean Patou" },
  "mauboussin parfum":           { status: "done", slug: "/parfums/mauboussin-pour-elle",           note: "Mauboussin Pour Elle" },
  "parfum l interdit":           { status: "done", slug: "/parfums/givenchy-l-interdit",            note: "Givenchy L'Interdit" },
  "givenchy parfum homme":       { status: "done", slug: "/parfums/givenchy-gentleman",             note: "Givenchy Gentleman" },
  "givenchy gentleman parfum":   { status: "done", slug: "/parfums/givenchy-gentleman",             note: "Givenchy Gentleman" },
  "azzaro parfum homme":         { status: "done", slug: "/parfums/azzaro-chrome",                  note: "Azzaro Chrome" },
  "azzaro chrome parfum":        { status: "done", slug: "/parfums/azzaro-chrome",                  note: "Azzaro Chrome" },
  "acqua di gio parfum":         { status: "done", slug: "/parfums/acqua-di-gio-armani",            note: "Acqua di Giò Parfum Armani" },
  "la nuit de l homme le parfum":{ status: "done", slug: "/parfums/la-nuit-de-l-homme-ysl",         note: "YSL La Nuit de L'Homme" },
  "layton parfums de marly":     { status: "done", slug: "/parfums/layton-parfums-de-marly",        note: "Layton Parfums de Marly" },
  "mont blanc parfum homme":     { status: "done", slug: "/parfums/mont-blanc-explorer",            note: "Mont Blanc Explorer" },
  "el nabil parfum":             { status: "done", slug: "/parfums/el-nabil-musc-makkah",           note: "El Nabil Musc Makkah" },
  "davidoff cool water parfum":  { status: "done", slug: "/parfums/davidoff-cool-water",            note: "Davidoff Cool Water" },
  "van cleef arpels parfum":     { status: "done", slug: "/parfums/van-cleef-feerie",               note: "Van Cleef & Arpels Féerie" },
  "paco rabanne olympea parfum": { status: "done", slug: "/parfums/olympea-paco-rabanne",           note: "Paco Rabanne Olympéa" },
  // === Batch C ===
  "calvin klein euphoria parfum":{ status: "done", slug: "/parfums/euphoria-calvin-klein",          note: "CK Euphoria" },
  "ysl manifesto parfum":        { status: "done", slug: "/parfums/manifesto-ysl",                  note: "YSL Manifesto" },
  "dior fahrenheit parfum":      { status: "done", slug: "/parfums/fahrenheit-dior",                note: "Dior Fahrenheit" },
  "azzaro wanted parfum":        { status: "done", slug: "/parfums/azzaro-wanted",                  note: "Azzaro Wanted" },
  "yes i am parfum":             { status: "done", slug: "/parfums/yes-i-am-cacharel",              note: "Cacharel Yes I Am" },
  "zadig voltaire parfum":       { status: "done", slug: "/parfums/this-is-her-zadig-voltaire",     note: "Zadig & Voltaire This Is Her!" },
  "dolce gabbana the one parfum":{ status: "done", slug: "/parfums/dolce-gabbana-the-one",          note: "D&G The One Femme" },
  "rasasi hawas parfum":         { status: "done", slug: "/parfums/rasasi-hawas",                   note: "Rasasi Hawas" },
  "parfum bvlgari pour homme":   { status: "done", slug: "/parfums/bvlgari-pour-homme-soir",        note: "Bvlgari Pour Homme Soir" },
  "parfum declaration cartier":  { status: "done", slug: "/parfums/declaration-cartier",            note: "Cartier Déclaration" },
  "parfum habit rouge":          { status: "done", slug: "/parfums/habit-rouge-guerlain",           note: "Guerlain Habit Rouge" },
  "parfum lacoste noir":         { status: "done", slug: "/parfums/lacoste-l12-noir",               note: "Lacoste L.12.12 Noir" },
  "parfum nautica voyage":       { status: "done", slug: "/parfums/nautica-voyage",                 note: "Nautica Voyage" },
  "parfum spicebomb":            { status: "done", slug: "/parfums/spicebomb-viktor-rolf",          note: "Spicebomb Viktor & Rolf" },
  "parfum ultra male":           { status: "done", slug: "/parfums/ultra-male-jean-paul-gaultier",  note: "JPG Ultra Male" },
  // === Batch D ===
  "parfum dior poison":          { status: "done", slug: "/parfums/poison-girl-dior",               note: "Dior Poison Girl" },
  "parfum hypnotic poison":      { status: "done", slug: "/parfums/hypnotic-poison-dior",           note: "Dior Hypnotic Poison" },
  "parfum insolence":            { status: "done", slug: "/parfums/insolence-guerlain",             note: "Guerlain Insolence" },
  "parfum kenzo flower":         { status: "done", slug: "/parfums/kenzo-flower",                   note: "Kenzo Flower" },
  "parfum la belle":             { status: "done", slug: "/parfums/la-belle-jean-paul-gaultier",    note: "JPG La Belle" },
  "parfum lady million":         { status: "done", slug: "/parfums/lady-million-paco-rabanne",      note: "Lady Million Paco Rabanne" },
  "parfum organza":              { status: "done", slug: "/parfums/organza-givenchy",               note: "Givenchy Organza" },
  "parfum flora gucci":          { status: "done", slug: "/parfums/gucci-flora-gorgeous",           note: "Gucci Flora Gorgeous Gardenia" },
  "parfum femme michael kors":   { status: "done", slug: "/parfums/michael-kors-gorgeous",          note: "Michael Kors Gorgeous" },
  "parfum femme ralph lauren":   { status: "done", slug: "/parfums/ralph-lauren-romance",           note: "Ralph Lauren Romance" },
  "parfum gris montaigne":       { status: "done", slug: "/parfums/gris-dior",                      note: "Gris Dior (ex-Gris Montaigne)" },
  "parfum drakkar noir":         { status: "done", slug: "/parfums/drakkar-noir-guy-laroche",       note: "Drakkar Noir Guy Laroche" },
  "l homme ideal eau de parfum": { status: "done", slug: "/parfums/l-homme-ideal-guerlain",         note: "Guerlain L'Homme Idéal" },
  "le beau parfum":              { status: "done", slug: "/parfums/le-beau-jean-paul-gaultier",     note: "JPG Le Beau" },
  "parfum guess homme":          { status: "done", slug: "/parfums/guess-seductive-homme",          note: "Guess Seductive Homme" },
  // === Batch E ===
  "eau de parfum mon guerlain":  { status: "done", slug: "/parfums/mon-guerlain",                   note: "Mon Guerlain" },
  "parfum amor amor":            { status: "done", slug: "/parfums/amor-amor-cacharel",             note: "Cacharel Amor Amor" },
  "parfum bonbon":               { status: "done", slug: "/parfums/bonbon-viktor-rolf",             note: "Viktor & Rolf Bonbon" },
  "parfum miu miu":              { status: "done", slug: "/parfums/miu-miu-l-eau",                  note: "Miu Miu L'Eau Bleue" },
  "parfum mademoiselle rochas":  { status: "done", slug: "/parfums/mademoiselle-rochas",            note: "Mademoiselle Rochas" },
  "ange et demon parfum":        { status: "done", slug: "/parfums/ange-ou-demon-givenchy",         note: "Givenchy Ange ou Démon" },
  "givenchy irresistible eau de parfum": { status: "done", slug: "/parfums/givenchy-irresistible",  note: "Givenchy Irresistible" },
  "goddess parfum":              { status: "done", slug: "/parfums/goddess-burberry",               note: "Burberry Goddess" },
  "issey miyake parfum":         { status: "done", slug: "/parfums/l-eau-d-issey-femme",            note: "Issey Miyake L'Eau d'Issey Femme" },
  // === SEO landing pages ===
  "parfum dubai":                { status: "done", slug: "/parfums-orientaux",                      note: "Redirigé vers catégorie parfums-orientaux" },
  "oud parfum":                  { status: "done", slug: "/parfums-orientaux",                      note: "Redirigé vers catégorie parfums-orientaux" },
  // === Skip ===
  "parfum la parisienne":        { status: "skip", slug: null, note: "YSL La Parisienne — parfum discontinué" },
};

let updated = 0;
for (const item of kw) {
  const u = updates[item.keyword];
  if (u) {
    item.status = u.status;
    if (u.slug !== undefined) item.slug = u.slug;
    if (u.note !== undefined) item.note = u.note;
    updated++;
  }
}

writeFileSync('data/keywords.json', JSON.stringify(kw, null, 2));
const pending = kw.filter(k => k.status === 'pending');
console.log(`✅ ${updated} keywords mis à jour`);
console.log(`📋 Pending restants: ${pending.length}`);
pending.forEach(k => console.log(`   - [${k.type}] ${k.keyword} (vol ${k.volume})`));
