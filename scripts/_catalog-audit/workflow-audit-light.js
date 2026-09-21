export const meta = {
  name: 'audit-fiches-leger',
  description: 'Mode léger : vérification des FAITS de chaque fiche (notes, nom, concentration, volume, genre, ID image) sans réécriture de texte — agents Sonnet, 1 fichier résultat par fiche',
  phases: [
    { title: 'Audit léger', detail: 'vagues d agents Sonnet, ~20 fiches chacun, 1 recherche par fiche', model: 'sonnet' },
  ],
}

const SUMMARY = {
  type: 'object',
  properties: {
    done: { type: 'number' },
    wrongNotes: { type: 'number' },
    wrongId: { type: 'number' },
    ghosts: { type: 'array', items: { type: 'string' } },
    failed: { type: 'array', items: { type: 'string' } },
  },
  required: ['done', 'failed'],
}

function prompt(range, n) {
  const [from, to] = range
  return `Audit RAPIDE de fiches produit pour Maison Numidia (parfums originaux, Algérie). Beaucoup de fiches ont des données inventées. Tu vérifies les FAITS contre Fragrantica. Tu ne réécris AUCUN texte. Tu ne modifies PAS data/products.json.

**Tes fiches (agent ${n})** = slugs d'index ${from} à ${to} (base 0) de \`scripts/_catalog-audit/todo.json\` :
node -e "const t=require('C:/Users/superindep/maisonnumidia/scripts/_catalog-audit/todo.json').slice(${from}, ${to + 1}); console.log(JSON.stringify(t))"
Données de chaque fiche (ne lis JAMAIS le fichier entier, filtre par slug) :
node -e "const l=require('C:/Users/superindep/maisonnumidia/scripts/_catalog-audit/catalog-lot.json').find(x=>x.slug==='SLUG'); const {slug,brand,name,gender,concentration,volume,family,notes,fragranticaIdHint,competitorHints}=l; console.log(JSON.stringify({slug,brand,name,gender,concentration,volume,family,notes,fragranticaIdHint,competitorHints}))"

Pour CHAQUE fiche, dans l'ordre :
1. Si \`scripts/_catalog-audit/results/<slug>.json\` existe déjà → saute la fiche.
2. **UNE seule WebSearch** : \`fragrantica <marque> <nom>\`. Les pages fragrantica.com sont bloquées aux robots : ne les ouvre pas, ne contourne rien. Le titre du résultat donne le nom officiel + le genre ("for women"/"for men"/"for women and men") + l'année, l'URL donne l'ID, le résumé donne les notes. Une 2e recherche UNIQUEMENT si le parfum reste introuvable ou si deux déclinaisons se confondent. Pas de WebFetch sauf cas vraiment douteux (1 max).
3. Compare et note ce qui est FAUX :
   - notes tête/cœur/fond (en français : "Bergamote", "Fève tonka"…) ;
   - nom officiel, genre ("homme"/"femme"/"unisexe"), concentration ("EDT","EDP","Parfum","Extrait de Parfum","Cologne","EDP Intense","EDT Intense"), volume (contenance qui existe vraiment ; aide-toi de competitorHints), famille olfactive (libellé court style "Boisé Aromatique") ;
   - ID : "confirmed" si l'ID de l'URL Fragrantica = fragranticaIdHint, sinon "wrong" + le bon ID (l'image du site vient de cet ID, donc ID faux = image fausse) ;
   - parfum arrêté/introuvable → discontinued "yes" ; parfum qui n'existe pas → exists false.
4. N'invente rien. Ce que tu ne confirmes pas, tu ne le corriges pas. confidence "high" si le résultat Fragrantica est clair, sinon "medium"/"low".
5. Écris TOUT DE SUITE \`scripts/_catalog-audit/results/<slug>.json\` (outil Write) AVANT la fiche suivante — c'est ce qui protège le travail en cas de coupure. Format COMPACT, sans prose inutile :
{"slug":"...","fragrantica":{"url":"...","id":123,"officialName":"...","gender":"men|women|unisex","year":2017,"notes":{"top":[],"heart":[],"base":[]}},"idStatus":"confirmed|wrong","exists":true,"discontinued":"no|yes|unknown","corrections":{"name":null,"h1":null,"gender":null,"category":null,"concentration":null,"volume":null,"family":null,"notes":null,"inStock":null},"description":{"needsRewrite":false,"shortDescription":null,"description":null},"confidence":"high","mode":"leger","checkedAt":"2026-09-19"}
Mets dans \`corrections\` UNIQUEMENT les champs à changer (les autres restent null). \`notes\` = les 3 listes complètes si l'une d'elles change. Si le nom ou le genre change, remplis aussi \`h1\` = "{Marque} {Nom} Parfum {Genre} Algérie" (Genre = Homme/Femme/Mixte). \`description\` reste toujours à needsRewrite:false en mode léger (on réécrira les textes plus tard) — mais si la description contient une affirmation fausse (mauvais parfumeur, mauvaise année, note inexistante), ajoute "textIssue":"courte phrase" à la racine du JSON.

Va vite : pas de vérification superflue, pas de script lourd, pas de navigateur. Rends le résumé chiffré demandé.`
}

const TOTAL = args.total
const PER = args.per || 20
const CONCURRENCY = args.concurrency || 3
const chunks = []
for (let i = 0; i < TOTAL; i += PER) chunks.push([i, Math.min(TOTAL - 1, i + PER - 1)])

phase('Audit léger')
const all = []
for (let i = 0; i < chunks.length; i += CONCURRENCY) {
  const wave = chunks.slice(i, i + CONCURRENCY)
  log(`Vague ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(chunks.length / CONCURRENCY)} — fiches ${wave[0][0]} à ${wave[wave.length - 1][1]} sur ${TOTAL}`)
  const res = await parallel(wave.map((c, k) => () =>
    agent(prompt(c, i + k + 1), { label: `fiches ${c[0]}-${c[1]}`, phase: 'Audit léger', model: 'sonnet', schema: SUMMARY })
  ))
  all.push(res)
}
const flat = all.flat().filter(Boolean)
return { agents: flat.length, fiches: flat.reduce((s, r) => s + (r.done || 0), 0), notesFausses: flat.reduce((s, r) => s + (r.wrongNotes || 0), 0), imagesFausses: flat.reduce((s, r) => s + (r.wrongId || 0), 0), fantomes: flat.flatMap((r) => r.ghosts || []) }
