export const meta = {
  name: 'analyse-gsc-complete',
  description: 'Analyse Search Console complète de maisonnumidia.store : 9 angles, contre-vérification de chaque constat, critique de complétude',
  phases: [
    { title: 'Analyse', detail: '9 analystes, un angle chacun, sur les extractions locales' },
    { title: 'Vérification', detail: 'un contre-expert par analyse recalcule chaque chiffre' },
    { title: 'Complétude', detail: 'ce qui manque, puis analyses complémentaires vérifiées' },
  ],
}

const DIR = 'C:/Users/superindep/maisonnumidia/scripts/_gsc/brut/analyse'

const CONSTATS = {
  type: 'object',
  properties: {
    fichier: { type: 'string', description: 'chemin du rapport markdown écrit' },
    resume: { type: 'string', description: '5 à 10 phrases : ce que cette analyse établit' },
    constats: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          titre: { type: 'string' },
          constat: { type: 'string', description: 'ce que les données montrent, avec les chiffres, URL et requêtes' },
          base: { type: 'string', description: 'sur quelles données (fichier, période, complet ou échantillon)' },
          reproduction: { type: 'string', description: 'script ou commande qui redonne les chiffres' },
          action: { type: 'string', description: 'action précise sur des pages nommées, ou "aucune"' },
          gainClicsMois: { type: 'number', description: 'gain estimé en clics par mois, 0 si non chiffrable' },
          methodeGain: { type: 'string' },
          effort: { type: 'string', enum: ['faible', 'moyen', 'fort'] },
          confiance: { type: 'string', enum: ['haute', 'moyenne', 'basse'] },
        },
        required: ['id', 'titre', 'constat', 'base', 'action', 'gainClicsMois', 'effort', 'confiance'],
      },
    },
  },
  required: ['fichier', 'resume', 'constats'],
}

const VERDICTS = {
  type: 'object',
  properties: {
    fichier: { type: 'string' },
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          verdict: { type: 'string', enum: ['confirmé', 'corrigé', 'réfuté', 'invérifiable'] },
          explication: { type: 'string', description: 'ce que tu as recalculé et ce que tu trouves' },
          constatCorrige: { type: 'string', description: 'si corrigé : le constat juste, avec les bons chiffres' },
          gainClicsMoisCorrige: { type: 'number' },
          actionCorrigee: { type: 'string' },
        },
        required: ['id', 'verdict', 'explication'],
      },
    },
    oublis: { type: 'array', items: { type: 'string' }, description: 'ce que cette analyse aurait dû regarder et a manqué' },
  },
  required: ['fichier', 'verdicts'],
}

const MANQUES = {
  type: 'object',
  properties: {
    manques: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          cle: { type: 'string', description: 'identifiant court en minuscules sans espace' },
          titre: { type: 'string' },
          mission: { type: 'string', description: 'consigne complète pour un analyste : question, données à utiliser, livrable' },
        },
        required: ['cle', 'titre', 'mission'],
      },
    },
  },
  required: ['manques'],
}

const COMMUN = `Lis d'abord en entier \`${DIR}/CONTEXTE.md\` (données, pièges, chronologie, règles) puis \`${DIR}/_chiffres-cles.txt\`. Tout y est : ne ré-extrais rien de la Search Console.

Livrable : un rapport détaillé en markdown, écrit dans le fichier indiqué, avec des tableaux (URL, requêtes, chiffres), puis le résumé structuré demandé. Sois exhaustif dans le rapport (listes complètes en annexe si besoin) et sélectif dans les constats : chaque constat doit mener à une décision. Pour chaque constat, donne le script ou la commande qui redonne les chiffres. Estime le gain en clics par mois en expliquant la méthode (par exemple : impressions mensuelles × (CTR visé à la position visée − CTR actuel), corrigé de l'échantillonnage des requêtes), et reste prudent : mieux vaut un gain sous-estimé et défendable.`

const ANGLES = [
  {
    cle: '01-trajectoire',
    titre: 'Trajectoire, décomposition de la croissance, effets des événements',
    mission: `**Ta mission : où en est le trafic et d'où vient-il.**
- Courbe 16 mois (clics, impressions, CTR, position), par semaine et par mois, site entier et par type de page.
- Décompose la croissance B → A et D → C : part due aux pages qui existaient déjà (mêmes URL dans les deux périodes) et part due aux pages nouvelles. Utilise \`firstSeen\` de \`data/indexing-log.json\` pour dater les fiches par cohorte de mise en ligne (735 d'origine, vague de septembre, d'octobre, les 600 du 01/11) et mesure ce que chaque cohorte rapporte, et en combien de temps une fiche neuve commence à recevoir des impressions puis des clics.
- Effet de chaque événement daté de la chronologie, avec groupe témoin quand c'est possible : gabarit de titre du 14/09, pause Vercel du 16/10, +600 fiches du 01/11, passage sur Cloudflare vers le 13-15/11 (les impressions quotidiennes passent d'environ 6 300 à 8 500 à partir du 13/11 : est-ce la migration, l'indexation des 600 fiches, la saison, autre chose ? utilise \`pages-jours-60.json\` pour voir quelles pages portent la hausse).
- Le CTR du site baisse de 5,01 % (D) à 4,40 % (C) alors que la position s'améliore : explique-le (dilution par les fiches nouvelles ? baisse à pages constantes ? par type de page ? par tranche de position ?).
- Concentration : quelle part des clics font les 10, 50, 100 premières pages ; dépendance à l'accueil et aux requêtes de marque « maison numidia ».
- Projection réaliste à 3 et 6 mois au rythme actuel, et arithmétique d'un ×10 : de combien faudrait-il faire bouger impressions, position et CTR, et quels leviers en ont la taille.`,
  },
  {
    cle: '02-cannibalisation',
    titre: 'Cannibalisation',
    mission: `**Ta mission : toutes les cannibalisations, chiffrées.** Sur \`rp-A\` (et \`rp-C\` pour l'état récent) :
- Pour chaque requête servie par 2 URL ou plus, mesure le partage des impressions et des clics, les positions de chaque URL. Classe par type de conflit : fiche contre fiche (doublons ou déclinaisons du même parfum : cherche aussi dans \`data/products.json\` les fiches au nom quasi identique, par exemple \`chance-eau-tendre-chanel\` et \`chanel-chance-eau-tendre\`, et dis lesquelles se marchent dessus dans les données), fiche contre page marque (\`/marques/x\`), fiche contre page fille (\`/parfums-homme/x\`), page marque contre page fille (les deux ciblent « parfum {marque} »), accueil contre catégories, blog contre fiche, www contre domaine nu.
- Distingue la cannibalisation qui coûte (deux URL qui alternent autour de la position 8-15, aucune ne perce ; la mauvaise page classée devant la bonne) de la cohabitation saine (deux URL en 1 et 2).
- Pour le conflit structurel page marque / page fille : sur les requêtes de type « parfum {marque} », « {marque} algérie », « {marque} prix », quelle page Google choisit-il, et laquelle devrait porter l'intention ? Lis \`app/marques/[slug]/page.tsx\` et les pages filles pour comparer titres, h1 et contenu. Recommande une règle claire (qui cible quoi, canonical, maillage, titres) et liste les marques concernées par ordre d'enjeu.
- Dresse la liste complète des couples de fiches à fusionner (avec 301) ou à différencier, avec l'enjeu de chacun.`,
  },
  {
    cle: '03-a-portee',
    titre: 'Requêtes et pages à portée de main, écarts de CTR',
    mission: `**Ta mission : les gains rapides.**
- Construis la courbe de CTR réelle du site par position (arrondie), séparément mobile non disponible donc globale, sur \`rp-A\` et sur \`pages-A\`, pour les fiches produit et pour les autres types. C'est ta référence.
- Requêtes en position 4 à 20 avec du volume : liste complète triée par gain potentiel (impressions × (CTR de la position 1-3 − CTR actuel)), avec la page qui répond, son titre réel et son h1 (catalogue + \`lib/seo.ts\`), et ce qui manque pour monter (terme absent du titre/h1, mauvaise page, contenu, maillage : vérifie le nombre de liens internes entrants n'est pas mesurable ici, mais regarde si la fiche est \`featured\`, citée dans des \`related\`, etc.).
- Même travail au niveau page (données complètes \`pages-A\`) : pages avec beaucoup d'impressions et une position moyenne entre 4 et 15.
- Écarts de CTR : requêtes et pages bien placées (position ≤ 5) dont le CTR est très en dessous de la courbe. Cherche pourquoi (titre, prix affiché plus cher que les concurrents, requête d'information, résultat local, etc.).
- Requêtes en position 1-3 qu'il faut défendre (les plus gros volumes).
- Regroupe par type d'action : réécrire un titre/h1, renforcer le maillage vers telle page, enrichir tel contenu. Donne les 50 premières cibles nommément.`,
  },
  {
    cle: '04-intentions',
    titre: 'Intentions de recherche, vocabulaire, gabarits',
    mission: `**Ta mission : ce que les gens tapent vraiment, et si les gabarits du site y répondent.**
- Analyse du vocabulaire sur \`requetes-A\` : modificateurs (prix, original, algérie, dz, pas cher, promo, avis, homme, femme, ml, 100ml, coffret, testeur, tester, dupe, clone, ressemble, meilleur, top, livraison, ouedkniss, jumia, noms de villes…), en impressions, clics, CTR et position moyenne pour chacun. Requêtes en arabe et en darija translittérée : volume, position, pages servies. Fautes d'orthographe fréquentes des marques.
- Classe les requêtes par intention : parfum précis, marque seule, catégorie générique (« parfum homme », « parfum femme algérie », « meilleur parfum homme », « parfum oriental »…), information (« c'est quoi », « différence », « comment reconnaître »), navigation (maison numidia), prix, comparaison. Poids de chaque classe, et performance.
- Les requêtes génériques à fort volume : où est le site, quelle page répond, pourquoi les 3 pages mères ne pèsent presque rien (241 clics en 90 jours). Lis \`app/parfums-homme/page.tsx\` et \`lib/seo.ts\` : titres, h1, contenu. Dis ce qu'il faudrait pour qu'elles montent.
- Le gabarit de titre « {Marque} {Nom} Prix Algérie Original » colle-t-il aux requêtes ? Quelles variantes fréquentes ne sont couvertes ni par le titre ni par le h1 ni par le contenu (par exemple « 100ml », « homme », « eau de parfum », « original », « prix dz ») ? Teste : les fiches dont la requête principale contient un terme absent du titre sont-elles moins bien placées ?
- Requêtes où Google sert un type de page inadapté à l'intention.
- Nouveaux gabarits de pages qui capteraient une demande visible : pages « prix », pages par note olfactive, par budget (« parfum homme moins de 10000 da »), comparatifs, « parfums qui ressemblent à », pages par occasion, etc. Pour chacun : la demande mesurée dans les données, pas une intuition.`,
  },
  {
    cle: '05-demande-non-servie',
    titre: 'Demande non servie : parfums, marques et sujets absents',
    mission: `**Ta mission : ce que les gens cherchent et que le site n'a pas.**
- Rapproche chaque requête de \`requetes-A\` du catalogue (\`data/products.json\` : marque + nom, avec \`normaliser\`). Isole les requêtes qui nomment un parfum ou une marque que le site ne vend pas (la page qui s'affiche est alors une fiche voisine, la page marque, ou l'accueil). Liste complète triée par impressions : parfum demandé, impressions, position, page servie aujourd'hui.
- Confronte cette liste aux parfums en attente d'ajout : \`scripts/_catalog-add/a-rechercher-restant.json\` (candidats) et \`scripts/_catalog-add/fiches.json\` (fiches montées, pas encore publiées) : lesquels sont déjà dans le tuyau, lesquels manquent complètement. Donne un ordre de priorité d'ajout fondé sur la demande.
- Marques demandées et absentes ou sous-représentées (peu de fiches pour beaucoup de demande).
- Déclinaisons demandées (elixir, intense, parfum, le parfum, formats 50/100/200 ml, coffrets) quand seule la version de base existe.
- Parfums en rupture (\`inStock: false\`) qui reçoivent encore de la demande : combien d'impressions et de clics, et que voit le visiteur ?
- Sujets d'articles : requêtes d'information visibles (comparaisons, « meilleur parfum… », « comment savoir si… original », durée, notes) qu'aucun des 14 articles (\`data/blog.ts\`) ne traite. Pour chaque sujet proposé : les requêtes exactes et leurs impressions.`,
  },
  {
    cle: '06-pages-mortes-indexation',
    titre: 'Pages sans trafic, indexation, poids mort',
    mission: `**Ta mission : ce qui ne travaille pas.**
- Sur les 2 329 fiches, les pages marque, les pages filles, les articles : combien ont zéro impression sur A, sur C ? Par cohorte de mise en ligne (\`firstSeen\`), par marque, par gamme de prix, par catégorie. Une fiche en ligne depuis plus de 30 jours sans impression est-elle indexée (\`indexStatus\`) ?
- État d'indexation d'après \`data/indexing-log.json\` : répartition des statuts, quelles URL sont « Discovered / Crawled - currently not indexed », « URL is unknown to Google », « Not found (404) » (liste complète : ces 404 sont-elles encore au sitemap ? ont-elles une redirection dans \`next.config.ts\` ?). Combien d'URL du sitemap n'ont jamais été inspectées. Le robot soumet-il bien (derniers \`runs\`) ?
- Les 600 fiches du 01/11 : combien ont déjà des impressions, à quelle vitesse, par rapport aux vagues précédentes au même âge.
- Fiches avec impressions mais position > 20 : que leur manque-t-il ? (parfum très concurrentiel, fiche pauvre, peu de liens)
- URL en www ou anciennes URL encore affichées par Google : lesquelles, avec quel trafic, la redirection fonctionne-t-elle (teste avec \`curl -sI\`) ?
- Pages « autre » qui reçoivent du trafic (/commander, /panier, /livraison, /plan-du-site, etc.) : faut-il les sortir de l'index ?
- Y a-t-il un signal de qualité inquiétant (beaucoup de pages à zéro) ou est-ce normal pour un catalogue de cet âge ? Tranche avec des chiffres.`,
  },
  {
    cle: '07-concurrence',
    titre: 'Concurrence dans les résultats Google en Algérie',
    mission: `**Ta mission : qui prend les clics que le site n'a pas, et sur quels mots.**
Outils : les connecteurs SEO de la session, à charger avec ToolSearch — Semrush (\`organic_research\`, \`keyword_research\`, \`competitors_research\`, \`domain_overview\`, \`get_report_schema\`, \`execute_report\`) et DataForSEO (\`mcp__dataforseo__api_request\`, \`docs_search\`). Commence par vérifier quelle base de données couvre l'Algérie (Semrush : base \`dz\` si elle existe ; DataForSEO : SERP Google avec location Algeria, langue fr). **Budget : au plus 60 appels Semrush et 120 appels DataForSEO au total**, en privilégiant les rapports par domaine plutôt que mot par mot. Si un connecteur est indisponible ou demande une authentification, note-le et continue avec l'autre ; si aucun ne répond, rends ce que les données locales permettent et dis clairement ce qui n'a pas pu être fait. N'utilise pas WebSearch.
- Concurrents connus (boutiques de parfums en Algérie) : briki-parfums.com, galleryparfums-dz.com, mustbeauty.dz, tendanceparfumsdz.com, aromaticadz.com, parfum-algerie.com, parfumalgerie.shop, leena-dz.com, leilaparfums-dz.com, odorem-dz.com, palaisdesparfums-dz.com, parfumdeluxedz.com, dionbyhiba.com, plus ceux que les SERP révèlent (marketplaces type Jumia, Ouedkniss, pages Facebook/Instagram, Fragrantica, Notino, Sephora…).
- Pour chacun : trafic organique estimé en Algérie, nombre de mots-clés classés, mots-clés principaux. Où se situe maisonnumidia.store dans ce paysage ?
- Écart de mots-clés : mots sur lesquels au moins un concurrent est dans le top 10 et pas le site. Regroupe par type (parfum précis, marque, générique, information) avec les volumes.
- Volumes de recherche en Algérie des têtes de marché (« parfum homme », « parfum femme », « parfum original algérie », « parfum pas cher », marques phares, 30 à 50 parfums les plus demandés) : c'est ce qui borne le marché. Quelle part en capte le site d'après la Search Console (\`requetes-A\`) ?
- Sur 30 à 40 requêtes stratégiques tirées de \`rp-A\` (gros volume, position entre 4 et 15), regarde la vraie page de résultats : qui est devant, avec quel type de page (fiche, catégorie, marketplace), quels éléments enrichis (prix, avis, images, pack local, PAA). Que font-ils que le site ne fait pas ?
- Conclusion chiffrée : taille du marché de recherche accessible, part actuelle, et où sont les plus grosses poches à prendre.`,
  },
  {
    cle: '08-technique',
    titre: 'Audit technique en production après le passage sur Cloudflare',
    mission: `**Ta mission : vérifier que rien de technique ne freine Google depuis la migration Vercel → Cloudflare Workers (OpenNext, vers le 13-15/11/2026).** Tout se teste avec \`curl\` sur https://maisonnumidia.store (reste poli : pas plus de 3 requêtes par seconde, quelques centaines au total), et en lisant le code (\`next.config.ts\`, \`wrangler.jsonc\`, \`open-next.config.ts\`, \`public/_headers\`, \`app/sitemap.ts\`, \`app/robots.ts\`, \`lib/seo.ts\`).
- Codes HTTP : une URL inexistante (\`/parfums/nexiste-pas\`, \`/marques/nexiste-pas\`, \`/parfums-homme/nexiste-pas\`) rend-elle un vrai 404 ou un 200 (soft 404) ? Les redirections de \`next.config.ts\` répondent-elles toutes en 308 vers une cible en 200 (teste-les toutes) ? www → domaine nu, http → https, barre finale, majuscules, paramètres ?
- Sitemap : \`/sitemap.xml\` répond-il, combien d'URL, les \`lastmod\`, y a-t-il des URL en 404 ou redirigées (échantillon de 150 URL réparties sur tous les types + toutes les URL non-produit) ? Cohérence avec le catalogue (2 329 fiches). \`robots.txt\` correct ?
- Balises sur un échantillon de chaque type de page (10 fiches dont des récentes, 3 mères, 6 filles, 6 marques, accueil, blog, /livraison) : \`<title>\`, meta description, canonical (domaine nu, absolue, auto-référente), meta robots, hreflang éventuel, h1 unique, Open Graph, données structurées JSON-LD (Product avec offre, prix, disponibilité, \`shippingDetails\`, \`hasMerchantReturnPolicy\`, BreadcrumbList, FAQPage, Organization/LocalBusiness) : valides, complètes, cohérentes avec le contenu visible ? Qu'est-ce qui manque pour les extraits enrichis marchands (la Search Console montre 261 753 impressions en « PRODUCT_SNIPPETS » et seulement 25 en « MERCHANT_LISTINGS ») ? Dis honnêtement ce que tu sais ou non de la disponibilité des fiches marchand / Merchant Center pour l'Algérie.
- En-têtes de cache et performance : \`cache-control\`, \`x-opennext-cache\`, compression, temps de réponse (TTFB) sur 30 URL de types variés, mesuré 2 fois (premier appel, appel en cache) ; poids du HTML d'une fiche et d'une page mère ; nombre et poids des JS ; images (format, poids, \`unoptimized\`), polices. Signale tout ce qui est lent ou lourd.
- Le HTML servi contient-il bien tout le contenu et tous les liens sans JavaScript (menus, annuaire des marques, produits liés) ? Y a-t-il encore du préchargement de liens (\`rel=prefetch\`, requêtes \`_rsc\`) ?
- Images produit : répondent-elles en 200 avec un cache long ? Pages d'erreur 5xx observées ?
- Différences de comportement possibles entre Vercel et Workers qui touchent le SEO (en-têtes, redirections, 404, ISR, \`Vary\`, taille limite du worker). Liste précise de ce qui est cassé, de ce qui est douteux et de ce qui est sain.`,
  },
  {
    cle: '09-prix-et-ctr',
    titre: 'Effet des prix affichés dans Google et des titres sur le CTR',
    mission: `**Ta mission : mesurer ce que le prix et le titre font au taux de clic.**
- Expérience naturelle du 18/10/2026 : les prix de 1 726 fiches ont monté (+20 % jusqu'à 15 000 DA, +10 % au-dessus), et Google affiche le prix dans l'extrait. Retrouve dans \`git log -- data/products.json\` le commit de cette hausse et l'état d'avant (\`git show <commit>~1:data/products.json\`). Pour chaque fiche présente avant et après : variation de prix, puis CTR à position comparable avant (par exemple 24/09 → 17/10) et après (22/10 → 18/11) à partir de \`pages-jours-60.json\` et des périodes C/D. Contrôle par la position (compare à tranche de position égale) et par un groupe témoin (fiches dont le prix n'a pas ou peu bougé, pages non-produit). Le CTR a-t-il baissé là où le prix a monté, et de combien de clics par mois cela pèse-t-il ? Sépare bien cet effet de la dilution par les fiches nouvelles et de la saison.
- Positionnement prix : avec \`scripts/_price-research/\` (regarde les fichiers de résultats de \`match-v3\` / \`rafraichissement\` s'ils existent : médiane concurrente par fiche), les fiches nettement plus chères que le marché ont-elles un CTR plus faible à position égale que celles au prix du marché ? Donne la courbe CTR en fonction de l'écart au marché.
- Gabarit de titre du 14/09 (« Prix Algérie Original ») : avant/après à position comparable sur les fiches qui existaient (script existant \`scripts/_gsc/avant-apres-titres.mjs\`, à relire d'un œil critique). L'effet a-t-il tenu ?
- CTR par longueur de titre (tronqué ou non), par présence du mot de la requête dans le titre, par marque, par gamme de prix, par genre.
- Lis \`lib/seo.ts\` : la meta description des fiches. Est-elle différenciante ? Propose 2 ou 3 variantes de titre et de description à tester, et un protocole de test propre (groupes de fiches comparables, durée, mesure) puisque le site a assez de pages pour faire de vrais tests A/B SEO.
- Conclusion : le prix affiché coûte-t-il des clics, combien, et que recommandes-tu (sans décider à la place du propriétaire : c'est son arbitrage marge contre volume, donne-lui les chiffres des deux côtés).`,
  },
]

function consigneAnalyse(a) {
  return `Tu es analyste SEO et data senior. Tu travailles sur les données Search Console de maisonnumidia.store.

${COMMUN}

**Reprise d'un travail interrompu.** Un premier analyste a travaillé environ 25 minutes sur cette même mission avant d'être coupé, sans avoir écrit son rapport. Tout ce qu'il a fait est conservé : ses notes, ses commandes et le début de chaque résultat dans \`${DIR}/reprise/${a.cle}.md\` (lis-le en entier AVANT toute chose), ses scripts dans \`${DIR}/scripts/\` (préfixe \`${a.cle}-\`) et ses fichiers de résultats intermédiaires dans \`${DIR}/\` (fichiers et dossiers dont le nom commence par \`_${a.cle.slice(0, 2)}\` ou \`${a.cle}\`). **Ne refais pas ce qui est déjà calculé** : relance ses scripts quand tu as besoin du résultat complet, vérifie d'un coup d'œil qu'ils sont justes, puis termine ce qui manque et rédige le rapport. Va droit au livrable.

${a.mission}

Écris ton rapport dans \`${DIR}/${a.cle}.md\` et tes scripts dans \`${DIR}/scripts/\` (préfixe \`${a.cle}-\`).`
}

function consigneVerif(a, r) {
  return `Tu es contre-expert SEO et data. Un analyste a rendu le rapport \`${DIR}/${a.cle}.md\` (« ${a.titre} ») sur les données Search Console de maisonnumidia.store. **Ton travail est de chercher ce qui est faux**, pas de le valider.

Lis d'abord \`${DIR}/CONTEXTE.md\` (données, pièges, règles : lecture seule, pas de WebSearch), puis le rapport.

Pour CHAQUE constat ci-dessous :
1. Recalcule toi-même les chiffres à partir des données brutes, avec ton propre script (dans \`${DIR}/scripts/\`, préfixe \`${a.cle}-verif-\`). Ne te contente pas de relancer le script de l'analyste : s'il a un défaut, tu le reproduirais. Lis quand même son script pour y chercher l'erreur.
2. Cherche les fautes classiques : position moyennée sans pondération, périodes A/B/C/D confondues, sommes sur l'échantillon de requêtes présentées comme des totaux, effet attribué à un événement sans groupe témoin, pages nouvelles mélangées aux anciennes, URL www comptées deux fois, gain estimé avec un CTR visé irréaliste, double compte entre constats, affirmation sur le code du site non vérifiée dans le code, recommandation contraire aux règles du CLAUDE.md du projet.
3. Vérifie que l'action recommandée découle bien du constat et qu'elle est faisable sur ce site.
4. Rends un verdict : « confirmé » (tes chiffres concordent à ±10 %), « corrigé » (le fond tient mais les chiffres ou l'action changent : donne les bons), « réfuté » (faux ou non démontré), « invérifiable » (dis pourquoi). Dans le doute, ne confirme pas.

Écris ton contre-rapport dans \`${DIR}/${a.cle}.verif.md\`, puis rends les verdicts. Signale aussi dans \`oublis\` ce que l'analyse aurait dû regarder et n'a pas regardé.

Constats à vérifier :
${JSON.stringify(r.constats, null, 1)}`
}

phase('Analyse')
const resultats = await pipeline(
  ANGLES,
  (a) => agent(consigneAnalyse(a), { label: `analyse ${a.cle}`, phase: 'Analyse', schema: CONSTATS }),
  (r, a) => {
    if (!r) return null
    return agent(consigneVerif(a, r), { label: `vérif ${a.cle}`, phase: 'Vérification', schema: VERDICTS })
      .then((v) => ({ cle: a.cle, titre: a.titre, analyse: r, verif: v }))
  },
)
const faits = resultats.filter(Boolean)
log(`${faits.length}/${ANGLES.length} analyses vérifiées`)

// Version économe : on s'arrête après la contre-vérification, sans tour de compléments.
if (args && args.sansComplements) return { analyses: faits, complements: [], manquesDemandes: [] }

phase('Complétude')
const critique = await agent(
  `Tu es directeur SEO. Neuf analyses de la Search Console de maisonnumidia.store viennent d'être rendues et contre-vérifiées. Lis \`${DIR}/CONTEXTE.md\`, puis tous les rapports \`${DIR}/0*.md\` et leurs contre-rapports \`${DIR}/0*.verif.md\`.

Le propriétaire veut « absolument tout » : où en est le trafic, ce qui est cannibalisé, les mots-clés concurrentiels où le site est bas, comment multiplier le trafic, et des recommandations à appliquer tout de suite.

Ta question : **qu'est-ce qui manque encore pour répondre complètement ?** Un angle non traité, un constat réfuté qui laisse une question ouverte, un oubli signalé par un contre-expert, une donnée disponible non exploitée (par exemple \`pages-jours-60.json\`, \`apparence-A\`, \`appareils-A\`, les fichiers Algérie seule, \`firstSeen\`, l'historique git), une contradiction entre deux rapports à trancher, un chiffrage de gain manquant sur une action importante. Ne propose que des analyses qui changeraient une décision. Au plus 4, chacune avec une consigne complète et autonome pour un analyste (question, données, livrable attendu). Si rien d'important ne manque, rends une liste vide.

Oublis signalés par les contre-experts :
${JSON.stringify(faits.map((f) => ({ analyse: f.cle, oublis: (f.verif && f.verif.oublis) || [] })), null, 1)}`,
  { label: 'critique de complétude', phase: 'Complétude', schema: MANQUES },
)

const manques = ((critique && critique.manques) || []).slice(0, 4)
log(`${manques.length} analyse(s) complémentaire(s) demandée(s)`)
const complements = await pipeline(
  manques,
  (m, _o, i) => {
    const a = { cle: `1${i}-${m.cle}`, titre: m.titre, mission: m.mission }
    return agent(
      `Tu es analyste SEO et data senior. Analyse complémentaire sur les données Search Console de maisonnumidia.store.

${COMMUN}

Les neuf premières analyses et leurs contre-vérifications sont dans \`${DIR}/0*.md\` et \`${DIR}/0*.verif.md\` : lis celles qui touchent ta question, ne refais pas ce qui est déjà établi.

**Ta mission : ${a.titre}**
${a.mission}

Écris ton rapport dans \`${DIR}/${a.cle}.md\` et tes scripts dans \`${DIR}/scripts/\` (préfixe \`${a.cle}-\`).`,
      { label: `complément ${a.cle}`, phase: 'Complétude', schema: CONSTATS },
    ).then((r) => (r ? { a, r } : null))
  },
  (x) => {
    if (!x) return null
    return agent(consigneVerif(x.a, x.r), { label: `vérif ${x.a.cle}`, phase: 'Complétude', schema: VERDICTS })
      .then((v) => ({ cle: x.a.cle, titre: x.a.titre, analyse: x.r, verif: v }))
  },
)

return { analyses: faits, complements: complements.filter(Boolean), manquesDemandes: manques.map((m) => m.titre) }
