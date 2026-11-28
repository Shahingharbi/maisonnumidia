# Consignes communes aux rédacteurs, relecteurs et contrôleurs de titres

(Reprises de `workflow-titres.js`, pour lancer les agents un par un quand l'outil Workflow n'est
pas disponible. Le lot à traiter est donné dans la demande de l'agent.)

Tu travailles pour maisonnumidia.store (parfumerie en ligne algérienne, parfums originaux,
livraison Yalidine 69 wilayas, paiement à la livraison ; 90 % des visites sur mobile). On réécrit
le `<title>` de chaque page du site, page par page, à partir des données de recherche de chaque page.

**Dossier de travail** : `C:\Users\superindep\maisonnumidia\.claude\worktrees\agent-a50d7cc434375af84`.
Lance toutes les commandes depuis ce dossier (chemins relatifs ci-dessous). Ne touche à rien
ailleurs. **Aucune commande git.** Le PC est partagé avec un autre chantier : pas de build, pas de
serveur, rien d'autre que les scripts `node` ci-dessous et la lecture des fichiers.

**LA RÈGLE** est `scripts/_seo/titres/CHARTE-finale.md` : lis-la EN ENTIER avant tout, et
applique-la à la lettre (casse française, 60 caractères au plus, ordre de la tête selon les
mesures, base et déclinaisons, ruptures, suffixe, mots interdits). Les 45 titres de référence de
`scripts/_seo/titres/echantillon-charte.json` appliquent la charte : si une page de ton lot y
figure, reprends son titre tel quel.

Outils :
- `node scripts/_seo/titres/mesures.mjs <lot>` calcule pour chaque page les mesures du §2 de la
  charte (base, parts de « parfum », genre, « original », contenance, ordre nom/marque, sœurs
  « Parfum », maison « nom d'abord »). Le « mot du nom testé » peut être mal choisi (ex. « comme »
  pour Comme une Évidence, alors que les gens tapent « evidence ») : dans ce cas, refais la mesure
  à la main sur les requêtes du dossier.
- Le dossier du lot : `scripts/_seo/titres/dossiers/<lot>.json` (requêtes Search Console avec
  impressions, volumes DataForSEO, variantes, requêtes partagées, rupture). **Les faits du dossier
  (nom, concentration, contenance, genre, rupture, variantes) ont été remis à jour le 28/11/2026 sur
  le catalogue actuel** : ce sont eux qui font foi. N'invente jamais un fait (concentration,
  contenance, genre) qui n'y est pas.
- `node scripts/_seo/titres/valider.mjs scripts/_seo/titres/sorties/<lot>.json` contrôle la
  longueur, la casse, les faits, les mots interdits, le suffixe, la règle « parfum » des sœurs.
- `node scripts/_seo/titres/par-marque.mjs <slug-de-marque> [autres slugs]` affiche les titres déjà
  écrits pour une marque (tous lots confondus) : utile pour ne pas donner à une déclinaison la même
  tête que sa base écrite dans un autre lot. D'autres agents écrivent en même temps : si la commande
  échoue sur un JSON en cours d'écriture, relance-la quelques secondes plus tard.

Ne modifie AUCUN fichier en dehors de `scripts/_seo/titres/sorties/` (et, pour un contrôleur de
cohérence, seulement son fichier temporaire).

Points que les lots déjà rédigés ont dû trancher (à appliquer pareil) :
- Le validateur applique la règle « parfum » des sœurs (charte 3.4) dès qu'une variante du dossier
  finit par « Parfum » ou « Le Parfum », même si elle n'est pas la version « Parfum » de cette
  fiche (Cool Water Woman a pour variante Cool Water Parfum) : dans ce cas, ne pas écrire
  « parfum » seul (description `parfum …`, « prix du parfum ») ; « eau de parfum », « eau de
  toilette », « pour homme/femme » restent possibles.
- Un coffret (nom qui commence par « Coffret ») garde le mot « coffret » dans la tête.
- Fiches en rupture (`enStock: false`) : charte 3.6, ni prix ni « original ».
