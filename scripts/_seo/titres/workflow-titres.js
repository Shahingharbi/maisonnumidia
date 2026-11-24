export const meta = {
  name: 'titres-toutes-pages',
  description: 'Rédaction des titres des 2 748 pages selon CHARTE-finale.md (un rédacteur et un relecteur par lot de 40), puis contrôle de cohérence par marque',
  phases: [
    { title: 'Rédaction', detail: 'un rédacteur par lot, validateur à 0 erreur' },
    { title: 'Relecture', detail: 'un relecteur sévère par lot, corrige sur place' },
    { title: 'Cohérence', detail: 'base et déclinaisons de chaque marque, entre les lots' },
  ],
}

const D = 'scripts/_seo/titres'
const COMMUN = `Tu travailles pour maisonnumidia.store (parfumerie en ligne algérienne, parfums originaux, livraison Yalidine 69 wilayas, paiement à la livraison ; 90 % des visites sur mobile). On réécrit le <title> de chaque page du site, page par page, à partir des données de recherche de chaque page.
LA RÈGLE est ${D}/CHARTE-finale.md : lis-la EN ENTIER avant tout, et applique-la à la lettre (casse française, 60 caractères au plus, ordre de la tête selon les mesures, base et déclinaisons, ruptures, suffixe, mots interdits). Les 45 titres de référence de ${D}/echantillon-charte.json appliquent la charte : si une page de ton lot y figure, reprends son titre tel quel.
Outils :
- \`node ${D}/mesures.mjs <lot>\` calcule pour chaque page les mesures du §2 de la charte (base, parts de « parfum », genre, « original », contenance, ordre nom/marque, sœurs « Parfum », maison « nom d'abord »). Le « mot du nom testé » peut être mal choisi (ex. « comme » pour Comme une Évidence, alors que les gens tapent « evidence ») : dans ce cas, refais la mesure à la main sur les requêtes du dossier.
- Le dossier du lot : ${D}/dossiers/<lot>.json (requêtes Search Console avec impressions, volumes DataForSEO, variantes, requêtes partagées, rupture).
- \`node ${D}/valider.mjs ${D}/sorties/<lot>.json\` contrôle la longueur, la casse, les faits (concentration, contenance, genre), les mots interdits, le suffixe, la règle « parfum » des sœurs.
- \`node ${D}/par-marque.mjs <slug-de-marque>\` affiche les titres déjà écrits pour une marque (tous lots confondus) : utile pour ne pas donner à une déclinaison la même tête que sa base écrite dans un autre lot.
Ne modifie AUCUN fichier en dehors de ${D}/sorties/.`

const lots = args.lots
const resultats = await pipeline(
  lots,
  (lot) => agent(`${COMMUN}

Ton lot : ${lot} (${D}/dossiers/${lot}.json). Écris un titre pour CHAQUE page du lot, dans ${D}/sorties/${lot}.json, au format [{"chemin": "...", "titre": "...", "pourquoi": "<20 mots max : la mesure qui a décidé>"}], dans l'ordre du dossier. Espaces normales (pas d'insécables).
Méthode : lance mesures.mjs, puis pour chaque page applique la charte (§3 fiches, §4 marques, §5 filles, §6 le reste). Lis les requêtes du dossier : le titre doit reprendre les mots que les gens tapent pour CETTE page, dans leur ordre, sans voler la requête d'une sœur. Puis lance valider.mjs et corrige jusqu'à 0 erreur (un avertissement « court » est permis si la charte l'accepte, §3.5).
Ta réponse finale : une ligne « ${lot} : N titres, validateur 0 erreur, M avertissements » suivie, s'il y en a, des cas où la charte ne tranchait pas et de ce que tu as décidé.`, { label: `redaction:${lot}`, phase: 'Rédaction' }),
  (redac, lot) => agent(`${COMMUN}

Tu es relecteur, sévère et indépendant. Un rédacteur vient d'écrire ${D}/sorties/${lot}.json pour le lot ${lot}. Pour CHAQUE titre, vérifie contre la charte et contre le dossier de la page :
1. la tête suit les mesures (nom d'abord / marque d'abord, élision d'/de), la forme de marque est la bonne (Paco Rabanne ; Armani sur les fiches ; Yves Saint Laurent, jamais YSL), le nom est le nom officiel avec ses majuscules ;
2. base et déclinaisons : la base porte le nom nu, la déclinaison colle son mot distinctif au nom ; concentration ou genre présents quand la charte les rend obligatoires ; « parfum » seul absent quand une sœur s'appelle « … Parfum » ;
3. les mots tapés pour la page sont là (« parfum » si retenu, contenance si retenue), le complément est le bon (« prix en Algérie » / « prix du parfum en Algérie »), ruptures traitées selon §3.6 ;
4. le français est naturel et la casse correcte (aucune majuscule hors noms propres et premier mot) ;
5. pages marque, filles, catégories, articles : gabarit du §4-6, suffixe s'il tient.
Lance aussi \`node ${D}/par-marque.mjs\` sur les marques de tes fiches qui ont des variantes, pour vérifier qu'aucune tête n'en double une autre déjà écrite.
Corrige directement le fichier, puis relance valider.mjs jusqu'à 0 erreur.
Ta réponse finale : « ${lot} : K corrections » puis une ligne par correction (chemin : ancien → nouveau, raison courte), ou « aucune correction ».`, { label: `relecture:${lot}`, phase: 'Relecture' }),
)
log(`${resultats.filter(Boolean).length}/${lots.length} lots rédigés et relus`)

phase('Cohérence')
const CORR = {
  type: 'object',
  properties: {
    corrections: { type: 'array', items: { type: 'object', properties: { chemin: { type: 'string' }, ancien: { type: 'string' }, titre: { type: 'string' }, raison: { type: 'string' } }, required: ['chemin', 'ancien', 'titre', 'raison'] } },
    remarques: { type: 'string' },
  },
  required: ['corrections', 'remarques'],
}
const coherence = await parallel(args.marques.map((groupe, i) => () => agent(`${COMMUN}

Tous les lots sont rédigés et relus. Ta mission : la cohérence ENTRE les lots, marque par marque, pour ces marques : ${groupe.join(', ')}.
Pour chaque marque, lance \`node ${D}/par-marque.mjs ${groupe.join(' ')}\` (une seule fois suffit, puis relis marque par marque) et vérifie :
- base et déclinaisons d'une même ligne : la base a le nom nu, chaque déclinaison son mot distinctif collé au nom, deux fiches n'ont jamais la même tête (désignation + description), et l'ordre (nom d'abord ou marque d'abord) est cohérent dans une même ligne sauf si les mesures de la fiche disent clairement l'inverse ;
- même forme de marque partout sur les fiches de la marque ; page marque et pages filles conformes au §4-5 ;
- aucun titre faux (concentration, contenance, genre, rupture) ni maladroit.
Ne modifie AUCUN fichier : rends les corrections. Chaque correction doit passer le validateur (60 caractères, casse, faits) : vérifie-la en l'écrivant dans un fichier temporaire de ${D}/sorties/_tmp-coherence-${i}.json puis \`node ${D}/valider.mjs ${D}/sorties/_tmp-coherence-${i}.json\`, et supprime ce fichier à la fin.
Rends {corrections: [{chemin, ancien, titre, raison}], remarques}. Pas de correction de goût : seulement ce qui enfreint la charte ou crée une confusion entre deux fiches.`, { label: `coherence:${i + 1}`, phase: 'Cohérence', schema: CORR })))

const corrections = coherence.filter(Boolean).flatMap((c) => c.corrections)
log(`${corrections.length} corrections de cohérence proposées`)
return { lots: resultats.map((r) => (typeof r === 'string' ? r.split('\n')[0] : r)), corrections, remarques: coherence.filter(Boolean).map((c) => c.remarques) }