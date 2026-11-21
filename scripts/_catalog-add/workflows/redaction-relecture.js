export const meta = {
  name: 'fiches-redaction-relecture',
  description: 'Rédige les textes des fiches en attente (relecture-fige-N.json), puis relecture indépendante et correction minimale des défauts confirmés (aucune recherche web)',
  phases: [
    { title: 'Redaction', detail: 'agents Sonnet, 6 fiches chacun, 1 fichier par fiche', model: 'sonnet' },
    { title: 'Relecture', detail: 'un relecteur par tranche de 15 fiches, sans recherche web' },
    { title: 'Correction', detail: 'contre-vérification de chaque défaut signalé, correction minimale si confirmé' },
  ],
}

const R = 'C:/Users/superindep/maisonnumidia/scripts/_catalog-add'
const FIGE = `${R}/relecture-fige-${args.lot || 5}.json`
const DATE = args.date

const SUMMARY = {
  type: 'object',
  properties: { faits: { type: 'number' }, sautes: { type: 'number' }, echecs: { type: 'array', items: { type: 'string' } } },
  required: ['faits', 'echecs'],
}
const PROBLEMES = {
  type: 'object',
  properties: {
    problemes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          type: { type: 'string', enum: ['info-inventee', 'genre-faux', 'format-faux', 'nom-faux', 'note-inventee', 'formule-interdite', 'autre'] },
          citation: { type: 'string' },
          explication: { type: 'string' },
        },
        required: ['slug', 'type', 'citation', 'explication'],
      },
    },
    relues: { type: 'number' },
    sansTexte: { type: 'array', items: { type: 'string' } },
  },
  required: ['problemes', 'relues'],
}
const VERDICT = {
  type: 'object',
  properties: { confirme: { type: 'boolean' }, corrige: { type: 'boolean' }, avant: { type: 'string' }, apres: { type: 'string' }, raison: { type: 'string' } },
  required: ['confirme', 'corrige', 'raison'],
}

function promptRedaction(from, to, n) {
  return `Tu rediges les textes de nouvelles fiches produit pour Maison Numidia, boutique en ligne de parfums originaux en Algerie (livraison Yalidine dans les 69 wilayas, paiement a la livraison, droit de refus a la livraison).

Les donnees de chaque fiche (notes, famille, genre, concentration, volume) viennent d'etre verifiees sur Fragrantica : elles sont fiables et ce sont les SEULES dont tu disposes. **Aucune recherche web n'est necessaire ni autorisee** (ni WebSearch ni WebFetch).

**Tes fiches (agent ${n})** = index ${from} a ${to} (base 0) de \`${FIGE}\` :
node -e "console.log(JSON.stringify(require('${FIGE}').slice(${from}, ${to + 1}), null, 1))"

Pour CHAQUE fiche, dans l'ordre :
1. Si \`${R}/texts/<slug>.json\` existe deja -> saute.
2. Redige :
   - **shortDescription** : 2 a 3 phrases, 30 a 50 mots. Elle doit donner la signature du parfum, pas un slogan.
   - **description** : 220 a 300 mots, en 3 ou 4 paragraphes separes par une ligne vide, ton commercial mais sobre, francais naturel et humain, avec les accents.
   Structure qui marche : ce qu'est le parfum et a qui il s'adresse / l'ouverture / le coeur et le fond / quand le porter, avec un mot sur la boutique.
3. Contenu AUTORISE, et rien d'autre : la marque, le nom, la concentration, le volume, la famille olfactive, les notes de tete/coeur/fond EXACTES du champ \`notes\`, les occasions et saisons fournies, et les arguments de la boutique (100% original, livraison Yalidine dans les 69 wilayas, paiement a la livraison, droit de refus a la livraison).
4. INTERDIT :
   - inventer une note, un parfumeur, une annee, une recompense, un chiffre de vente, une histoire de la maison
   - toute comparaison a une autre version ou a un autre parfum (« la version la plus concentree de la gamme », « plus leger que l'original », « inspire de ») : aucune donnee ne te le dit
   - citer une note qui n'est pas dans le champ \`notes\` de CETTE fiche (c'est l'erreur la plus grave : les notes affichees juste a cote la contrediraient)
   - "certificat de conformite", "nos entrepots", "fournisseurs verifies", "coffret d'origine", "scelle", "dedouane", toute garantie chiffree
   - les formules IA : "Il est important de noter", "En conclusion", "N'hesitez pas", "Pour conclure", "Que vous soyez... ou..."
   - le sigle "COD", le mot "WhatsApp", "58 wilayas"
   - les tirets "---", les etoiles, les notes sur 5, les avis, les prix en chiffres
   - toute affirmation chiffree sur la tenue ou le sillage ("8 heures" non ; "bonne tenue" oui)
   - l'annee 2025 (on est en 2026)
5. Varie les tournures d'une fiche a l'autre. N'ecris jamais deux fois la meme phrase d'accroche, et ne commence pas systematiquement par "<Marque> <Nom> est...". Les mots generiques d'accord (agrumes, boise, poudre, aquatique, gourmand) sont permis : ce sont des descriptions, pas des revendications de notes.
6. Ecris TOUT DE SUITE \`${R}/texts/<slug>.json\` avec l'outil Write, AVANT la fiche suivante (protection en cas de coupure) :
{"slug":"...","shortDescription":"...","description":"...","ecritLe":"${DATE}"}
Verifie que le JSON se parse et que les retours a la ligne sont bien encodes (\\n\\n entre paragraphes).

Rends le resume chiffre demande.`
}

function promptRelecture(from, to) {
  return `Tu relis, AVANT publication, les textes de nouvelles fiches produit de Maison Numidia (parfums originaux, Algerie). Tu ne fais AUCUNE recherche web (pas de WebSearch, pas de WebFetch) et tu ne modifies AUCUN fichier : tu signales.

Fiches a relire = index ${from} a ${to} (base 0) de ${FIGE} :
node -e "const c=require('${FIGE}').slice(${from}, ${to + 1}); console.log(JSON.stringify(c, null, 1))"

Pour chaque fiche, lis le texte : ${R}/texts/<slug>.json (champs shortDescription et description), et les donnees verifiees de Fragrantica : ${R}/research/<slugCandidat>.json (nom officiel, annee, genre, notes). Si le fichier texte n'existe pas, mets le slug dans \`sansTexte\` et passe.

Signale UNIQUEMENT ces defauts, avec la phrase exacte en citation :
- info-inventee : tout fait que ni la fiche ni le fichier de recherche ne fournissent. Par exemple un nom de parfumeur, une annee de lancement differente de "annee", un prix ou un classement, "best-seller", "edition limitee" non documentee, une inspiration ou un "dupe" d'un autre parfum, une duree chiffree de tenue ("8 heures"), une comparaison avec un parfum precis ou avec une autre version de la gamme (« la plus concentree », « plus leger que l'original »), une histoire de la maison qu'aucune donnee ne fournit. "Bonne tenue" sans chiffre et les descriptions sensorielles des notes sont AUTORISEES.
- genre-faux : le texte presente le parfum pour un genre different du champ gender (unisexe = mixte, homme et femme).
- format-faux : concentration ou volume differents de la fiche.
- nom-faux : le parfum ou la maison est nomme autrement que brand/name (une graphie raccourcie evidente est toleree), ou nom tronque/absurde.
- note-inventee : une matiere presentee comme une NOTE du parfum alors qu'elle n'est pas dans notes (un adjectif descriptif comme "poivre" pour la cardamome ou "fruits tropicaux" pour mangue+goyave est tolere).
- formule-interdite : "Il est important de noter", "En conclusion", "N'hesitez pas", "COD", "58 wilayas", annee 2025, etoiles ou note sur 5, "WhatsApp".
- autre : phrase cassee, repetition d'un paragraphe entier, texte manifestement d'un autre parfum, description de moins de 180 mots ou en un seul bloc.

Sois exigeant mais pas tatillon : le style ne compte pas, seuls les faits et les interdits comptent. Rends la liste (vide si tout est propre) et le nombre de fiches relues.`
}

function promptCorrection(p) {
  return `Un relecteur signale un defaut dans le texte d'une fiche produit de Maison Numidia. Ton role : verifier qu'il a raison, et seulement si c'est le cas, corriger le texte au minimum. Aucune recherche web.

Fiche : ${p.slug}
Defaut signale (${p.type}) : ${p.explication}
Phrase citee : « ${p.citation} »

1. Lis ${FIGE} (entree dont slug = "${p.slug}") pour les donnees de la fiche, ${R}/research/<slugCandidat>.json pour les donnees Fragrantica, et ${R}/texts/${p.slug}.json pour le texte.
2. Le defaut est-il REEL ? Par defaut, sois sceptique : une description sensorielle, un adjectif ("poivre", "boise") ou un argument de la boutique (100% original, livraison Yalidine dans les 69 wilayas, paiement a la livraison, droit de refus a la livraison) n'est pas un defaut. "Bonne tenue" sans chiffre est autorise.
3. Si le defaut est reel : corrige ${R}/texts/${p.slug}.json avec l'outil Edit, en touchant le MOINS possible (supprimer ou reformuler la seule phrase fautive, sans rien inventer d'autre). Le fichier doit rester du JSON valide ; verifie ensuite avec : node -e "JSON.parse(require('fs').readFileSync('${R}/texts/${p.slug}.json','utf8'));console.log('ok')"
4. Ne touche a aucun autre fichier.

Rends : confirme (defaut reel ?), corrige (fichier modifie ?), avant/apres (la phrase), raison.`
}

const TOTAL = args.total
const PER = 6
const redac = []
for (let i = 0; i < TOTAL; i += PER) redac.push([i, Math.min(TOTAL - 1, i + PER - 1)])

phase('Redaction')
// Barrière voulue : la relecture ne doit commencer qu'une fois TOUS les textes écrits.
const ecrits = await parallel(redac.map((c, k) => () =>
  agent(promptRedaction(c[0], c[1], k + 1), { label: `redaction ${c[0]}-${c[1]}`, phase: 'Redaction', model: 'sonnet', schema: SUMMARY })
))
const okRedac = ecrits.filter(Boolean)
log(`Rédaction : ${okRedac.reduce((s, r) => s + (r.faits || 0), 0)} textes écrits, ${okRedac.flatMap((r) => r.echecs || []).length} échecs`)

const PER_R = 15
const relec = []
for (let i = 0; i < TOTAL; i += PER_R) relec.push([i, Math.min(TOTAL - 1, i + PER_R - 1)])

const res = await pipeline(
  relec,
  (c) => agent(promptRelecture(c[0], c[1]), { label: `relecture ${c[0]}-${c[1]}`, phase: 'Relecture', schema: PROBLEMES }),
  (r) => parallel((r ? r.problemes : []).map((p) => () =>
    agent(promptCorrection(p), { label: `correction ${p.slug}`, phase: 'Correction', model: 'sonnet', schema: VERDICT })
      .then((v) => ({ ...p, verdict: v }))
  )),
)
const tous = res.flat().filter(Boolean)
return {
  redaction: { faits: okRedac.reduce((s, r) => s + (r.faits || 0), 0), echecs: okRedac.flatMap((r) => r.echecs || []) },
  signales: tous.length,
  confirmes: tous.filter((x) => x.verdict && x.verdict.confirme).length,
  corriges: tous.filter((x) => x.verdict && x.verdict.corrige).map((x) => ({ slug: x.slug, type: x.type, avant: x.verdict.avant, apres: x.verdict.apres })),
  rejetes: tous.filter((x) => x.verdict && !x.verdict.confirme).map((x) => ({ slug: x.slug, type: x.type, citation: x.citation, raison: x.verdict.raison })),
}
