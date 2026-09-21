export const meta = {
  name: 'reecriture-descriptions',
  description: 'Réécrit les descriptions produit qui citent un fait faux, à partir des données déjà corrigées du catalogue (aucune recherche web)',
  phases: [
    { title: 'Réécriture', detail: 'agents Sonnet, ~15 fiches chacun, 1 fichier par fiche', model: 'sonnet' },
  ],
}

const SUMMARY = {
  type: 'object',
  properties: {
    done: { type: 'number' },
    skipped: { type: 'number' },
    failed: { type: 'array', items: { type: 'string' } },
  },
  required: ['done', 'failed'],
}

function prompt(range, n) {
  const [from, to] = range
  return `Tu réécris des descriptions de fiches produit pour Maison Numidia (parfums originaux, Algérie, livraison Yalidine 58 wilayas, paiement à la réception). Les DONNÉES de chaque fiche (notes, famille, genre, concentration, volume) viennent d'être corrigées d'après Fragrantica : elles sont fiables. Les TEXTES, eux, citent encore des faits faux (anciennes notes inventées, mauvais parfumeur, mauvaise année). Ta mission : réécrire shortDescription et description en t'appuyant UNIQUEMENT sur les données corrigées. **Aucune recherche web n'est nécessaire ni autorisée.**

**Tes fiches (agent ${n})** = index ${from} à ${to} (base 0) de \`scripts/_catalog-audit/rewrite-todo.json\`.
Récupère la liste et les données (ne lis jamais un gros fichier en entier) :
node -e "const t=require('C:/Users/superindep/maisonnumidia/scripts/_catalog-audit/rewrite-todo.json').slice(${from}, ${to + 1}); const P=require('C:/Users/superindep/maisonnumidia/data/products.json').products; console.log(JSON.stringify(t.map(x=>{const p=P.find(q=>q.slug===x.slug); return {slug:x.slug, textIssue:x.textIssue, brand:p.brand, name:p.name, gender:p.gender, concentration:p.concentration, volume:p.volume, family:p.family, notes:p.notes, occasions:p.occasions, seasons:p.seasons, shortDescription:p.shortDescription, description:p.description};}), null, 1))"

Pour CHAQUE fiche, dans l'ordre :
1. Si \`scripts/_catalog-audit/rewrites/<slug>.json\` existe déjà → saute.
2. Lis l'ancienne description et le champ \`textIssue\` (ce qui était faux).
3. Réécris :
   - **shortDescription** : 2 à 3 phrases, 30 à 50 mots.
   - **description** : 220 à 300 mots, en paragraphes, ton commercial mais sobre.
   Contenu autorisé : la marque, le nom, la concentration, le volume, la famille olfactive, les notes de tête/cœur/fond EXACTES du champ \`notes\`, les occasions et saisons du champ correspondant, et les arguments commerciaux de la boutique : 100% original, livraison Yalidine dans les 58 wilayas, paiement à la réception, droit de refus à la livraison.
   INTERDIT : inventer une note, un parfumeur, une année, une récompense ; "certificat de conformité", "nos entrepôts", "coffret d'origine", "scellé", garanties chiffrées ; les formules IA ("Il est important de noter", "En conclusion", "N'hésitez pas") ; les tirets "---" ; les étoiles ou notes sur 5 ; les prix ; toute affirmation chiffrée sur la tenue ou le sillage (dire "bonne tenue" est permis, "8 heures" non).
   Garde le français naturel et humain, varie les tournures d'une fiche à l'autre (ne recopie pas la même trame partout), et n'écris jamais deux fois la même phrase d'accroche.
4. Écris TOUT DE SUITE le fichier \`scripts/_catalog-audit/rewrites/<slug>.json\` avec l'outil Write, AVANT la fiche suivante :
{"slug":"...","shortDescription":"...","description":"...","basedOn":"notes+famille corrigées","checkedAt":"2026-09-21"}
Vérifie que le JSON se parse.

Rends le résumé chiffré demandé.`
}

const TOTAL = args.total
const PER = args.per || 15
const CONCURRENCY = args.concurrency || 5
const chunks = []
for (let i = 0; i < TOTAL; i += PER) chunks.push([i, Math.min(TOTAL - 1, i + PER - 1)])

phase('Réécriture')
const all = []
for (let i = 0; i < chunks.length; i += CONCURRENCY) {
  const wave = chunks.slice(i, i + CONCURRENCY)
  log(`Vague ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(chunks.length / CONCURRENCY)} — fiches ${wave[0][0]} à ${wave[wave.length - 1][1]} sur ${TOTAL}`)
  const res = await parallel(wave.map((c, k) => () =>
    agent(prompt(c, i + k + 1), { label: `réécriture ${c[0]}-${c[1]}`, phase: 'Réécriture', model: 'sonnet', schema: SUMMARY })
  ))
  all.push(res)
}
const flat = all.flat().filter(Boolean)
return { agents: flat.length, fiches: flat.reduce((s, r) => s + (r.done || 0), 0), failed: flat.flatMap((r) => r.failed || []) }
