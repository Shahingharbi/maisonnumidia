export const meta = {
  name: 'audit-fiches-catalogue',
  description: 'Audit Fragrantica de toutes les fiches produit : agents Sonnet par lots, 1 fichier résultat par fiche (reprenable après coupure)',
  phases: [
    { title: 'Audit', detail: 'vagues de 4 agents Sonnet, ~12 fiches chacun', model: 'sonnet' },
  ],
}

const SUMMARY = {
  type: 'object',
  properties: {
    done: { type: 'array', items: { type: 'string' } },
    skippedAlreadyDone: { type: 'array', items: { type: 'string' } },
    failed: { type: 'array', items: { type: 'string' } },
    notes: { type: 'string' },
  },
  required: ['done', 'failed'],
}

function prompt(range, n) {
  const [from, to] = range
  return `Tu audites des fiches produit de Maison Numidia (C:\\Users\\superindep\\maisonnumidia), boutique en ligne de parfums originaux en Algérie. Beaucoup de fiches ont été rédigées sans source et contiennent des erreurs (notes olfactives inventées, volume ou concentration qui n'existent pas, nom faux, produit qui n'existe pas, parfum arrêté). Ta mission : vérifier chaque fiche contre FRAGRANTICA et proposer les corrections. Tu NE modifies PAS data/products.json.

Lis d'abord la procédure : C:\\Users\\superindep\\maisonnumidia\\scripts\\_catalog-audit\\README.md (format de sortie inclus).

**Tes fiches (agent ${n})** = les slugs d'index ${from} à ${to} (inclus, base 0) du fichier \`scripts\\_catalog-audit\\todo.json\`. Récupère-les d'abord, puis traite-les UNE PAR UNE dans cet ordre :
node -e "const t=require('C:/Users/superindep/maisonnumidia/scripts/_catalog-audit/todo.json').slice(${from}, ${to + 1}); console.log(t.join(' '))"
Les données de chaque fiche sont dans C:\\Users\\superindep\\maisonnumidia\\scripts\\_catalog-audit\\catalog-lot.json (2 Mo : NE LE LIS JAMAIS EN ENTIER, filtre avec node -e sur tes slugs uniquement). Chaque fiche contient les données actuelles, \`fragranticaIdHint\` (ID trouvé dans d'anciens scripts d'images, PAS fiable à 100 %), \`competitorHints\` (libellés/volumes/prix vus chez des boutiques algériennes) et parfois \`knownIssue\` (problème déjà signalé par un précédent agent : vérifie-le en priorité).

AVANT chaque fiche : si C:\\Users\\superindep\\maisonnumidia\\scripts\\_catalog-audit\\results\\<slug>.json existe déjà, SAUTE la fiche (déjà traitée).

Méthode par fiche (au plus 3 WebSearch + 2 WebFetch) :
1. WebSearch \`fragrantica <marque> <nom>\` (ajoute la concentration si utile). Les pages fragrantica.com sont bloquées aux outils automatiques : N'ESSAIE PAS de les ouvrir avec WebFetch et ne contourne rien. Utilise ce que les résultats de recherche donnent (titre = nom officiel + genre + année, URL = ID, résumé = notes). Pour recouper, tu peux ouvrir avec WebFetch le site officiel de la marque ou une grande parfumerie (Sephora, Notino, Nocibé…), jamais fragrantica.
2. Identifie LE bon parfum : même ligne ET même déclinaison ("Sauvage" ≠ "Sauvage Elixir"), même concentration que la fiche si elle existe. Compare l'ID trouvé avec \`fragranticaIdHint\` : "confirmed" s'il est identique, "wrong" sinon (l'image du site vient de cet ID, donc ID faux = image fausse : donne le bon ID).
3. Vérifie et corrige si besoin : nom officiel, genre (for men → "homme", for women → "femme", for women and men → "unisexe"), concentration (valeurs autorisées : "EDT", "EDP", "Parfum", "Extrait de Parfum", "Cologne", "EDP Intense", "EDT Intense"), volume (contenance qui EXISTE pour ce parfum ; aide-toi de competitorHints), famille olfactive (libellé français court style "Boisé Aromatique", "Floral Fruité"), notes tête/cœur/fond EN FRANÇAIS ("Bergamote", "Poivre rose", "Fève tonka"…). Si Fragrantica ne découpe pas en tête/cœur/fond, mets tout dans "top" et signale-le dans issues.
4. Parfum arrêté ou quasi introuvable → discontinued "yes" + corrections.inStock = false. Produit qui n'existe pas → exists false, sans inventer de remplaçant.
5. Si le genre change : propose aussi corrections.category ("parfums-homme" / "parfums-femme" ; un produit "parfums-orientaux" y reste) et corrections.h1 au format "{Marque} {Nom} Parfum {Genre} Algérie" (Genre = Homme, Femme ou Mixte).
6. Si notes/famille/nom/concentration étaient faux ET que shortDescription/description citent ces erreurs : description.needsRewrite = true et réécris les deux textes en français, longueur proche de l'original, structure conservée, uniquement des faits vérifiés. Règles de rédaction : ton naturel, pas de tirets "---", pas de formules IA ("Il est important de noter", "En conclusion", "N'hésitez pas"), pas d'étoiles ni de note sur 5, pas de prix, aucune affirmation inventée sur la tenue/le sillage, année correcte (2026). INTERDIT aussi : toute promesse commerciale non vérifiable ("certificat de conformité", "nos entrepôts", "coffret d'origine", "scellé", garanties chiffrées). Les seuls arguments commerciaux autorisés : 100% original, livraison Yalidine dans les 58 wilayas, paiement à la réception, droit de refus à la livraison. Si les textes ne citent rien de faux : needsRewrite false, textes à null.
7. N'invente JAMAIS. Info non confirmée = pas de correction, signalée dans issues en severity "low". confidence : "high" si clair, "medium" si recoupement partiel, "low" si doute.
8. Écris IMMÉDIATEMENT le résultat dans scripts\\_catalog-audit\\results\\<slug>.json (JSON valide, format du README, checkedAt "2026-09-19") avec l'outil Write, AVANT de passer à la fiche suivante. C'est ce qui protège le travail en cas de coupure.

Travaille séquentiellement, sans navigateur. Rends le résumé structuré (faits, sautés, en échec).`
}

// args : { total } = nombre de slugs dans todo.json, { per } par agent, { concurrency } agents en parallèle
// Les agents lisent eux-mêmes todo.json (par plage d'index) : aucune liste de slugs à recopier.
const TOTAL = args.total
const PER = args.per || 12
const CONCURRENCY = args.concurrency || 4
const chunks = []
for (let i = 0; i < TOTAL; i += PER) chunks.push([i, Math.min(TOTAL - 1, i + PER - 1)])

phase('Audit')
const all = []
for (let i = 0; i < chunks.length; i += CONCURRENCY) {
  const wave = chunks.slice(i, i + CONCURRENCY)
  log(`Vague ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(chunks.length / CONCURRENCY)} — fiches ${wave[0][0]} à ${wave[wave.length - 1][1]} sur ${TOTAL}`)
  const res = await parallel(wave.map((c, k) => () =>
    agent(prompt(c, i + k + 1), { label: `fiches ${c[0]}-${c[1]}`, phase: 'Audit', model: 'sonnet', schema: SUMMARY })
  ))
  all.push(res)
}
const flat = all.flat().filter(Boolean)
return { agents: flat.length, done: flat.flatMap((r) => r.done || []).length, failed: flat.flatMap((r) => r.failed || []) }
