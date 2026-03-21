/**
 * Supprime les produits en double dans products.json.
 * Pour chaque doublon, garde le meilleur slug et redirige les related[].
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const raw = JSON.parse(readFileSync('data/products.json', 'utf8'));
const products = raw.products;

const normalize = s => s.toLowerCase()
  .replace(/[éèêë]/g,'e').replace(/[àâ]/g,'a').replace(/[îï]/g,'i')
  .replace(/[ôö]/g,'o').replace(/[ùûü]/g,'u').replace(/[ç]/g,'c')
  .replace(/\s+/g,' ').trim();

const hasImg = p => existsSync('public' + p.image);

// ─── Règle : pour chaque groupe de doublons, quel slug garder ──────────────
// slug_à_supprimer → slug_à_garder
const REDIRECT = {
  // Même slug exact (entrées dupliquées) — garder la première occurrence
  // (handled separately)

  // Doublons avec slugs différents — choisir le plus SEO-friendly / celui avec image
  'jean-paul-gaultier-scandal':       'scandal-jean-paul-gaultier',
  'ysl-black-opium':                  'black-opium-ysl',
  'parfums-de-marly-delina':          'delina-parfums-de-marly',
  'al-haramain-amber-oud-gold':       'amber-oud-al-haramain',
  'lancome-idole':                    'idole-lancome',
  'ysl-libre-le-parfum':              'libre-le-parfum-ysl',
  'armani-si-edp':                    'armani-si',
  'daisy-marc-jacobs':                'marc-jacobs-daisy',
  'jean-patou-joy':                   'joy-jean-patou',
  'armani-acqua-di-gio-parfum':       'acqua-di-gio-armani',
  'parfums-de-marly-layton':          'layton-parfums-de-marly',
  'davidoff-cool-water-homme':        'davidoff-cool-water',
  'dior-fahrenheit':                  'fahrenheit-dior',
  'rasasi-hawas-homme':               'rasasi-hawas',
  'cartier-declaration':              'declaration-cartier',
  'guerlain-habit-rouge':             'habit-rouge-guerlain',
  'dior-hypnotic-poison':             'hypnotic-poison-dior',
  'givenchy-organza':                 'organza-givenchy',
  'ralph-lauren-romance-femme':       'ralph-lauren-romance',
  'guerlain-mon-guerlain':            'mon-guerlain',
  'cacharel-amor-amor':               'amor-amor-cacharel',
  'issey-miyake-l-eau-d-issey':       'l-eau-d-issey-femme',
  'parfums-de-marly-pegasus':         'pegasus-parfums-de-marly',
  'viktor-rolf-flowerbomb':           'flowerbomb-viktor-rolf',
  'versace-bright-crystal':           'bright-crystal-versace',
  'chanel-allure-homme-sport':        'allure-homme-sport-chanel',
  'ysl-opium':                        'opium-ysl',
  'versace-eros-flame':               'eros-flame-versace',
  'versace-eros-flame-parfum':        'eros-flame-versace',   // triple !
  'armaf-club-de-nuit-intense-man':   'club-de-nuit-intense-armaf',
  'carolina-herrera-good-girl-supreme': 'good-girl-supreme-carolina-herrera',
  'thierry-mugler-alien-goddess':     'alien-goddess-mugler',
  'lancome-la-nuit-tresor':           'la-nuit-tresor-lancome',
  'lancome-miracle':                  'miracle-lancome',
  'versace-yellow-diamond':           'yellow-diamond-versace',
  'gucci-rush-femme':                 'gucci-rush',
  'hermes-voyage':                    'voyage-d-hermes',
  'paco-rabanne-fame':                'fame-paco-rabanne',
  'dior-joy':                         'joy-dior',
  'carolina-herrera-212-vip-rose':    'vip-rose-carolina-herrera',
  'armaf-club-de-nuit-women':         'club-de-nuit-women-armaf',
  'dior-miss-dior-blooming-bouquet':  'miss-dior-blooming-bouquet',
  'chanel-bleu-de-chanel-parfum':     'bleu-de-chanel-parfum',
  'givenchy-pi-homme':                'givenchy-pi',
  'polo-red-ralph-lauren':            'ralph-lauren-polo-red',
  'lancome-idole-aura':               'idole-aura-lancome',
  'issey-miyake-nuit-d-issey':        'nuit-d-issey-homme',
  'guerlain-aqua-allegoria-flora-nymphea': 'guerlain-aqua-allegoria',
  'dior-j-adore-infinissime':         'dior-jadore-infinissime',
};

const SLUGS_TO_REMOVE = new Set(Object.keys(REDIRECT));

// ─── Supprimer les doublons de slug exact (garder la 1ère occurrence) ────────
const seenSlugs = new Set();
const dedupedExact = [];
let removedExact = 0;
for (const p of products) {
  if (seenSlugs.has(p.slug)) {
    removedExact++;
    // Map to itself (same slug kept)
  } else {
    seenSlugs.add(p.slug);
    dedupedExact.push(p);
  }
}
console.log(`Doublons slug exact supprimés : ${removedExact}`);

// ─── Supprimer les slugs en double (différent slug, même produit) ─────────
const dedupedFinal = dedupedExact.filter(p => !SLUGS_TO_REMOVE.has(p.slug));
const removedRedirects = dedupedExact.length - dedupedFinal.length;
console.log(`Doublons slug différent supprimés : ${removedRedirects}`);
console.log(`Produits restants : ${dedupedFinal.length}`);

// ─── Résoudre les redirects chaînés ──────────────────────────────────────────
function resolveRedirect(slug) {
  let s = slug;
  const seen = new Set();
  while (REDIRECT[s] && !seen.has(s)) {
    seen.add(s);
    s = REDIRECT[s];
  }
  return s;
}

// ─── Mettre à jour les related[] ─────────────────────────────────────────────
const validSlugs = new Set(dedupedFinal.map(p => p.slug));
let relatedFixed = 0;

for (const p of dedupedFinal) {
  if (!p.related) continue;
  const updated = p.related.map(s => {
    const r = resolveRedirect(s);
    if (r !== s) { relatedFixed++; return r; }
    return s;
  }).filter(s => validSlugs.has(s)); // enlever les slugs invalides
  // dédupliquer related
  p.related = [...new Set(updated)].slice(0, 4);
}
console.log(`related[] mis à jour : ${relatedFixed} références corrigées`);

// ─── Écrire le fichier ────────────────────────────────────────────────────────
raw.products = dedupedFinal;
writeFileSync('data/products.json', JSON.stringify(raw, null, 2));
console.log(`\n✅ products.json mis à jour : ${products.length} → ${dedupedFinal.length} produits`);
