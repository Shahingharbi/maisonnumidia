# Charte des titres de maisonnumidia.store (24/11/2026)

Base : la charte « la requête d'abord » (110,5 points sur trois juges, contre 110 pour « l'allure d'une grande enseigne » et 89,5 pour « le clic d'abord »). On y a greffé la séparation des déclinaisons et les pages marque de la charte « enseigne », et les arguments de clic de la charte « clic », limités à l'accueil, aux catégories et aux ruptures. Sources : `recherche/donnees.md` (nos requêtes), `recherche/enseignes.md` (84 titres relevés), `recherche/google.md` (règles et tests publiés). Les codes G1, G2, Z1, S1, Q1 à Q3 renvoient aux sources de `google.md`. Titres de l'échantillon : `echantillon-final.json`.

Chaque titre est écrit **en entier**, suffixe compris, dans `data/titres.json`. Il est rendu en `title.absolute` (`lib/titres.ts`) et ne passe plus par le gabarit « %s | Maison Numidia ». Le h1 ne change pas. Un titre ne contient que des faits du dossier : concentration, contenance, genre et rupture viennent du catalogue.

## 1. Règles communes (contrôlables par script)

**Longueur**, en caractères, espaces et suffixe compris :
- **plafond absolu : 65** ; cible : 60 ou moins ;
- fiches, pages marque, pages filles, articles : **60 au plus**. Elles peuvent aller de 61 à 65 dans deux cas seulement : un nom arabe ajouté en fin de titre (§2.8), ou un nom dont la forme la plus courte dépasse déjà 60 ;
- accueil et catégories : jusqu'à 65 si le surplus est un argument vrai et que la requête principale tient dans les 45 premiers caractères ;
- les mots tapés pour la page doivent tenir dans les **45 premiers caractères**. Au-delà de 60 caractères, 76 % des titres sont réécrits par Google ; au-delà de 70, 99,9 % (Z1).

**Suffixe** ` | Maison Numidia` (17 caractères) : on l'ajoute **si et seulement si le titre complet tient en 60 caractères**, donc si le corps fait 43 caractères au plus. Sinon, pas de suffixe : Google affiche déjà le nom du site au-dessus du lien (G2). Jamais deux fois « Maison Numidia ». L'accueil, qui ouvre sur le nom, n'a pas de suffixe.

**Séparateurs autorisés :**

| signe | emploi |
|---|---|
| ` : ` | **exactement un par titre** (aucun ou un sur un article). Il annonce l'intention (« prix en Algérie ») ou le contenu de la page. On le tape avec une espace normale ; à l'écriture dans `data/titres.json`, l'espace qui le précède devient une espace insécable (U+00A0, Q3). |
| `, ` | à l'intérieur d'un segment ; deux au plus par titre |
| ` – ` | tiret demi-cadratin U+2013 : seulement devant un nom arabe, en fin de titre |
| ` \| ` | seulement devant « Maison Numidia », en toute fin de titre |

Interdits : « — », le trait d'union employé comme séparateur (il reste permis dans un nom : A-List), `[ ] ( ) / · « » ! …`. Le « ? » n'est permis que sur un article. Si le nom officiel contient lui-même une ponctuation (« Opus XIII – Silver Oud », « L.12.12 Yellow (Jaune) »), on la retire : « Opus XIII Silver Oud », « L.12.12 Yellow ». Apostrophe droite `'`, comme dans le catalogue.

**Casse de phrase** (Q1, Q2 ; c'est aussi l'usage de Sephora, Notino et Nocibé). Gardent une majuscule, et eux seuls :
1. le premier mot du titre ;
2. les marques, dans leur graphie officielle, jamais en capitales intégrales (Dior et non DIOR). Seuls les sigles officiels restent en capitales : DKNY, BDK ;
3. les noms de parfums, mot pour mot comme dans le champ `name`, ou comme Fragrantica si le catalogue s'en écarte : Eau Tendre, Le Parfum, Pour Monsieur, Comme une Évidence, Stronger With You, 212 VIP, L.12.12, Acqua di Giò, Club de Nuit Woman ;
4. Algérie, Alger, Blida, Maison Numidia ;
5. sur les articles seulement, les sigles EDP et EDT.

Tout le reste s'écrit en minuscules, y compris le premier mot après « : » : prix, parfum(s), original, pour, homme, femme, mixte(s), oriental, orientaux, arabe, eau de parfum, eau de toilette, extrait de parfum, eau de cologne, rupture, versions, paiement à la livraison, parfumerie, meilleur, top, différence.

**Concentration** : toujours en toutes lettres et en minuscules, sauf quand elle fait partie du nom (Bleu de Chanel Parfum, Libre Le Parfum, Sauvage Elixir).

| catalogue (`conc`) | dans le titre |
|---|---|
| EDP / EDT / EDP Intense | eau de parfum / eau de toilette / eau de parfum intense |
| Extrait de Parfum / Cologne | extrait de parfum / eau de cologne |
| Parfum | presque toujours déjà dans le nom ; sinon on ne l'écrit que si elle seule départage deux fiches : « , parfum » |
| concentration écrite dans `name` (« Chance Eau Tendre Eau de Parfum », « Code EDP ») | retirée du nom, puis réécrite en minuscules après une virgule si elle départage : « Chanel Chance Eau Tendre, eau de parfum » |

On n'écrit jamais EDP ni EDT hors des articles, ni « 100ml » collé.

**Contenance** : sous la forme « 100 ml » (chiffres, une espace, « ml » en minuscules), collée au nom ou à la concentration, sans virgule. On l'écrit **seulement si** la contenance du catalogue figure dans la requête n°1 du dossier **et** si le titre reste à 60 caractères au plus. Bleu de Chanel Parfum 100 ml (344 impressions et 31 clics sur « bleu de chanel parfum 100ml prix algérie ») ; Dior Sauvage Elixir 60 ml. 1 Million n'a pas sa contenance : avec elle, le titre ferait 62 caractères.

**Mots et formes interdits** : COD ; promo, solde(s), remise, réduction, offre, Black Friday, gratuit(e), pas cher, moins cher, meilleur prix, prix bas ; tout montant (chiffres suivis de DA, DZD ou dinars) : le prix dans le titre a coûté 15 % de trafic (S1) ; étoiles, notes (4,8/5), « avis » sur une fiche ; emoji ; « 2025 », et toute année absente du h1 ; officiel, agréé, distributeur, revendeur (promesses que le site ne peut pas prouver) ; 100 %, authentique, garanti ; disponible et en stock (sur une rupture) ; livraison gratuite, livraison 24 h ; WhatsApp. Sur une fiche, ni YSL, ni Paco Rabanne, ni Giorgio Armani : on écrit Yves Saint Laurent, Rabanne et Armani, les formes mesurées dans CLAUDE.md.

## 2. Fiches produit

Forme : `{tête}[, {précision}] : prix en Algérie[ – {nom arabe}][ | Maison Numidia]`

**2.1 Tête.** On ne compte que les requêtes du dossier qui contiennent le mot distinctif du nom. A = impressions de celles qui ne tapent pas la marque (toutes graphies : ysl, yves saint laurent, armani…), B = impressions de celles qui la tapent.
- A > B : `{Nom} de {Marque}`, avec élision devant une voyelle, un Y ou un h muet (d'Armani, d'Evaflor, d'Yves Saint Laurent, d'Hermès). Exemples : Whisky Silver d'Evaflor, Yara de Lattafa, Club de Nuit Woman d'Armaf, 212 Men de Carolina Herrera, Khamrah de Lattafa (751 impressions sans la marque, contre 389 avec).
- A ≤ B : `{Marque} {Nom}`, car quand les deux sont tapés, la marque vient d'abord dans 66 % des cas. Exemples : Dior Sauvage, Chanel Chance, Kayali Eden Juicy Apple, Armani Code.
- Si les requêtes qui commencent par « parfum » font plus de la moitié des impressions qui nomment le parfum, « Parfum » ouvre le titre : Parfum Libre d'Yves Saint Laurent (483 impressions sur « parfum libre… »).
- Nom qui contient la marque (Bleu de Chanel, Eau de Lacoste, Miss Dior) : le nom seul. Nom qui n'est qu'une formule de genre (Pour Monsieur, Pour Homme, L'Homme) : la marque devant (Pierre Cardin Pour Monsieur). Marque longue que personne ne tape : elle sort si le titre dépasse 60 (Baccarat Rouge 540, sans Maison Francis Kurkdjian).
- Sans requêtes : on suit la maison (donnees.md §2). Nom d'abord pour Lattafa, Armaf, Carolina Herrera, Yves Saint Laurent, Armani, Rabanne, Evaflor, Escada, Victoria's Secret, Kilian, Ajmal, Rasasi, Yves Rocher. Marque d'abord pour Gucci, Tom Ford, Creed, Azzaro, Burberry, Versace, Prada, Lacoste, Chloé, Nishane, Amouage. Pour une maison qui n'est pas listée : `{Marque} {Nom}`.

**2.2 Nom.** On part de `name`, en suivant Fragrantica quand il diverge (Woman et non Women ; Acqua di Giò avec l'accent).
- On retire les numéros jamais tapés (« Eden Juicy Apple 01 » devient « Eden Juicy Apple »), mais on garde ceux qui le sont : Vanilla 28, 212, Baccarat Rouge 540.
- « Women », « Men » ou « For Her » s'effacent derrière le genre de la précision (212 VIP, et non 212 VIP Women), sauf s'ils séparent deux sœurs de genres différents (212 Men face à 212 VIP Men).
- **Nom long** (plus de 30 caractères) : on garde la ligne, la teinte et le mot qui distingue la fiche de ses sœurs. On retire Edition, Pour Homme, Pour Femme, For Him, la collaboration « x … » et les qualificatifs secondaires. Exemple : « Eau de Lacoste L.12.12 Blanc Pure Collector Edition Pour Homme x Jeremyville » devient Eau de Lacoste L.12.12 Blanc Collector (« Collector » la sépare de la fiche L.12.12 Blanc).

**2.3 Précision** : une seule, facultative, placée après une virgule. Dans l'ordre de priorité :
1. **La concentration**, dans deux cas. (a) Deux fiches dont les noms sont identiques une fois la mention de concentration retirée : chacune écrit la sienne (Chance Eau Tendre, eau de parfum / eau de toilette). Si le catalogue leur donne la même concentration, la base écrit « pour {genre} », collé au nom sans virgule : Armani Code pour homme, face à Code EDP. (b) Une base dont une sœur s'appelle exactement « {Nom} Parfum » : la base écrit sa concentration (1 Million de Rabanne, eau de toilette, face à 1 Million Parfum ; Dior Sauvage, eau de parfum, face à Sauvage Parfum). « {Nom} Le Parfum » ne déclenche pas cette règle (Libre face à Libre Le Parfum).
2. **« parfum {homme|femme|mixte} »**, si « parfum », « perfume » ou « عطر » figure dans au moins 20 % des impressions listées : Whisky Silver d'Evaflor, parfum homme. Le genre vient du champ `genre` ; « unisexe » s'écrit « mixte ». Pas de cette précision dans le cas (b), ni quand « Parfum » ouvre déjà le titre.
3. Sinon, rien.

**2.4 Accroche** : « prix en Algérie » sur toute fiche en stock, avec ou sans données. Elle porte 48 % des clics des fiches (« prix ») et 44 % (« Algérie »). Les requêtes « prix + lieu » cliquent à 8,8 % en position 1 à 3, contre 2,7 % sans ces mots. Jamais le montant.

**2.5 « original »** : seulement si une requête qui le contient est parmi les 3 premières du dossier, ou si ces requêtes font au moins 10 % des impressions listées (le mot ne pèse que 0,9 % des impressions des fiches). Il s'écrit dans la précision, collé à « parfum » ou au genre : « , parfum original », « , parfum mixte original ». Jamais après une marque, une contenance ou une concentration. Exemples : Khamrah de Lattafa, parfum mixte original (2e requête « parfum khamrah original prix ») ; Baccarat Rouge 540, parfum mixte original. Pas d'« original » pour Yara : 5 % des impressions, 8e requête.

**2.6 Base et déclinaisons** (`variantes`) : une déclinaison prend la requête de la base dans 88 % des cas de mauvaise page.
- La base garde le nom de la ligne, nu : Chanel Chance, Kayali Vanilla 28.
- La déclinaison colle son mot distinctif au nom de la ligne : Khamrah Qahwa, Sauvage Elixir, Le Male Elixir, Chance Eau Tendre, Acqua di Giò Profumo.
- On n'ajoute jamais à un titre un mot qui appartient à une sœur (`variantes`) ou une requête que `partagees` attribue mieux à une autre page.
- **Requête de marque pure** : quand les requêtes qui tapent la marque sans le nom du parfum (« parfum kayali prix algérie ») font au moins 20 % des impressions listées, la fiche n'écrit pas « parfum » et la page marque reprend cette requête (Kayali Eden Juicy Apple : prix en Algérie | Maison Numidia). Cette règle ne s'applique pas quand la marque et le nom sont identiques.

**2.7 Cas particuliers.**
- **Marque = nom** (Franck Olivier, Jimmy Choo, Chloé) : la marque est écrite une fois, et le produit se nomme par sa concentration et son genre : Franck Olivier, eau de parfum pour femme : prix en Algérie. Ce titre ne doit jamais reprendre celui de la page fille.
- **Rupture** (`enStock: false`) : le titre la dit, sans « prix », sans « Algérie » (ces parfums sont arrêtés) et sans « disponible ». Si la fiche a des `variantes` (la page affiche « Quelle version de … choisir ? ») : `{tête} en rupture : les autres versions`, par exemple Acqua di Giò Profumo en rupture : les autres versions. Sinon : `{tête} : rupture de stock`.
- **Sans données** : `{tête} : prix en Algérie`, plus le suffixe s'il tient. La précision ne sert qu'à séparer la fiche d'une sœur. Exemples : Khamrah Qahwa de Lattafa : prix en Algérie | Maison Numidia ; Pierre Cardin Pour Monsieur : prix en Algérie.
- **Page qui marche déjà** : quand le CTR atteint au moins 1,5 fois la courbe à sa position, on garde l'ordre de la tête actuelle (« {Marque} {Nom} ») et la page part en dernière vague. Courbe des fiches : 6,9 % (position < 4,5), 5,4 % (4,5 à 5,5), 4,3 % (5,5 à 6), 3,4 % (6 à 7), 3,2 % (7 à 11), 2,6 % (11 à 16). Exemples : Lattafa Asad (8,8 % en position 4,9), Franck Olivier (10 % en 5,1).

**2.8 Arabe.** Un nom arabe n'entre dans le titre que si son volume DataForSEO égale ou dépasse celui du nom latin, ce qui n'est vrai aujourd'hui que pour Khamrah (عطر خمرة 480 contre 390) et Asad (عطر أسد 260 contre 210). Il faut aussi que **la fiche affiche déjà ce même nom arabe**, dans un h2 ou la FAQ : sinon Google réécrit un titre dont la langue diffère de la page (G1). Aujourd'hui, aucune fiche ne l'affiche (vérifié par grep : seul `data/blog.ts` contient خمرة). Le nom se place en fin de titre, après « – », jamais entre parenthèses ni après « | ». Pour tenir en 65 caractères, on retire d'abord le genre de la précision : Khamrah de Lattafa, parfum original : prix en Algérie – عطر خمرة (64 caractères).

**2.9 Raccourcir.** Au-delà de 60 caractères, on retire dans cet ordre jusqu'à ce que le titre tienne : (1) le suffixe ; (2) la contenance ; (3) le genre devant « original » ; (4) « original » ; (5) la précision « parfum {genre} », et « Parfum » passe en tête (Parfum Comme une Évidence d'Yves Rocher, au lieu de 64 caractères) ; (6) la marque si elle n'est pas tapée (Acqua di Giò Profumo, sans « d'Armani ») ; (7) les mots secondaires d'un nom long.

## 3. Pages marque (`/marques/x`)

Jamais de nom de parfum (il appartient à sa fiche), pas de genre au singulier (il appartient aux pages filles), pas d'« original » (0,4 % des requêtes). On choisit la première forme qui s'applique :
- **M3**, quand la requête n°1 du dossier est « {marque} algérie » ou « {marque} dz », avec au moins 20 impressions : `{Marque} en Algérie : prix des parfums {contenu}`. Exemple : Lattafa en Algérie : prix des parfums orientaux.
- **M2**, quand la marque n'a aucune fiche homme ou aucune fiche femme (champ `genres`) : `Parfum {Marque} : prix en Algérie`. Exemple : Parfum Kayali : prix en Algérie | Maison Numidia, qui reprend mot pour mot les 567 impressions que la fiche Eden capte.
- **M1**, dans tous les autres cas : `{Marque} : parfums {contenu}, prix en Algérie`. Exemples : Bvlgari : parfums homme et femme, prix en Algérie ; Dior : parfums homme, femme et mixtes, prix en Algérie.

**{contenu}** : « orientaux » si `oriental` fait au moins 80 % des fiches. Sinon, les genres qui comptent au moins 3 fiches, dans l'ordre homme, femme, mixtes ; on retire « mixtes » si le titre dépasse 60 (Yves Saint Laurent : parfums homme et femme, prix en Algérie).

**Forme de la marque** : celle tapée sur la page, si elle pèse au moins deux fois l'autre (impressions du dossier et volumes `motsCles`). Sinon, la forme de CLAUDE.md : Armani, Rabanne, Yves Saint Laurent.

## 4. Pages filles (`/parfums-femme/x`, `/parfums-homme/x`, `/parfums-orientaux/x`)

Le genre est obligatoire : il est tapé dans 32 % des impressions pour femme, 13 % pour homme. Il s'écrit au singulier, comme les gens le tapent.
- **F1**, par défaut (quand la marque est tapée avant « parfum ») : `{Marque} : parfum {femme|homme|oriental}, prix en Algérie`. Exemple : Jimmy Choo : parfum femme, prix en Algérie | Maison Numidia (« jimmy choo parfum prix algérie » : 328 impressions, 29 clics).
- **F2**, si, parmi les requêtes qui contiennent « parfum », celles qui commencent par « parfum » pèsent plus que celles où la marque le précède : `Parfum {Marque} pour {femme|homme} : prix en Algérie`, ou `Parfum oriental {Marque} : prix en Algérie`. Exemple : Parfum Hugo Boss pour homme : prix en Algérie (170 impressions contre 123).
- La forme de la marque suit la même règle que les pages marque : Giorgio Armani sur /parfums-femme/armani (86 impressions contre 13 pour « armani » seul) ; Yves Saint Laurent sur /parfums-femme/ysl (67 contre 50 pour « ysl » : pas le double, donc la forme de CLAUDE.md).
- Le titre ne doit jamais être celui d'une fiche « marque = nom » ni celui de la page marque (le validateur refuse les doublons).
- Les filles en doublon (canonique vers /marques) n'ont ni dossier ni titre rédigé : elles gardent le titre de leur gabarit, qui doit suivre la forme F1.

## 5. Catégories, accueil, articles, services

- **Catégories femme et homme** : `Parfum {femme|homme} original : prix en Algérie, paiement à la livraison` (64 caractères). « original » y est tapé (15 % des impressions), et l'argument est vrai.
- **Catégorie orientale** : Parfum oriental et arabe original : prix en Algérie. « parfum arabe » est en position 7,9, « parfum oriental » en 40. Pas de Lattafa : « lattafa algerie » revient à /marques/lattafa.
- **Accueil** : Maison Numidia : parfum original en Algérie, parfumerie à Blida (63 caractères). Le nom fait 62 % des clics de l'accueil et sert au nom de site (G2). On a ensuite « parfum original alger » (398 impressions) et « parfumerie » (149). La boutique de Blida est réelle.
- **Articles** : le début du h1, en casse de phrase, avec les mots tapés en tête. Les sigles sont permis s'ils sont tapés : Eau de parfum ou eau de toilette : différence EDP et EDT. Une année seulement si le h1 la porte, et on la change avec lui chaque 1er janvier : Meilleur parfum homme 2026 : top 12 en Algérie, par budget.
- **Index et services** (/marques, /blog, /livraison, /contact, /a-propos, /parfum-algerie) : un titre littéral et court, plus le suffixe s'il tient. Exemple : Livraison en Algérie : tarifs par wilaya | Maison Numidia.

## 6. Désaccords tranchés

| question | décision | donnée |
|---|---|---|
| place de « parfum homme » | avant « : », comme la concentration (« Yara de Lattafa, parfum femme : prix en Algérie ») | une seule place pour la précision : « : » n'introduit que l'intention, sur les 2 326 fiches |
| ordre marque / nom | mesuré sur chaque dossier (§2.1) | 36 % des impressions de fiche tapent le nom seul, mais la marque vient d'abord dans 66 % des cas où elle est tapée |
| « original » | rare, sous condition (§2.5) | 0,9 % des impressions de fiche. La charte « clic » en mettait sur 20 fiches sur 29 : c'est un gabarit, et des vendeurs de copies affichent le même mot |
| contenance | gardée si elle est dans la requête n°1 | « bleu de chanel parfum 100ml » : 344 impressions. La charte « enseigne » l'omettait |
| rupture | la dire, et offrir ce que la page offre | « acqua di gio » : 537 impressions vers une fiche épuisée (juges 1 et 2) |
| arabe | seulement après affichage sur la fiche | aucune fiche ne l'affiche ; G1 |
| pages marque | M1 (genres réels, à la manière de Notino), M2 pour Kayali | juges 1 et 2 ; Bvlgari a 18 fiches homme et 21 femme |
| pages filles | singulier « parfum femme » | forme tapée (juges 1 et 3) |
| catégories | « paiement à la livraison », 64 caractères | argument vrai (+11,4 % de clics mesurés par SplitSignal), juges 2 et 3 |
| accueil | le nom en tête, puis « parfumerie à Blida » | 62 % des clics ; « parfumerie » 149 impressions |

## 7. Contrôle et déploiement

- `node scripts/_seo/titres/valider.mjs <lot.json>` doit sortir **0 erreur**. Il vérifie aujourd'hui la longueur (65), les majuscules des mots courants, la concentration, la contenance et le genre face au catalogue, la présence du nom, COD, promo, étoiles, emoji, 2025 et les titres en double.
- **À ajouter au validateur** : séparateurs (un seul « : », « | » seulement devant le suffixe, « – » seulement devant de l'arabe, pas de « — ») ; suffixe seulement si le total fait 60 au plus ; 60 au plus sur les fiches hors exceptions du §1 ; minuscule après « : » ; EDP, EDT et « \d+ml » hors des articles ; YSL, Paco Rabanne et Giorgio Armani sur une fiche ; place d'« original » (`/(parfum|homme|femme|mixte) original/`) ; montants et mots commerciaux du §1.
- **Vagues** : une famille entière (la base et ses déclinaisons) part toujours dans la même vague. Vague 1 : les 131 fiches sous la courbe (donnees.md §3) et leurs familles, soit environ 200 fiches, face à un groupe témoin comparable laissé inchangé ; on compare pendant 3 à 4 semaines, après avoir vérifié sur google.dz mobile (DataForSEO SERP) que Google affiche bien le nouveau titre (méthode SplitSignal). Vague 2 : le reste. Dernière vague : les pages au-dessus de 1,5 fois la courbe, l'accueil, Khamrah et /marques/lattafa.
- **À attendre** : un titre seul a rapporté de 0 à +28 % dans les tests publiés. Le gain réaliste, c'est de revenir sur la courbe (environ 750 clics par mois) et de rendre les requêtes mal aiguillées à la bonne page. Il ne fera pas ×10 à lui seul.

## 8. À corriger hors des titres (catalogue et fiches)

- Noms : `club-de-nuit-women-armaf` dit « Women » dans name et h1, Fragrantica dit Club-de-Nuit-Woman-27655 ; `acqua-di-gio-profumo-armani` écrit « Gio » sans l'accent de ses sœurs.
- `armani-code` est noté EDP 110 ml, à côté de « Code EDP » en 125 ml ; l'original est en principe une eau de toilette, à vérifier sur Fragrantica. h1 doublés, que Google reprend quand il réécrit un titre : `franck-olivier`, `chanel-chance-eau-tendre`. Notes en double : `libre-ysl` (Lavande), `chanel-chance` (Patchouli).
- Afficher عطر خمرة et عطر أسد sur les fiches Khamrah et Asad (h2 ou FAQ) avant de les mettre dans le titre (§2.8).
