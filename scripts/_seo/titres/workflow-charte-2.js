export const meta = {
  name: 'charte-titres-2',
  description: 'Recherche (grandes enseignes, données GSC, règles Google) puis 3 chartes de titres concurrentes, jugées à l\'aveugle, fusionnées en une charte finale',
  phases: [
    { title: 'Recherche', detail: 'titres des grandes enseignes, preuves GSC, règles Google' },
    { title: 'Propositions', detail: '3 chartes concurrentes testées sur le même échantillon' },
    { title: 'Jugement', detail: '3 juges à l\'aveugle' },
    { title: 'Synthèse', detail: 'charte finale + titres de l\'échantillon' },
  ],
}

const ECH = args.echantillon
const DIR = 'scripts/_seo/titres'
const CONTEXTE = `Contexte : maisonnumidia.store, boutique de parfums originaux en Algérie (boutique physique à Blida, livraison Yalidine 69 wilayas, paiement à la livraison). ~300 clics/jour depuis Google, 94 % Algérie, 90 % mobile. Le site a 2 328 fiches produit (/parfums/slug), 150 pages marque (/marques/slug), 246 pages marque filtrées par section (/parfums-femme/slug, /parfums-homme/slug, /parfums-orientaux/slug), 3 catégories, l'accueil, 16 articles de blog.
Titre actuel des fiches : "{Marque} {Nom} Prix Algérie Original | Maison Numidia" (gabarit Next "%s | Maison Numidia"). Le propriétaire trouve ces titres pas pros : chaque mot a une majuscule ("Prix Algérie Original"). Il veut de beaux titres, comme les grandes enseignes, optimisés SEO et CTR, choisis page par page à partir des données (pas une règle unique appliquée mécaniquement). Objectif : x10 de trafic en 3 mois.
Données (dans le dépôt, lecture seule) : dossiers par page dans ${DIR}/dossiers/lot-*.json et ${DIR}/dossiers/speciaux.json (requêtes Search Console 90 jours avec impressions/clics/position, volumes DataForSEO Google Algérie, versions voisines, requêtes partagées avec une autre page). Analyse GSC : scripts/_gsc/ANALYSE.md, scripts/_gsc/lib-analyse.mjs, données brutes scripts/_gsc/brut/*.json (pages-A, rp-A = requête×page, jours-produit = courbe quotidienne). Plan SEO : scripts/_seo/PLAN.md. La section "Titres meta" et "H1" de CLAUDE.md donne les formes de marque mesurées (Armani, Yves Saint Laurent, Rabanne).
Interdits (CLAUDE.md) : jamais "COD", pas d'étoiles ni de notes, pas de "Promo", pas de double "| Maison Numidia", année 2026 (pas 2025), ne rien inventer (concentration, volume, notes viennent du catalogue). Ne modifie AUCUN fichier hors ${DIR}/.`

phase('Recherche')
const rEns = (await agent(`${CONTEXTE}

Ta mission : relever les VRAIS titres des grandes enseignes de parfum et des concurrents algériens, pour en tirer leurs conventions. Rien de mémoire : chaque titre cité doit venir d'un résultat ou d'une page lus dans cette session.
INTERDIT : tout outil de navigateur (mcp__Claude_Browser__*, mcp__claude-in-chrome__*). Utilise seulement WebSearch (chaque résultat donne le titre de la page) et, si utile, curl dans Bash avec un délai court : curl -sL --max-time 15 -A "Mozilla/5.0" URL | grep -o "<title>[^<]*". Si un site bloque, passe au suivant. Au maximum 18 recherches web ; termine en moins de 15 minutes.
Déjà relevé (${DIR}/recherche/google.md, section 4) : Sephora, Notino, Marionnaud et Briki pour Dior Sauvage. Complète avec : mustbeauty.dz, galleryparfums-dz.com, odorem-dz.com, briki-parfums.com (fiche, page marque, catégorie homme ou femme), Nocibé et Sephora (page marque Dior, catégorie parfum femme), un parfum oriental (Lattafa Khamrah ou Yara) chez au moins 3 sites.
Écris ton relevé dans ${DIR}/recherche/enseignes.md : tableau site | type | URL | titre exact | longueur, puis l'analyse (casse, ordre des éléments, séparateurs, suffixe, mots commerciaux, longueur) et ce qu'un site algérien jeune devrait copier ou non.
Ta réponse finale : l'analyse, 35 lignes maximum.`, { label: 'recherche:enseignes-2', phase: 'Recherche' })) || `(voir ${DIR}/recherche/enseignes.md)`
const rDon = `Analyse terminée, à lire en entier : ${DIR}/recherche/donnees.md (mots tapés par type de page, ordre marque/nom par maison, CTR par position, effet des changements du 14/09 et du 18/10, requêtes servies par la mauvaise fiche, requêtes arabes). Chiffres clés : « prix » dans 33 % des impressions des fiches (48 % des clics) et 39 % des pages filles (69 % des clics) ; « Algérie » 22 % des fiches (44 % des clics) ; « original » 0,9 % sur les fiches mais 22 % sur l'accueil et 15 % sur les catégories ; « parfum » 34 % des fiches, 48 % des marques, 74 % des filles ; 36 % des impressions de fiches sont le nom seul sans la marque, l'ordre dépend de la maison ; une déclinaison prend la requête de la version de base dans 88 % des cas de mauvaise page.`
const rGoo = `Analyse terminée, à lire en entier : ${DIR}/recherche/google.md, surtout sa section 6 « Règles applicables » (50-60 caractères, rien au-delà de 70 ; casse française ; « prix » là où il est tapé, jamais le montant ; ni crochets ni « | », tiret demi-cadratin ou deux-points ; suffixe seulement s'il reste de la place ; pas d'année périmée ; titre proche du h1 ; la déclinaison visible dans le titre).`
log('Recherche terminée')

const SYNTHESE_RECHERCHE = `Résultats de la recherche (détails dans ${DIR}/recherche/enseignes.md, donnees.md, google.md) :
=== Grandes enseignes et concurrents ===
${rEns}
=== Nos données ===
${rDon}
=== Google ===
${rGoo}`

const ECHANTILLON = `Échantillon commun (${ECH.length} pages ; leur dossier est dans ${DIR}/dossiers/lot-*.json ou speciaux.json, cherche par le champ "chemin" — un grep suffit) :
${ECH.join('\n')}`

const LENTILLES = [
  { id: 'clic', titre: 'le clic d\'abord', angle: 'Ta priorité : le taux de clic sur un écran de téléphone en Algérie. Ce qui fait cliquer un acheteur algérien qui compare les prix et a peur des contrefaçons, sans tromper (pas de promesse fausse). Tu peux proposer des éléments de confiance ou d\'incitation dans le titre, s\'ils sont vrais.' },
  { id: 'pertinence', titre: 'la requête d\'abord', angle: 'Ta priorité : que chaque titre corresponde exactement à ce que les gens tapent pour CETTE page (ordre des mots, forme du nom, mots "prix", "parfum", concentration), et que deux pages ne se disputent jamais la même requête (la version de base garde le nom nu, la variante met son mot distinctif en tête).' },
  { id: 'enseigne', titre: 'l\'allure d\'une grande enseigne', angle: 'Ta priorité : des titres qui ont l\'air d\'une grande parfumerie (Sephora, Nocibé, Dior.com) : typographie française correcte, sobriété, cohérence d\'un bout à l\'autre du site, confiance. Sans perdre les mots que les gens tapent.' },
]

phase('Propositions')
const PROP_SCHEMA = {
  type: 'object',
  properties: {
    regles: { type: 'string', description: 'La charte : règles par type de page, casse, ordre, séparateurs, suffixe, longueur, cas particuliers (variantes, marque=nom, rupture, noms longs, arabe). Markdown, 60 lignes max.' },
    titres: { type: 'array', items: { type: 'object', properties: { chemin: { type: 'string' }, titre: { type: 'string', description: 'Titre COMPLET tel qu\'il apparaîtra dans la balise <title>, suffixe compris s\'il y en a un' }, pourquoi: { type: 'string' } }, required: ['chemin', 'titre', 'pourquoi'] } },
  },
  required: ['regles', 'titres'],
}
const propositions = await parallel(LENTILLES.map(L => () => agent(`${CONTEXTE}

${SYNTHESE_RECHERCHE}

Tu conçois une charte de titres pour tout le site, avec cette priorité : ${L.titre}. ${L.angle}
Contraintes communes : français correct (casse de phrase : majuscule au premier mot et aux noms propres, pas de majuscule à chaque mot) ; noms de parfums et de marques écrits comme officiellement ; rien d'inventé (lis le dossier de chaque page : concentration, volume, genre, rupture) ; lisible en entier sur mobile ; pas d'emoji ; la variante d'un parfum ne doit pas voler la requête de sa version de base. Le h1 ne change pas.
${ECHANTILLON}

Lis le dossier de CHAQUE page de l'échantillon (requêtes réelles, volumes, variantes, requêtes partagées) et écris son titre en appliquant ta charte — titre complet, suffixe compris. Pour chaque titre, une phrase "pourquoi" qui cite la donnée qui l'a décidé. Tous les chemins de l'échantillon doivent avoir un titre.`, { label: `proposition:${L.id}`, phase: 'Propositions', schema: PROP_SCHEMA })))

const props = propositions.map((p, i) => p ? { id: LENTILLES[i].id, ...p } : null).filter(Boolean)
log(`${props.length} chartes proposées`)

phase('Jugement')
const lettres = ['A', 'B', 'C']
const JUGE_SCHEMA = {
  type: 'object',
  properties: {
    notes: { type: 'array', items: { type: 'object', properties: { lettre: { type: 'string' }, requete: { type: 'number' }, clic: { type: 'number' }, allure: { type: 'number' }, exactitude: { type: 'number' }, cannibalisation: { type: 'number' }, total: { type: 'number' }, critique: { type: 'string' } }, required: ['lettre', 'requete', 'clic', 'allure', 'exactitude', 'cannibalisation', 'total', 'critique'] } },
    meilleurs: { type: 'array', description: 'Pour chaque page de l\'échantillon : le meilleur titre (pris tel quel chez A/B/C ou amélioré par toi)', items: { type: 'object', properties: { chemin: { type: 'string' }, titre: { type: 'string' }, source: { type: 'string' } }, required: ['chemin', 'titre', 'source'] } },
    reglesAGarder: { type: 'string' },
    erreurs: { type: 'string', description: 'Erreurs factuelles relevées (concentration, volume, genre, marque fausse) dans les titres, avec le chemin' },
  },
  required: ['notes', 'meilleurs', 'reglesAGarder', 'erreurs'],
}
const jugements = await parallel([0, 1, 2].map(j => () => {
  const ordre = props.map((_, i) => props[(i + j) % props.length])
  const texte = ordre.map((p, i) => `=== Charte ${lettres[i]} ===\n${p.regles}\n--- Titres ${lettres[i]} ---\n${p.titres.map(t => `${t.chemin} → ${t.titre}`).join('\n')}`).join('\n\n')
  return agent(`${CONTEXTE}

${SYNTHESE_RECHERCHE}

Tu es juge. Trois chartes de titres anonymes (A, B, C) ont été appliquées au même échantillon. Lis les dossiers des pages (${DIR}/dossiers/, champ "chemin") pour vérifier chaque titre contre les vraies requêtes et les faits du catalogue (concentration, volume, genre, rupture).
Note chaque charte sur 10 pour : requete (correspond à ce qui est tapé pour la page), clic (donne envie de cliquer à un acheteur algérien sur mobile), allure (typographie française correcte, sobre, cohérente, digne d'une grande enseigne), exactitude (aucun fait faux), cannibalisation (les variantes se distinguent de leur base). total = somme. Sois sévère et précis : cite les titres fautifs.
Puis, page par page, retiens le meilleur titre (tel quel, ou amélioré par toi si aucun ne convient — dis-le dans "source").

${texte}`, { label: `juge:${j + 1}`, phase: 'Jugement', schema: JUGE_SCHEMA }).then(r => r ? { ...r, ordre: ordre.map((p, i) => ({ lettre: lettres[i], id: p.id })) } : null)
}))
const juges = jugements.filter(Boolean)
const scores = {}
for (const jg of juges) for (const n of jg.notes) { const id = jg.ordre.find(o => o.lettre === n.lettre)?.id; if (id) (scores[id] = scores[id] || []).push(n.total) }
log('Scores : ' + Object.entries(scores).map(([k, v]) => `${k} ${v.join('/')}`).join(', '))

phase('Synthèse')
const resumeJuges = juges.map((jg, i) => `=== Juge ${i + 1} (correspondance : ${jg.ordre.map(o => o.lettre + '=' + o.id).join(', ')}) ===\nNotes : ${jg.notes.map(n => `${n.lettre}: ${n.total} (${n.critique})`).join(' | ')}\nRègles à garder : ${jg.reglesAGarder}\nErreurs : ${jg.erreurs}\nMeilleurs titres :\n${jg.meilleurs.map(m => `${m.chemin} → ${m.titre} [${m.source}]`).join('\n')}`).join('\n\n')
const final = await agent(`${CONTEXTE}

${SYNTHESE_RECHERCHE}

Trois chartes ont été proposées et jugées. Les voici, avec leur identifiant (clic, pertinence, enseigne) :
${props.map(p => `=== Charte "${p.id}" ===\n${p.regles}\n--- Titres ---\n${p.titres.map(t => `${t.chemin} → ${t.titre}`).join('\n')}`).join('\n\n')}

Jugements :
${resumeJuges}

Ta mission : écrire la charte FINALE, celle qui servira à rédiger les 2 750 titres du site, page par page. Prends la charte gagnante comme base et greffe les meilleures idées des autres ; tranche chaque désaccord en citant la donnée. La charte doit être applicable par des rédacteurs qui ne voient que le dossier d'une page, et vérifiable par un script : écris noir sur blanc la longueur maximale (en caractères), la politique de suffixe, la liste des mots qui gardent une majuscule, l'écriture des concentrations, les séparateurs autorisés, les mots interdits, le traitement de chaque cas (base/variante, marque = nom, rupture de stock, nom très long, page sans données, requêtes arabes, pages marque, pages filles, catégories, accueil, articles).
Écris :
1. ${DIR}/CHARTE-finale.md : la charte (titres de section clairs, exemples réels de l'échantillon, 150 lignes max).
2. ${DIR}/echantillon-charte.json : [{"chemin": ..., "titre": ...}] pour toutes les pages de l'échantillon, titres finaux conformes à la charte.
Ta réponse finale : la charte complète (le contenu de CHARTE-finale.md).`, { label: 'synthese:charte', phase: 'Synthèse' })

return { scores, charte: final }