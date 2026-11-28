# Rédaction d'un lot de titres

Lis d'abord `scripts/_seo/titres/consignes/commun.md`, puis la charte en entier.

Écris un titre pour CHAQUE page du lot, dans `scripts/_seo/titres/sorties/<lot>.json`, au format
`[{"chemin": "...", "titre": "...", "pourquoi": "<20 mots max : la mesure qui a décidé>"}]`, dans
l'ordre du dossier. Espaces normales (pas d'insécables).

**Sauvegarde au fil de l'eau** : réécris le fichier en entier (tableau JSON valide) **tous les 10
titres**, avec tous les titres écrits jusque-là, et pas seulement à la fin : une coupure ne doit
pas perdre plus de 10 titres. Si le fichier existe déjà au démarrage (reprise après une coupure),
garde ses titres et continue à partir de la première page du dossier qui n'y figure pas.

Méthode : lance `mesures.mjs`, puis pour chaque page applique la charte (§3 fiches, §4 marques,
§5 filles, §6 le reste). Lis les requêtes du dossier : le titre doit reprendre les mots que les gens
tapent pour CETTE page, dans leur ordre, sans voler la requête d'une sœur. Pour les fiches qui ont
des variantes, lance `par-marque.mjs` sur la marque pour voir les titres déjà écrits des sœurs.
Puis lance `valider.mjs` sur ton fichier et corrige jusqu'à 0 erreur (un avertissement « court »
est permis si la charte l'accepte, §3.5).

Ta réponse finale : une ligne « <lot> : N titres, validateur 0 erreur, M avertissements » suivie,
s'il y en a, des cas où la charte ne tranchait pas et de ce que tu as décidé (5 lignes au plus).
