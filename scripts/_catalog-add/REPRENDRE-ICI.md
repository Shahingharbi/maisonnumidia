# Où reprendre — vague 2 (arrêt du 26/09/2026)

## État

Catalogue : **1 457 produits**, 150 marques, audit règle n°6 à **0 erreur**, tout poussé sur `main`.

La vague 2 traite les parfums vus chez **1 ou 2 boutiques algériennes**, après un tri qualité qui
a écarté 353 entrées sur 2 809 (maquillage, soins, accessoires, formats voyage, prix sous le
plancher de 6 500 DA, parfums attribués à la mauvaise maison).

| | |
|---|---|
| candidats retenus | 2 456, dans `candidates-vague2.json` |
| recherchés | ~353 |
| restants à rechercher | ~2 100 |

## La contrainte qui a arrêté la session

**Le quota WebSearch a été épuisé (200/200).** Les agents ont basculé sur des recherches via le
navigateur, ce qui fonctionne mais donne des extraits Google qui tronquent les URLs : 18 parfums
sont revenus sans ID Fragrantica lisible, donc sans image possible, et ont été écartés.

Attendre la réinitialisation du quota avant de relancer une vague de recherche. Sans WebSearch,
le rendement chute et la qualité des ID avec.

## Comment reprendre

Les agents **sautent les parfums déjà traités** (un fichier dans `research/`, `texts/`). On peut
donc relancer sur n'importe quelle plage sans rien perdre ni refaire.

```
1. Workflow recherche-vague2   → args {from: 0, total: 542}
   Les index ne sont PAS alignés sur ce qui a déjà été cherché : la file a été réordonnée par
   maison en cours de route. Les agents sautant l'existant, relancer sur toute la plage comble
   les trous sans gaspillage.

2. node scripts/_catalog-add/build-fiches.mjs
3. Workflow redaction-fiches-nouvelles → args {total: <longueur de textes-todo.json>}
4. node scripts/_catalog-add/fetch-images.mjs --apply
5. node scripts/_catalog-add/check-fiches.mjs
6. node scripts/_catalog-add/apply-fiches.mjs --apply
7. node scripts/_catalog-add/fix-related.mjs --apply
8. npx tsc --noEmit && npx next build && commit && push
```

**Ne jamais relancer `build-fiches.mjs` pendant qu'un workflow de rédaction tourne** — voir le
README du dossier, ça a déjà coûté trois agents.

## Plan de marche

`plan-marques.json` donne, pour chacune des 240 maisons, ses index de début et de fin dans la
file. La file est ordonnée maison par maison, les 121 déjà au catalogue en tête. Chaque arrêt sur
une frontière de maison laisse un état lisible.

Découpage conseillé : lots d'environ 120 parfums alignés sur les maisons.
Lot 1 Armani + Guerlain (0-105) · Lot 2 YSL, Givenchy, Paco Rabanne (106-211) ·
Lot 3 Dior, Hugo Boss, Lancôme (212-313) · Lot 4 D&G, Chanel, JPG, Gucci (314-421) ·
Lot 5 Azzaro, Hermès, Carolina Herrera, Bvlgari (422-541) · puis 18 lots jusqu'à 2 456.

## Ce qui reste en attente, hors vague 2

- **~143 fiches déjà recherchées** attendent leur texte ou ont été recalées au contrôle.
  `check-fiches.json` dit pourquoi, fiche par fiche.
- **8 fiches** citent une note absente de leur pyramide (citron chez Acqua di Parma Yuzu, lavande,
  labdanum, orchidée de vanille) : à reprendre avec le workflow `reprise-textes-recales`, qui met
  l'erreur exacte dans la consigne.
- **30 pyramides** sans découpage tête/cœur/fond publié — Louis Vuitton et Tom Ford n'en publient
  pas. Elles s'affichent en « Notes olfactives », ce qui est la situation réelle.

## Décisions qui attendent Shahin

- La palette du header et du footer (`#53545C`, `#AC9270`) ne correspond pas à la charte écrite
  dans CLAUDE.md. Soit on réaligne le code, soit on met la charte à jour — mais les deux ne
  doivent pas diverger en silence.
- Le blog : quelques fourchettes de prix hors produits encore datées, 5 articles sous 1 000 mots,
  et deux articles qui visent le même mot-clé (`meilleur-parfum-femme` et
  `meilleur-parfum-femme-2026`). Shahin a demandé de laisser le blog de côté le 21/09.
