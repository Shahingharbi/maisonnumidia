# Ce que nos données disent pour écrire les titres

Calculé le 24/11/2026 sur l'extraction Search Console du 21/11 (`scripts/_gsc/brut/`) et les volumes
DataForSEO de `scripts/_seo/donnees/`. Chaque chiffre se recalcule avec les scripts de ce dossier :

| question | script | sortie brute |
|---|---|---|
| 1. mots tapés par type de page | `01-modificateurs.mjs` | `01-modificateurs.txt` |
| 2. ordre marque / nom | `02-ordre-mots.mjs` | `02-ordre-mots.txt` |
| 3. CTR par position, fiches sous la courbe | `05-mauvaise-page.mjs` **puis** `03-ctr-position.mjs` | `03-ctr-position.txt` |
| 4. effets du 14/09 et du 18/10 | `04-avant-apres.mjs`, `04b-couples-prix.mjs` | `04-avant-apres.txt`, `04b-couples-prix.txt` |
| 5. requêtes sur la mauvaise page | `05-mauvaise-page.mjs` | `05-mauvaise-page.txt` |
| 6. arabe | `06-arabe.mjs` | `06-arabe.txt` |

Lancer depuis la racine du dépôt : `node scripts/_seo/titres/recherche/0N-….mjs`.

**À garder en tête.** Les données requête × page (`rp-A`) sont un échantillon : 39 % des
impressions et 25 % des clics (Google masque les requêtes rares). Les parts ci-dessous sont donc
celles des requêtes assez fréquentes pour être visibles, qui sont justement celles que les titres
visent. Les données par page (`pages-A`, `jours-*`, `pages-jours-60`) sont complètes.
Période A = 21/08 → 18/11/2026 (90 jours).

---

## 1. Ce que les gens tapent, par type de page

Part des impressions de l'échantillon dont la requête contient le mot (entre parenthèses : part des
clics quand elle change la lecture).

| mot tapé | fiche produit | page marque | page fille | catégorie | accueil |
|---|---|---|---|---|---|
| **prix** (prix, price, combien, سعر, ثمن) | **33 %** (48 % des clics) | 26 % (30 %) | **39 %** (69 % des clics) | 18 % | 11 % |
| dont en arabe (سعر, ثمن) | 3,1 % | 3,1 % | 1,1 % | 0,2 % | 1,4 % |
| **algérie / dz / الجزائر** | **22 %** (44 % des clics) | 29 % (52 %) | 31 % (69 %) | 28 % | 33 % |
| original / authentique / الأصلي | **0,9 %** | 0,4 % | 0,2 % | 15 % | **22 %** |
| homme | 5,5 % | 3,5 % | 13 % | 3 % | 7 % |
| femme | 6,1 % | 4,1 % | **32 %** | 23 % | 3 % |
| parfum / perfume / عطر | **34 %** | **48 %** | **74 %** | 45 % | 55 % |
| concentration (edp, edt, elixir, intense, le parfum, extrait) | 4,8 % | 1,2 % | 1,0 % | 0,1 % | 0,8 % |
| volume (« 100ml »…) | 4,5 % (6,4 % des clics) | 0,8 % | 1,2 % | 0,2 % | 0,3 % |
| un mot arabe | 5,2 % | 7,8 % (20 % des clics) | 2,5 % | 1,2 % | 6,2 % |
| « maison numidia » (navigation) | 0 % | 5,7 % | 4,6 % | **54 %** | 23 % (62 % des clics) |

(blog : la concentration pèse 44 %, c'est l'article EDP contre EDT.)

Lecture :
- **« prix » et « Algérie » portent près de la moitié des clics des fiches et plus des deux tiers
  de ceux des pages filles.** Les titres de pages filles actuels (« Parfum Femme Dior en Algérie —
  12 références ») et de pages marque (« Parfums Dior en Algérie — Toute la Collection ») n'ont
  pas le mot « prix ».
- **« Original » n'est presque jamais tapé sur une fiche (0,9 %)** ni sur une marque. Il l'est sur
  l'accueil (22 %) et les catégories (15 %) : « parfum original alger », « parfum femme original
  prix algérie ». Sur une fiche, c'est un argument (confiance), pas un mot-clé : il n'a pas besoin
  d'être en majuscule ni en fin de titre.
- **« parfum » est tapé dans un tiers des requêtes de fiche et absent de leur titre** depuis le
  14/09 (l'ancien titre contenait « Parfum Homme »). Sur les pages marque (48 %) et filles (74 %),
  c'est le mot principal : « parfum dior », « parfum femme dior ».
- **femme / homme : 32 % / 13 % sur les filles, 5-6 % sur les fiches.** Le genre est indispensable
  dans le titre d'une page fille ; sur une fiche, il ne sert que quand il distingue deux versions
  (Pure XS / Pure XS pour Elle, Club de Nuit Women / Intense Man).
- **La concentration est rarement tapée (4,8 %)**, le volume un peu (4,5 %, surtout « 100ml »).
  Ils ne justifient une place dans le titre que pour séparer deux fiches d'un même parfum.

CTR à position égale sur les fiches (même script) : les requêtes « prix + lieu » cliquent à 8,8 %
en position 1-3 et 4,6 % en 3-5, contre 2,7 % et 2,0 % pour les requêtes sans ces mots. Les
requêtes avec le lieu mais sans « prix » (« franck olivier dz », « whisky algerie ») font
17 % puis 11 % : l'intention d'acheter en Algérie est celle qui clique.

## 2. Ordre des mots sur les fiches : marque d'abord ou nom d'abord ?

Base : 148 865 impressions de requêtes en alphabet latin sur des fiches au catalogue.

| forme | part des imp | part des clics | CTR |
|---|---|---|---|
| **nom sans la marque** (« whisky silver », « acqua di gio ») | **36 %** | 28 % | 1,8 % |
| marque puis nom (« dior sauvage ») | 26 % | 29 % | 2,5 % |
| nom puis marque (« sauvage dior ») | 13 % | 13 % | 2,3 % |
| marque sans le nom (« kayali », « narciso rodriguez ») | 9 % | 5 % | 1,4 % |
| nom qui contient la marque (Miss Dior, Bleu de Chanel), indéterminé | 11 % | 18 % | 3,8 % |

Quand les deux sont tapés, **la marque vient d'abord dans 66 % des cas**. Mais dans 36 % des
impressions, la marque n'est pas tapée du tout. Sur les 188 fiches à ≥ 150 impressions classées,
**72 (38 %) sont dominées par le nom seul** (≥ 60 % des impressions).

Ça dépend de la maison, et nettement (part du nom tapé sans la marque) :
- **nom seul ≥ 65 %** : Evaflor 99 % (Whisky), Giorgio Armani 97 %, Guy Laroche 97 %, Maison
  Crivelli 97 %, Victoria's Secret 94 %, By Kilian 88 %, Escada 84 %, Michael Kors 84 %, Carolina
  Herrera 82 %, Ajmal 81 %, Armaf 78 %, Ralph Lauren 77 %, Viktor & Rolf 77 %, Nikos 77 %,
  **Yves Saint Laurent 70 %, Lattafa 70 %**, Van Cleef 69 %, Paco Rabanne 68 %, Rasasi 68 %, Yves Rocher 68 %.
- **marque d'abord ≥ 60 %** : Nautica 91 %, Azzaro 78 %, Gucci 76 %, Tom Ford 76 %, Creed 75 %,
  Lacoste 75 %, Chloé 75 %, Burberry 74 %, Jimmy Choo 74 %, Versace 73 %, Nishane 71 %, Prada 66 %,
  Amouage 65 %, Cartier 61 %, Mancera 60 %.
- **nom puis marque fréquent** (≥ 39 %) : Arabian Oud 52 %, Lanvin 45 %, Givenchy 44 %, Louis
  Vuitton 44 %, Guerlain 41 %, Marc Jacobs 39 % ; par fiche : Coco Mademoiselle (59 %), Spell On You
  (60 %), Innocent (60 %), J'adore Infinissime (57 %), Hypnotic Poison (55 %), Dior Sauvage (54 %
  « sauvage dior »), Atlas Garden (53 %), Givenchy Irresistible (71 %).
- **la marque seule mange la fiche** : Mauboussin 84 %, Zara 61 %, Kayali 60 %, Guess 49 %,
  Mont Blanc 47 %, Narciso Rodriguez 65 % (voir §5 : ces requêtes devraient aller à la page marque).

Fiches dominées par le nom seul, les plus grosses (part nom seul, requête n°1) : Whisky Silver
(99 %, « whisky silver »), Yara (92 %, « yara parfum »), Club de Nuit Women (78 %), Khamrah (64 %),
Comme une Évidence (72 %, « evidence parfum… »), Bal d'Afrique (64 %), Alien (74 %), Acqua di Gio
Profumo (99 %), Libre (75 %, « parfum libre prix algerie »), La Nuit de l'Homme Bleu Électrique
(84 %), Stronger With You Intensely (100 %), Fahrenheit 32 (75 %), Candy Love (91 %), Polo Sport
(94 %), Angels' Share (92 %), Hawas (87 %), Gorgeous (86 %), Wisal (97 %), 212 Men (94 %, « +212 »),
Lady Million (89 %), Drakkar Noir (98 %), Black Opium (98 %, souvent écrit « black opiume »).

**Conséquence pour le titre** : le premier mot visible doit être celui que les gens tapent. Pour
une maison « nom seul », mettre le nom en tête (« Whisky Silver d'Evaflor… », « Libre d'Yves Saint
Laurent… ») ; pour une maison « marque d'abord », garder la marque en tête (« Gucci Envy Me… »).
Pour Giorgio Armani, la marque tapée est « Armani » (CLAUDE.md) et n'apparaît dans presque
aucune requête de fiche : la reléguer en fin de titre ou l'écrire « Armani ».

## 3. CTR par tranche de position (pages-A, données complètes)

Chaque page est rangée dans la tranche de sa position moyenne. CTR = clics / impressions de la tranche.

| type | pos 1-3 | pos 3-5 | pos 5-8 | pos 8-12 | pos 12-20 | ensemble |
|---|---|---|---|---|---|---|
| fiche produit | 8,3 % (68 p., 168 imp : non significatif) | **5,7 %** (234 p.) | **4,0 %** (1 102 p.) | 3,2 % (436 p.) | 2,8 % (172 p.) | 4,1 % |
| page marque | – | 19,3 % (13 p.) | 7,1 % (60 p.) | 4,7 % (43 p.) | 4,1 % (25 p.) | 6,9 % |
| page fille | – | 8,0 % (16 p., 249 imp) | 4,2 % (129 p.) | 3,7 % (101 p.) | 2,5 % (44 p.) | 4,0 % |
| catégorie | – | – | 3,0 % (1 p.) | 3,5 % (2 p.) | – | 3,4 % |
| accueil | – | – | 7,4 % (1 p.) | – | – | 7,4 % |
| blog | – | 1,7 % (1 p.) | 3,5 % (8 p.) | 2,0 % (3 p.) | 1,2 % | 2,8 % |

Une fiche n'est presque jamais en moyenne au-dessus de la position 3,5 : elle se classe sur
beaucoup de requêtes à la fois. Les pages marque cliquent 1,8 fois plus que les fiches à position
égale (7,1 % contre 4,0 % en 5-8) ; les filles, pas mieux que les fiches.

Courbe de référence des fiches (pages ≥ 30 imp, lissée et décroissante) : 6,9 % (pos 3,5-4,5),
5,4 % (4,5-5), 5,3 % (5-5,5), 4,3 % (5,5-6), 3,4 % (6-7), 3,3 % (7-7,5), 3,1 % (7,5-11), 2,6 % (11-16).
Sur les 211 fiches à ≥ 400 impressions et position ≤ 15, **131 sont sous la courbe, pour
2 255 clics manquants en 90 jours (≈ 750 par mois, soit + 16 % des clics des fiches)** si elles
cliquaient comme la moyenne à leur position.

### Les 30 fiches les plus en dessous de la courbe

Titre actuel = « {Marque} {Nom} Prix Algérie Original | Maison Numidia ». « Marque / autre » =
part des impressions de l'échantillon venant de requêtes de marque pure, ou de requêtes qui nomment
une autre fiche (§5) : quand elle est forte, le titre n'est pas la seule cause.

| # | fiche | imp | pos | CTR | attendu | clics manquants | requête n°1 (imp, pos) | marque / autre | lecture |
|---|---|---|---|---|---|---|---|---|---|
| 1 | kayali-eden | 6 239 | 6,1 | 1,5 % | 3,4 % | 118 | parfum kayali prix algérie (567, 7,1) | 57 % / 0 | requête de marque : page marque à pousser ; « Juicy Apple 01 » : le 01 n'est jamais tapé |
| 2 | narciso-rodriguez-for-her-fleur-musc | 1 900 | 3,4 | 1,6 % | 6,9 % | 102 | narciso rodriguez (998, **1,1**) | 79 % / 0 | 1re position sur la marque, 0,2 % de CTR : la page marque doit prendre cette requête |
| 3 | libre-ysl | 3 683 | 5,8 | 1,6 % | 4,3 % | 97 | parfum libre prix algerie (213, 7,1) | 8 % / 1 % | « Libre » noyé derrière « Yves Saint Laurent » ; nom tapé seul à 75 % |
| 4 | whisky-silver-evaflor | 6 374 | 6,2 | 2,1 % | 3,4 % | 83 | whisky silver (671, 5,6) | 0 / 0 | personne ne tape « Evaflor » (99 % nom seul) : il ouvre le titre |
| 5 | chanel-chance-eau-tendre | 2 660 | 5,0 | 2,7 % | 5,4 % | 71 | chanel chance eau tendre (304, 8,1) | 12 % / **72 %** | la fiche EDP récolte « chance » et « chance eau tendre » (EDT) |
| 6 | idole-lancome | 1 496 | 4,2 | 3,3 % | 6,9 % | 54 | idôle parfum prix algérie (203, 3,9) | 2 % / 1 % | titre seul en cause |
| 7 | kayali-vanilla-28 | 1 192 | 5,0 | 1,3 % | 5,3 % | 47 | parfum kayali prix algérie (63, 4,2) | 47 % / 0 | requête de marque |
| 8 | lattafa-yara | 4 457 | 5,0 | 4,4 % | 5,4 % | 45 | yara parfum (538, 7,4) | 3 % / 0 | nom seul 92 % ; 115 imp en arabe (يارا) |
| 9 | terre-d-hermes | 2 805 | 5,3 | 3,7 % | 5,3 % | 44 | terre d'hermes (291, 8,7) | 19 % / 0 | — |
| 10 | club-de-nuit-women-armaf | 3 048 | 5,8 | 2,8 % | 4,3 % | 44 | club de nuit parfum (142, 5,8) | 8 % / 1 % | « woman » tapé, pas « women » ; Armaf rarement tapé (78 % nom seul) |
| 11 | dior-sauvage | 1 611 | 5,3 | 2,6 % | 5,3 % | 43 | sauvage dior 100ml prix en algérie (142, 6,4) | 5 % / 0 | « sauvage dior » 54 % ; « 100ml » et « eau de parfum » tapés |
| 12 | acqua-di-gio-profumo-armani | 1 663 | 4,8 | 3,1 % | 5,4 % | 38 | acqua di gio (537, 3,2) | 1 % / **49 %** | prend « acqua di gio » à la fiche de base (pos 11,4) |
| 13 | dior-addict | 1 940 | 5,2 | 3,4 % | 5,3 % | 37 | dior addict (310, 8,7) | 5 % / 0 | — |
| 14 | mauboussin-pour-elle | 1 727 | 5,0 | 3,2 % | 5,3 % | 36 | mauboussin parfum (265, 3,2) | (marque) | fiche « signature » : la marque est sa requête |
| 15 | escada-candy-love | 822 | 5,1 | 1,1 % | 5,3 % | 34 | candy love (455, 5,8) | 0 / 0 | nom seul 91 % : « Candy Love » doit ouvrir le titre |
| 16 | stronger-with-you-intensely | 2 332 | 6,8 | 2,0 % | 3,4 % | 33 | stronger with you intensely (254, 8,7) | 3 % / 23 % | titre de 66 caractères ; « Giorgio Armani » jamais tapé |
| 17 | coco-mademoiselle-chanel | 2 290 | 5,6 | 2,8 % | 4,3 % | 32 | coco mademoiselle eau de parfum 100ml prix algérie (132, 4,4) | 3 % / 23 % | « coco chanel mademoiselle » : nom puis marque 59 % |
| 18 | tom-ford-noir-extreme | 1 788 | 6,1 | 1,6 % | 3,4 % | 32 | tom ford noir extreme (496, 7,4) | 2 % / 0 | titre déjà calqué sur la requête : le prix (39 500 DA) ou l'extrait sont à regarder |
| 19 | gucci-envy-me | 1 749 | 8,0 | 1,3 % | 3,1 % | 32 | gucci envy me (549, 8,0) | 0 / 0 | idem |
| 20 | goddess-burberry | 1 272 | 5,9 | 1,9 % | 4,3 % | 30 | burberry goddess prix algérie (154, 6,3) | 3 % / 0 | idem |
| 21 | gucci-bloom | 1 044 | 4,5 | 4,2 % | 6,9 % | 28 | gucci bloom prix algérie (83, 2,2) | 22 % / 0 | — |
| 22 | carolina-herrera-la-bomba-intensa | 553 | 4,2 | 2,0 % | 6,9 % | 27 | parfum la bomba prix algérie (119, 3,7) | 4 % / 0 | « la bomba » tapé sans « intensa » ni la marque |
| 23 | zara-rose-gold | 1 367 | 6,2 | 1,5 % | 3,4 % | 27 | zara rose (112, 3,6) | 48 % / 0 | requête de marque |
| 24 | amouage-reflection | 1 764 | 5,5 | 3,8 % | 5,3 % | 26 | amouage parfum prix algérie (144, 6,3) | 34 % / 0 | requête de marque ; امواج 27 imp |
| 25 | mont-blanc-signature | 1 544 | 5,2 | 3,6 % | 5,3 % | 26 | montblanc signature prix algérie (117, 5,3) | 46 % / 0 | « montblanc » en un mot dans les requêtes |
| 26 | scandal-jean-paul-gaultier | 1 124 | 6,3 | 1,2 % | 3,4 % | 24 | parfum scandal femme prix algérie (87, 5,8) | 9 % / 0 | nom seul 94 %, « femme » tapé |
| 27 | chanel-no5 | 908 | 5,2 | 2,6 % | 5,3 % | 24 | chanel n 5 prix 100ml algérie (72, 4,3) | 8 % / 0 | « N°5 » s'écrit « n 5 » ; « 100ml » |
| 28 | drakkar-noir-guy-laroche | 1 036 | 5,2 | 3,0 % | 5,3 % | 24 | drakkar noir (119, 8,2) | 3 % / 0 | nom seul 98 % |
| 29 | cacharel-noa | 1 357 | 5,2 | 3,5 % | 5,3 % | 24 | parfum noa prix algérie (169, 4,6) | 1 % / 0 | « noa cacharel » : nom puis marque |
| 30 | euphoria-calvin-klein | 573 | 4,6 | 1,4 % | 5,4 % | 23 | calvin klein parfum femme prix algérie (11, 4,6) | 35 % / 0 | requête de marque |

Profil : prix médian de ces 30 fiches 27 000 DA (catalogue 24 000 DA). Sur 30, **10 relèvent
d'abord d'un problème de page** (≥ 30 % de requêtes de marque, ou de requêtes d'une autre version :
Kayali ×2, Narciso, Chance Eau Tendre, Acqua di Gio Profumo, Zara, Amouage, Mont Blanc, Euphoria,
Mauboussin), 3 en partie (Stronger With You Intensely, Coco Mademoiselle, Gucci Bloom), et
**environ 14 d'un titre qui n'ouvre pas sur les mots tapés** (marque non tapée en tête, nom noyé
derrière « Yves Saint Laurent » ou « Giorgio Armani », « Women » quand les gens tapent « woman »,
« N°5 » tapé « n 5 »). Les 3 dernières (Tom Ford Noir Extreme, Gucci Envy Me, Burberry Goddess)
ont déjà les mots tapés en tête : le titre n'y changera pas grand-chose.

Longueur des titres actuels : médiane 64 caractères, 1 568 fiches au-delà de 60, 584 au-delà de 70
(dont 17 pour « | Maison Numidia »). 90 % du trafic est mobile.

## 4. Effet du titre du 14/09 et de la hausse de prix du 18/10

### 14/09 : « {h1} Original » → « {Marque} {Nom} Prix Algérie Original »

Le changement a ajouté « Prix » et retiré « Parfum {Homme|Femme} ».

| 3 semaines | fiches produit | pages marque + filles (témoin, titres inchangés) |
|---|---|---|
| avant (24/08 → 13/09) | CTR 3,30 %, pos 7,31 | CTR 4,44 %, pos 9,61 |
| après (15/09 → 05/10) | CTR 4,61 %, pos 6,68 | CTR 6,15 %, pos 7,88 |
| après décalé (22/09 → 12/10) | CTR 4,79 %, pos 6,68 | CTR 5,94 %, pos 7,64 |

(témoin recalculable par `_temoin-14-09.mjs`)

Le CTR des fiches monte de 40 %, mais celui du témoin aussi (+38 %), la même semaine : le ratio
fiches / témoin passe de 0,742 à 0,750 (+1 %), puis 0,805 trois semaines plus tard (+8 %).

Requête par requête (couples requête × fiche présents avant et après, `04b-couples-prix`) :
- les requêtes **avec « prix »** sur les fiches gagnent **1,6 place** (6,6 → 5,0), contre 0,2 place
  pour les requêtes du nom seul et 0,5 place pour les requêtes « prix » des pages témoin ;
- mais **à position stable, leur CTR ne bouge pas** : 4,04 % → 4,02 % (87 couples), alors que les
  requêtes sans « prix » passent de 0,89 % à 1,11 %.
- les requêtes « parfum » et « homme / femme », dont les mots ont quitté le titre, n'ont pas perdu
  de places (+0,7 et +0,8).

**Verdict : non concluant sur le CTR.** Le mot « Prix » n'a pas fait cliquer davantage à position
égale (le prix s'affiche déjà dans l'extrait Google). Il a **peut-être** aidé à mieux se classer sur
les requêtes « prix » (+1,1 place de plus que le témoin), mais le 15/09 tombent aussi le recalage
des prix, puis l'agrandissement du catalogue et la refonte de la fiche : rien ne permet d'isoler le
titre. Ce qui est sûr : retirer « parfum » et le genre n'a rien coûté de visible.

### 18/10 : prix à médiane + 20 % (≤ 15 000 DA) ou + 10 %

1 726 fiches sur 1 729 sont montées : pas de témoin parmi les fiches. Témoin = pages marque et
filles (même jour : « 69 wilayas » et fin de « COD » partout, ce qui touche les deux groupes).
Avant = 27/09 → 17/10, après = 19/10 → 08/11, pages présentes des deux côtés (`pages-jours-60`).

| groupe | pages | CTR avant → après | Δ brut | Δ à positions égales |
|---|---|---|---|---|
| témoin marque + filles | 101 | 6,11 % → 5,87 % | − 4 % | **− 7 %** |
| fiches, hausse < 8 % | 407 | 4,30 % → 3,94 % | − 8 % | − 15 % |
| fiches, hausse 8-12 % | 53 | 3,94 % → 4,82 % | + 23 % | + 16 % |
| fiches, hausse 12-18 % | 132 | 5,68 % → 5,05 % | − 11 % | − 16 % |
| fiches, hausse ≥ 18 % | 26 | 9,25 % → 5,66 % | − 39 % | − 40 % |
| **toutes les fiches** | 618 | 4,81 % → 4,32 % | − 10 % | **− 16 %** |

**Verdict : probable, pas démontré.** À positions égales, les fiches perdent 16 % de CTR contre
7 % pour le témoin, soit environ − 10 points imputables à quelque chose qui ne touche que les
fiches, et le prix affiché est le premier suspect. Mais l'effet ne croît pas avec la hausse (le
groupe 8-12 % monte), le petit groupe ≥ 18 % (26 pages) est bruité, et le témoin lui-même, page par
page, varie beaucoup (médiane − 18 % sur 17 pages). Le 01/11, 600 fiches nouvelles arrivent aussi
dans la fenêtre « après ». Pour les titres : **le titre ne peut pas compenser un prix plus cher
affiché juste en dessous** ; c'est la décision D4 du plan, pas un sujet de rédaction.

## 5. Requêtes qui touchent la mauvaise fiche

Méthode : une requête « nomme » une fiche quand tous les mots distinctifs du nom (hors marque,
« parfum », « prix », lieu, volume) y sont, genre écrit compris ; on garde la fiche la plus précise
et on écarte les égalités. Sur 16 067 couples rattachables à une fiche précise de la même marque,
**2 517 (10 983 impressions, CTR 2,2 %) sont servis par une autre fiche** :
- une **déclinaison prend la requête de la version de base** : 9 716 imp (88 % des cas) ;
- la base prend la requête d'une déclinaison : 421 imp ; voisin ou autre concentration : 846 imp.
Dans 1 493 de ces couples, la bonne fiche n'apparaît même pas dans l'échantillon.

S'y ajoutent **15 440 impressions de requêtes de marque pure** (« parfum kayali prix algérie »,
« narciso rodriguez », « mont blanc parfum ») servies par une fiche, à 1,8 % de CTR.

15 exemples parlants (rp-A, 90 jours) :

| requête | fiche servie (imp, clics, pos) | fiche qui correspond (imp, clics, pos) |
|---|---|---|
| acqua di gio | acqua-di-gio-profumo-armani (537, 5, 3,2) | acqua-di-gio-armani (8, 0, 11,4) |
| gucci flora prix algérie | gucci-flora-gorgeous (214, 37, 1,6) | gucci-flora (1, 0, 1,0) — 53 requêtes, 679 imp au total |
| chanel chance | chanel-chance-eau-tendre (165, 2, 1,4) | chanel-chance (224, 5, 9,0) |
| chanel chance eau tendre | chanel-chance-eau-tendre, l'EDP (304, 2, 8,1) | chance-eau-tendre-chanel, l'EDT (absente) |
| j'adore dior 100ml prix algérie | dior-jadore-infinissime (160, 3, 5,8) | dior-jadore (3, 0, 1,0) |
| miss dior parfum prix algérie | miss-dior-blooming-bouquet (109, 2, 4,6) | miss-dior (5, 0, 5,6) — avec « prix parfum miss dior en algérie » (92 imp), la Blooming prend les requêtes de Miss Dior |
| armani stronger with you | stronger-with-you-intensely (126, 0, 9,5) | stronger-with-you-armani (2, 0, 5,5) |
| parfum stronger with you | armani-emporio-stronger-with-you-powerfully (68, 0, 1,4) | stronger-with-you-armani (1, 0, 61) — 5 déclinaisons se partagent la base |
| jean paul gaultier le male | le-male-le-parfum (91, 0, 2,8) | le-male-jean-paul-gaultier (2, 0, 26) |
| amouage guidance | amouage-guidance-46 (79, 0, 8,7) | amouage-guidance (3, 0, 27) |
| parfum poison dior prix algérie | hypnotic-poison-dior (62, 4, 2,2) | dior-poison (3, 0, 4,7) |
| irresistible givenchy prix algérie | givenchy-irresistible-rose-velvet (50, 0, 8,0) | givenchy-irresistible (145, 2, 6,8) |
| azzaro sport 100ml prix algérie | azzaro-chrome-sport (43, 0, 9,8) | azzaro-sport (89, 3, 5,1) |
| evidence parfum prix 100ml algérie | evidence-yves-rocher (Comme une Évidence, 210, 12, 6,4) | yves-rocher-l-evidence (absente) — ici c'est plutôt l'inverse : les gens disent « Évidence » pour *Comme une Évidence* |
| narciso rodriguez | narciso-rodriguez-for-her-fleur-musc (998, 2, **1,1**) | /marques/narciso-rodriguez (requête de marque) |

Lecture pour les titres :
- **La déclinaison doit mettre son mot distinctif en tête** (« Profumo », « Intensely »,
  « Gorgeous Gardenia », « Infinissime », « Le Parfum », « Blooming Bouquet ») et **la base doit
  porter le nom nu, sans ajout** : c'est la règle « une intention = une page » du plan (B), et le
  titre est le signal le plus direct qu'on ait.
- Une partie du problème n'est pas de titre : la base est mal classée (pos 11 à 61) ou absente.
  Le titre aidera à départager, le maillage et le contenu de la base feront le reste.
- Requêtes de marque servies par une fiche (15 440 imp) : c'est le titre de la **page marque**
  (« Parfum Kayali : prix en Algérie », « Narciso Rodriguez ») qui doit les reprendre.

## 6. Requêtes en arabe

**Volume.** Dans l'échantillon : 2 380 requêtes distinctes, 9 423 impressions (**5,1 %**), 312 clics
(6,3 %), position 5,0. DataForSEO (Google Algérie, mensuel) : عطر 1 900, عطور 1 600, **عطر خمرة 480
(« lattafa khamrah » : 390)**, **عطر اسد 260 (« lattafa asad » : 210)**, عطر رجالي 260, عطر نسائي 260,
افضل عطر رجالي 210, عطر شانيل 140, ديور سوفاج 90 (« dior sauvage » : 1 000). Total arabe mesuré :
5 520 / mois, contre 214 000 pour les noms latins du catalogue.

**Ce que sont ces requêtes** (imp de l'échantillon) :
| forme | imp | CTR | exemple |
|---|---|---|---|
| conversationnelles (suite d'un échange avec un assistant : « سعره », « نعم ») | 3 872 | 4,0 % | كم سعره في الجزائر |
| **nom du parfum écrit en arabe** | 3 097 | 3,5 % | سعر عطر يارا في الجزائر |
| génériques (« سعر عطر في الجزائر ») | 2 103 | 2,2 % | — |
| nom latin dans une requête arabe | 351 | 1,1 % | سعر عطر miss dior في الجزائر |

Les conversationnelles ne se travaillent pas par un titre. Les génériques relèvent des catégories et
d'un futur article en arabe (plan, F).

**Où l'arabe pèse** (nom écrit en arabe, part des impressions de la page dans l'échantillon) :
Yara يارا (115 imp, 7,7 % de la page ; 12 % toutes formes arabes), Khamrah خمرة (94 + 11 variantes,
7,7 % ; 14 %), Whisky ويسكي / ويسكي سيلفر (113, 3,9 %), Hawas هوس (48, 7,8 %), Asad اسد / أسد
(30, 10 % ; 20 % toutes formes), Kayali كيالي (40), Amouage امواج (30), Cerruti شيروتي (18, 8 %),
Candy Love كاندي لوف (16), Libre ليبر (13), Bleu de Chanel بلو شانيل (8), Sauvage سوفاج (7),
Bade'e Al Oud بديع العود (8, 11 %), Ana Abiyedh انا الابيض (7, 10 %), page marque Assaf عساف (8, 10 %),
page marque Lattafa (26 % de ses impressions de l'échantillon en arabe, 3 de ses 16 clics).

À position égale, les requêtes au nom arabe cliquent un peu moins que les latines (4,7 % contre
5,5 % en 1-3 ; 2,8 % contre 3,8 % en 3-5 ; petits effectifs) : le titre tout en latin ne les
reprend pas.

**Verdict.** Un nom arabe dans le **titre** ne se justifie que là où l'arabe égale ou dépasse le
latin, c'est-à-dire **Khamrah (480 contre 390) et Asad (260 contre 210)**, et à la rigueur Yara et
Hawas (part arabe ≥ 8 % de la page). Partout ailleurs (Sauvage : 90 contre 1 000, Chanel, Dior,
Kayali, Whisky), l'arabe va dans le h2 ou la FAQ (C6 du plan), pas dans le titre : il prendrait
la place de mots tapés dix fois plus. Pour la page marque Lattafa (26 % d'impressions arabes),
« لطافة » (90 / mois) se discute dans le titre.

## 7. Ce qu'il faut en retenir pour rédiger

1. **Ouvrir le titre sur les mots tapés pour CETTE page** : le nom seul pour les maisons où il domine
   (38 % des grosses fiches), la marque d'abord pour Gucci, Tom Ford, Burberry, Creed, Azzaro,
   Versace, Lacoste, Chloé, Jimmy Choo, Nishane, Amouage, Prada. Jamais un mot que personne ne tape
   en tête (« Evaflor », « Giorgio Armani », numéro de série « 01 »).
2. **Garder « prix » et « Algérie »** sur fiches, pages marque et filles : 33-39 % des impressions,
   44-69 % des clics. Les écrire comme une phrase (« prix en Algérie ») plutôt qu'en étiquettes
   capitalisées : les données ne mesurent pas la casse, mais rien n'oblige aux majuscules.
3. **« Original » ne se tape pas sur une fiche (0,9 %)** : argument facultatif, en fin de titre, si la
   place le permet. Il se tape sur l'accueil (22 %) et les catégories (15 %).
4. **« parfum » se tape** (34 % fiches, 48 % marques, 74 % filles) : le réintroduire quand la longueur
   le permet, surtout sur les pages marque (« Parfum Dior ») et filles (« Parfum femme Dior »).
5. **Genre** : obligatoire sur les filles (femme 32 %, homme 13 %), utile sur une fiche seulement
   pour départager deux versions.
6. **Déclinaisons** : mot distinctif en tête, base au nom nu (§5, 9 716 impressions mal aiguillées).
7. **Concentration et volume** : seulement quand ils séparent deux fiches (4,8 % et 4,5 %).
8. **Arabe** : Khamrah et Asad dans le titre, éventuellement Yara, Hawas et la page Lattafa ; ailleurs, non.
9. **Longueur** : 1 568 titres dépassent 60 caractères, sur un trafic mobile à 90 % ; « | Maison
   Numidia » en coûte 17. Les mots tapés doivent tenir dans les 50 premiers.
10. **Attentes** : le titre n'a pas fait bouger le CTR à position égale le 14/09 ; la hausse de prix
    du 18/10 l'a probablement fait baisser d'environ 10 %. Le gain réaliste du titre est de
    rattraper la courbe (≈ 750 clics par mois sur 131 fiches), plus le reclassement des requêtes
    mal aiguillées. Il ne fera pas à lui seul × 10.
