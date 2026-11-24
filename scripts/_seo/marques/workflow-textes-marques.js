export const meta = {
  name: 'textes-marques',
  description: 'Texte propre (histoire sourcée, parfums les plus cherchés, comment choisir) pour les 30 pages marque les plus demandées, puis vérification des faits',
  phases: [
    { title: 'Rédaction', detail: 'un rédacteur par marque, sources lues' },
    { title: 'Vérification', detail: 'un vérificateur par marque, refait les contrôles et corrige' },
  ],
}

const D = 'scripts/_seo/marques'
const REGLES = `Contexte : maisonnumidia.store, parfumerie en ligne algérienne (boutique à Blida, parfums originaux, livraison Yalidine 69 wilayas, paiement à la livraison). Chaque page marque (/marques/<slug>) affiche la grille des parfums de la marque, puis un bloc de texte sous un titre h2 « Parfums <Marque> originaux en Algérie ». Ton texte remplace la partie « La maison <Marque> » de ce bloc (aujourd'hui deux phrases génériques), juste avant la liste de tous les parfums de la marque. Il doit apporter ce qu'aucune autre page du site n'a : il ne doit rien contenir qui puisse être recopié tel quel sur une autre marque.
Format : Markdown, 300 à 450 mots, titres "### " uniquement (jamais "## " ni "# "), paragraphes courts, **gras** avec parcimonie, liens internes [texte](/parfums/slug). Prix : jamais écrit en chiffres, mais le jeton {{prix:slug}} affiche le prix courant de la fiche (ex. "{{prix:dior-sauvage}}"), à utiliser au plus 3 fois.
Plan :
1. "### La maison <Marque>" : l'histoire en 3 ou 4 phrases (fondateur, année, ville, ce qui a fait sa réputation en parfumerie, son parfumeur maison s'il est connu). Uniquement des faits lus dans cette session sur une source fiable : fr.wikipedia.org/wiki/<Marque> (WebFetch direct, sans recherche), le site officiel de la marque, ou sa page Fragrantica (fragrantica.fr/designers/<Marque>.html). Au plus 2 recherches web (WebSearch) si l'URL directe ne marche pas.
2. "### Les parfums <Marque> les plus demandés en Algérie" : 4 à 6 parfums du dossier, choisis dans l'ordre du dossier (impressions Search Console et volume de recherche), en stock de préférence ; pour chacun, un lien vers sa fiche et une phrase précise tirée de SES notes et de sa famille dans le dossier (jamais de tenue en heures, de sillage, de "le plus vendu" sans source).
3. "### Comment choisir" (ou un titre plus précis) : aider à choisir entre les lignes ou versions que le catalogue contient vraiment (ex. EDT / EDP / Elixir d'une même ligne, homme / femme), en citant les fiches. S'il existe dans le dossier une page filtrée /parfums-homme/<slug> ou /parfums-femme/<slug> (champ "pages"), tu peux y renvoyer.
Interdits (CLAUDE.md) : formules d'IA ("Il est important de noter", "En conclusion", "N'hésitez pas", "plongez", "voyage olfactif", "véritable invitation"), tiret long "—", étoiles ou notes, "COD", promesses invérifiables, rien d'inventé sur les parfums (notes, concentration, contenance : celles du dossier). Ton naturel, celui d'un parfumeur de boutique qui connaît ses clients ; l'Algérie apparaît là où c'est utile, sans bourrage de mots-clés. Ne touche à AUCUN fichier en dehors de ${D}/textes/.`

const marques = args.marques
const resultats = await pipeline(
  marques,
  (slug) => agent(`${REGLES}

Marque : ${slug}. Dossier : ${D}/dossiers/${slug}.json (fiches avec notes, famille, genre, stock, impressions Search Console sur 90 jours et volume de recherche ; requêtes des pages marque).
Écris ${D}/textes/${slug}.json au format {"slug": "${slug}", "texte": "<markdown>", "sources": ["<url lue>", ...], "liens": ["<slug de fiche cité>", ...]}.
Puis lance \`node ${D}/valider.mjs ${slug}\` et corrige jusqu'à 0 erreur.
Ta réponse finale : une ligne "<slug> : <nombre de mots> mots, <n> fiches citées, validateur OK|KO".`, { label: `redaction:${slug}`, phase: 'Rédaction' }),
  (redac, slug) => agent(`${REGLES}

Tu es vérificateur, et sévère : le texte de la marque ${slug} vient d'être écrit dans ${D}/textes/${slug}.json par un autre agent. Le dossier de la marque est ${D}/dossiers/${slug}.json.
1. Chaque fait sur l'histoire de la maison : ouvre toi-même au moins une des sources listées (WebFetch) et vérifie année, fondateur, ville, parfumeur. Ce qui n'est pas confirmé est corrigé ou supprimé.
2. Chaque phrase sur un parfum : confronte-la aux notes, à la famille, à la concentration et au genre de la fiche dans le dossier. Rien d'exagéré ni d'inventé.
3. Le style : aucune formule d'IA, pas de phrase qui pourrait servir telle quelle pour une autre marque, pas de bourrage de "Algérie". Le texte doit donner envie d'acheter sans mentir.
4. Les liens : chaque lien mène à la bonne fiche (le texte du lien correspond au parfum).
Corrige directement le fichier, relance \`node ${D}/valider.mjs ${slug}\` jusqu'à 0 erreur.
Ta réponse finale : "<slug> : <n> corrections" puis la liste courte des corrections (fait faux, phrase supprimée…), ou "aucune correction".`, { label: `verification:${slug}`, phase: 'Vérification' }),
)
return resultats