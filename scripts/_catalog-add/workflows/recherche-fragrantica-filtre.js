export const meta = {
  name: 'recherche-vague2-fragrantica-filtre',
  description: 'Recherche Fragrantica des parfums restants (filtre de domaine fragrantica.com) + documentation de 4 maisons à créer',
  phases: [
    { title: 'Recherche', detail: 'agents Sonnet, 15 parfums chacun, 1 recherche filtrée par parfum', model: 'sonnet' },
    { title: 'Marques', detail: '4 maisons à documenter avec sources' },
  ],
}

const R = 'C:/Users/superindep/maisonnumidia/scripts/_catalog-add'
const DATE = args.date

const SUMMARY = {
  type: 'object',
  properties: {
    faits: { type: 'number' },
    dejaFaits: { type: 'number' },
    recherches: { type: 'number', description: 'nombre total de WebSearch lances' },
    introuvables: { type: 'array', items: { type: 'string' } },
    echecs: { type: 'array', items: { type: 'string' } },
  },
  required: ['faits', 'echecs'],
}
const MARQUE = {
  type: 'object',
  properties: { slug: { type: 'string' }, ecrit: { type: 'boolean' }, confiance: { type: 'string' }, remarque: { type: 'string' } },
  required: ['slug', 'ecrit'],
}

function prompt(from, to, n) {
  return `Tu prepares l'ajout de parfums au catalogue de Maison Numidia (parfums originaux, Algerie). Ces parfums-ci ont ete reperes chez **une ou deux boutiques algeriennes seulement** — peu de garanties. Le tri qualite a deja ecarte le maquillage, les soins, les coffrets et tout ce qui se vend sous 6 500 DA. **A toi d'ecarter ce qui n'existe pas.**

Tu ne modifies PAS data/products.json. Tu ecris un fichier par parfum.

**Tes parfums (agent ${n})** = index ${from} a ${to} (base 0) de \`scripts/_catalog-add/a-rechercher-restant.json\` :
node -e "const fs=require('fs');const c=require('${R}/a-rechercher-restant.json').slice(${from}, ${to + 1}); console.log(JSON.stringify(c.map(x=>({slug:x.slug,dejaFait:fs.existsSync('${R}/research/'+x.slug+'.json'),marque:x.marque,nom:x.nom,concentration:x.concentration,volume:x.volume,prix:x.prix,boutiques:x.nbBoutiques,source:x.source})), null, 1))"

Pour CHAQUE parfum, dans l'ordre :
1. Si \`dejaFait\` est true -> saute, sans aucune recherche.
2. **UNE seule WebSearch, obligatoirement filtree sur Fragrantica** : parametres \`query: "<marque> <nom>"\` (SANS le mot fragrantica ; nettoie le libelle : enleve la marque repetee, "EDP", "100ml", "pour homme" si superflu ; corrige une faute evidente de marque : "Victor&Rolf" -> "Viktor&Rolf", "Narcisco" -> "Narciso"), \`mode: "standard"\`, et **\`allowed_domains: ["fragrantica.com"]\`**. Sans ce filtre, le moteur ne renvoie plus aucune page Fragrantica (constate le ${DATE}) : ne lance jamais de recherche sans lui. Les pages fragrantica.com sont bloquees aux outils automatiques : ne les ouvre JAMAIS avec WebFetch, ne contourne rien. Le titre du resultat donne le nom officiel + le genre ("for women" / "for men" / "for women and men") + l'annee, l'URL \`fragrantica.com/perfume/<Marque>/<Nom>-<ID>.html\` donne l'ID, le resume donne les notes. Ignore les resultats de forum (\`/board/\`), d'actualites (\`/news/\`) et de \`beta.fragrantica.com\` quand la page \`www\` existe.
   Une 2e recherche (meme filtre) uniquement si deux declinaisons se confondent ou si la premiere ne renvoie aucune page \`/perfume/\` de cette maison. **Budget strict : 17 recherches au total pour tes 15 parfums.**
3. **Sois exigeant sur l'existence.** Le libelle peut etre fantaisiste, mal orthographie, ou designer un produit qui n'est pas de cette maison (ou pas un parfum : soin, gel douche, deodorant -> \`existe: false\`, remarque "pas un parfum"). Si aucune page \`/perfume/\` ne correspond a CE parfum de CETTE maison, mets \`existe: false\` et passe. Ne rabats jamais sur un parfum voisin au nom proche : « Club de Nuit Oud » n'est pas « Club de Nuit Intense », un « Elixir » n'est pas l'« Eau de Parfum ». Mieux vaut dix parfums ecartes qu'une fiche inventee.
4. L'ID Fragrantica est l'entier a la fin de l'URL. **Ne le DEDUIS jamais** : il vient de l'URL que tu as sous les yeux, sinon \`id: null\` et confiance basse.
5. Notes en FRANCAIS, avec les accents ("Bergamote", "Fève tonka", "Poivre rose"), recopiees du resultat, jamais devinees. Si la pyramide n'est pas visible dans le resultat, laisse les tableaux vides et dis-le dans \`remarque\`. Famille en libelle court francais ("Boisé Aromatique", "Floral Fruité").
6. Genre : "homme" (for men), "femme" (for women), "unisexe" (for women and men).
7. Confiance : "haute" si l'URL /perfume/ correspond exactement (maison + nom + declinaison) ; "moyenne" si un doute leger subsiste (declinaison, annee) ; "basse" sinon.
8. Ecris TOUT DE SUITE \`${R}/research/<slug>.json\` avec l'outil Write, AVANT le parfum suivant :
{"slug":"...","existe":true,"fragrantica":{"url":"...","id":78621,"nomOfficiel":"...","marqueOfficielle":"...","genre":"homme|femme|unisexe","annee":2021},"notes":{"top":[],"heart":[],"base":[]},"famille":"...","concentrationConfirmee":"EDP|EDT|Parfum|EDC|EDP Intense|EDT Intense|Extrait de Parfum|Cologne","volumeExiste":true,"remarque":null,"confiance":"haute|moyenne|basse","verifieLe":"${DATE}"}
Le fichier doit etre du JSON strict (guillemets doubles, pas de virgule finale, pas de commentaire).

Si la WebSearch renvoie une erreur de quota ou de limite (« budget is used up »), arrete-toi aussitot (n'ecris pas de fichier pour ce parfum) et mets les slugs restants dans \`echecs\`.

Rends le resume chiffre demande (\`faits\` = fichiers que TU as ecrits, \`dejaFaits\` = sautes, \`recherches\` = WebSearch lances), en listant dans \`introuvables\` les slugs mis a existe:false.`
}

function promptMarque(m) {
  return `Tu documentes une maison de parfum avant sa creation dans le catalogue de Maison Numidia (parfums originaux, Algerie). Sa description s'affichera sur la page publique /marques/${m.slug} : **une date ou un fait invente serait une erreur publiee.**

Maison : **${m.nom}** (slug \`${m.slug}\`).

1. Regarde le format attendu : \`${R}/marques/brioni.json\` et \`${R}/marques/thomas-kosmala.json\` (deux exemples, l'un sur, l'autre prudent).
2. Fais **au plus 2 WebSearch** (mode "standard") pour etablir : pays d'origine, annee de fondation, fondateur, positionnement (niche, luxe…). Privilegie le site officiel de la maison et des sources serieuses (presse, Wikipedia, revendeurs etablis). N'ouvre pas les pages fragrantica.com avec WebFetch.
3. Ecris \`${R}/marques/${m.slug}.json\` :
{"slug":"${m.slug}","nom":"${m.nom}","origine":"<pays en francais, ou \\"Non documenté\\">","description":"<35 a 70 mots>","sources":["<url>","<url>"],"confiance":"haute|moyenne|basse","verifieLe":"${DATE}"}
   - La description : 2 ou 3 phrases sobres, en francais avec les accents, qui disent ce qu'est la maison (origine, fondation, style), et se terminent par « Disponible en Algérie. ». Rien que ce que tes sources disent.
   - Si deux sources se contredisent sur une date ou un pays, n'affirme ni l'un ni l'autre et mets confiance "basse" (une description sans date ni pays est alors la bonne reponse).
   - INTERDIT : superlatifs publicitaires (incontournable, légendaire, mythique, le meilleur, numéro un), chiffres de vente, recompenses non sourcees, formules creuses.
   - 25 a 90 mots, sinon le script d'import la refusera.
4. Verifie que le JSON se parse : node -e "JSON.parse(require('fs').readFileSync('${R}/marques/${m.slug}.json','utf8'));console.log('ok')"

Si la WebSearch renvoie une erreur de quota, n'ecris rien et rends ecrit:false.`
}

const FROM = args.from
const TOTAL = args.total
const PER = 15
const chunks = []
for (let i = FROM; i < TOTAL; i += PER) chunks.push([i, Math.min(TOTAL - 1, i + PER - 1)])

phase('Recherche')
log(`Recherche des parfums ${FROM} a ${TOTAL - 1} (${chunks.length} agents) + ${args.marques.length} maisons`)
const [recherche, marques] = await Promise.all([
  parallel(chunks.map((c, k) => () =>
    agent(prompt(c[0], c[1], k + 1), { label: `recherche ${c[0]}-${c[1]}`, phase: 'Recherche', model: 'sonnet', schema: SUMMARY })
  )),
  parallel(args.marques.map((m) => () =>
    agent(promptMarque(m), { label: `marque ${m.slug}`, phase: 'Marques', schema: MARQUE })
  )),
])
const flat = recherche.filter(Boolean)
return {
  agents: flat.length,
  faits: flat.reduce((s, r) => s + (r.faits || 0), 0),
  dejaFaits: flat.reduce((s, r) => s + (r.dejaFaits || 0), 0),
  recherches: flat.reduce((s, r) => s + (r.recherches || 0), 0),
  introuvables: flat.flatMap((r) => r.introuvables || []),
  echecs: flat.flatMap((r) => r.echecs || []),
  marques: marques.filter(Boolean),
}
