import type { Product } from "@/lib/types";

const climateByCategory: Record<string, string> = {
  "parfums-homme":
    "Le climat algérien, marqué par des étés chauds sur le littoral d'Alger et d'Oran et un hiver plus frais sur les Hauts Plateaux,",
  "parfums-femme":
    "L'Algérie offre une grande variété climatique, du littoral méditerranéen tempéré jusqu'au Sahara plus aride. Cette diversité",
  "parfums-orientaux":
    "Les parfums orientaux trouvent en Algérie un terrain idéal : la culture maghrébine valorise les notes profondes d'oud, de musc et d'ambre, et le climat sec",
};

const audienceByCategory: Record<string, string> = {
  "parfums-homme":
    "l'homme algérien à la recherche d'une signature olfactive masculine, élégante et durable",
  "parfums-femme":
    "la femme algérienne qui veut affirmer sa personnalité avec un parfum féminin et raffiné",
  "parfums-orientaux":
    "les amateurs de parfums orientaux et oud, qu'ils soient hommes ou femmes, attachés à la tradition parfumière maghrébine",
};

function familyContext(family: string): string {
  const f = family.toLowerCase();
  if (f.includes("boisé") && f.includes("aromatique"))
    return "Les parfums boisés aromatiques mêlent la fraîcheur des herbes aromatiques (lavande, romarin, sauge) à la profondeur des bois nobles. Cette construction donne un parfum à la fois énergique en ouverture et chaleureux en fond.";
  if (f.includes("boisé") && f.includes("épicé"))
    return "La famille boisée épicée combine la noblesse des bois (cèdre, vétiver, santal) avec des épices chaudes (poivre noir, cardamome, cannelle). Le résultat est un parfum riche et complexe, parfait pour le caractère.";
  if (f.includes("oriental") && f.includes("épicé"))
    return "Les orientaux épicés sont une signature emblématique de la parfumerie arabe et indienne. Ils marient des épices chaudes à des résines précieuses (encens, myrrhe), pour une fragrance profonde et envoûtante.";
  if (f.includes("oriental") && f.includes("vanillé"))
    return "Les orientaux vanillés mélangent la douceur réconfortante de la vanille aux notes orientales chaudes (ambre, benjoin, fève tonka). Une famille gourmande et sensuelle, particulièrement appréciée le soir.";
  if (f.includes("oriental"))
    return "La famille orientale est l'une des plus anciennes et des plus prestigieuses de la parfumerie. Elle se caractérise par des notes profondes d'ambre, de musc, de résines et d'épices, héritées des routes parfumées de l'Arabie et de l'Inde.";
  if (f.includes("floral") && f.includes("fruit"))
    return "Les floraux fruités combinent la délicatesse des fleurs (rose, jasmin, pivoine) à la gourmandise des fruits (cassis, poire, pêche). C'est l'une des familles les plus populaires en parfumerie féminine moderne.";
  if (f.includes("floral") && f.includes("poudré"))
    return "Les floraux poudrés enveloppent les fleurs dans une texture douce et veloutée (iris, héliotrope, violette). Cette famille évoque l'élégance discrète des grandes parfumeries françaises.";
  if (f.includes("floral"))
    return "Les parfums floraux sont la grande famille de la parfumerie féminine. Ils déclinent toutes les facettes des fleurs, de la rose puissante au jasmin solaire, en passant par le muguet ou la fleur d'oranger.";
  if (f.includes("aquatique") || f.includes("frais"))
    return "Les parfums aquatiques et frais évoquent l'air marin, les notes d'agrumes et la fraîcheur d'une rosée matinale. Une famille moderne, particulièrement adaptée aux climats chauds comme l'été algérien.";
  if (f.includes("chypré"))
    return "La famille chyprée est un classique intemporel : son accord bergamote, mousse de chêne, ciste et patchouli construit un parfum élégant, sophistiqué et à la signature reconnaissable.";
  if (f.includes("fougère"))
    return "La famille fougère, structurée autour de la lavande, du géranium, de la mousse et de la coumarine, est l'une des plus utilisées en parfumerie masculine pour son caractère raffiné et propre.";
  if (f.includes("gourmand"))
    return "Les parfums gourmands évoquent les saveurs sucrées : caramel, miel, praliné, chocolat. Une famille jeune et moderne qui séduit par son originalité et sa sensualité enveloppante.";
  if (f.includes("musc") || f.includes("ambré"))
    return "Les parfums musqués et ambrés sont parmi les plus addictifs de la parfumerie. Le musc apporte une douceur peau, l'ambre une chaleur dorée — deux ingrédients piliers de la parfumerie orientale.";
  if (f.includes("cuir"))
    return "Les parfums cuirés sont une famille noble et virile, longtemps réservée aux signatures masculines. Le cuir donne un caractère brut et élégant, souvent allié à des notes fumées ou tabac.";
  return `La famille ${family.toLowerCase()} se distingue par une signature olfactive unique, construite autour de matières premières soigneusement sélectionnées et équilibrées par le parfumeur.`;
}

function concentrationContext(concentration: string): string {
  const c = concentration.toUpperCase();
  if (c === "PARFUM" || c === "EXTRAIT")
    return "L'Extrait de Parfum (ou Parfum) est la concentration la plus élevée, généralement entre 20 et 30% d'essence parfumée. Il offre une tenue exceptionnelle (8 à 12 heures, parfois plus) et un sillage maîtrisé. C'est le format le plus précieux et le plus durable.";
  if (c === "EDP")
    return "L'Eau de Parfum (EDP) contient entre 12 et 18% d'essence. C'est la concentration de référence pour les parfums de luxe, équilibrant tenue (6 à 8 heures), sillage présent et richesse olfactive. La concentration la plus polyvalente.";
  if (c === "EDT")
    return "L'Eau de Toilette (EDT) titre entre 6 et 12% d'essence. Plus légère et plus aérienne que l'Eau de Parfum, elle est idéale pour la journée et les climats chauds. Sa tenue est de 3 à 5 heures, parfaite pour une réapplication en milieu de journée.";
  if (c === "EDC" || c === "COLOGNE")
    return "L'Eau de Cologne titre entre 2 et 5% d'essence. Très fraîche, elle est conçue pour être appliquée généreusement et offre une sensation de fraîcheur immédiate, particulièrement appréciable en été.";
  return `La concentration ${concentration} détermine la tenue et l'intensité du parfum sur la peau, ainsi que la richesse de son sillage.`;
}

export function generateOlfactoryProfile(product: Product): string {
  const allNotes = [
    ...product.notes.top,
    ...product.notes.heart,
    ...product.notes.base,
  ];
  const noteCount = allNotes.length;
  const family = product.family || "olfactive";
  const opening =
    product.notes.top.length > 0
      ? `À l'ouverture, ${product.brand} ${product.name} dévoile ${product.notes.top.join(", ").toLowerCase()}, une introduction qui pose immédiatement le caractère du parfum.`
      : "";
  const heart =
    product.notes.heart.length > 0
      ? ` Le cœur révèle ensuite ${product.notes.heart.join(", ").toLowerCase()}, signature centrale qui s'épanouit dans les heures qui suivent l'application.`
      : "";
  const base =
    product.notes.base.length > 0
      ? ` Enfin, le fond se compose de ${product.notes.base.join(", ").toLowerCase()}, accord profond qui assure la persistance du parfum sur la peau et sur les vêtements.`
      : "";
  const familyLine = ` ${familyContext(family)}`;
  const balanceLine = ` Au total, ${noteCount} matières premières s'articulent autour de la famille ${family.toLowerCase()} pour construire une fragrance équilibrée et reconnaissable.`;

  return opening + heart + base + familyLine + balanceLine;
}

export function generatePerformance(product: Product): string {
  const longevity = product.longevity ?? 3;
  const sillage = product.sillage ?? 3;
  const longevityLabel =
    longevity >= 5
      ? "exceptionnelle"
      : longevity === 4
      ? "très bonne"
      : longevity === 3
      ? "bonne"
      : "modérée";
  const longevityHours =
    longevity >= 5
      ? "10 à 12 heures, parfois davantage"
      : longevity === 4
      ? "7 à 9 heures"
      : longevity === 3
      ? "5 à 7 heures"
      : "3 à 5 heures";
  const sillageLabel =
    sillage >= 5
      ? "imposant, capable de marquer une pièce"
      : sillage === 4
      ? "généreux et bien perceptible autour de soi"
      : sillage === 3
      ? "présent sans être intrusif, parfait pour la journée"
      : "discret, idéal pour le bureau ou les contextes feutrés";
  const climateLine =
    climateByCategory[product.category] ||
    "Le climat algérien, varié selon les régions,";
  const concentrationLine = concentrationContext(product.concentration);

  return `Sur la peau, ${product.brand} ${product.name} affiche une tenue ${longevityLabel} : comptez environ ${longevityHours} avant que le parfum ne s'estompe complètement. Son sillage est ${sillageLabel}. ${climateLine} influence directement la performance : sur peau chauffée par le soleil estival, les notes de tête s'évaporent plus vite mais le fond gagne en intensité. En hiver, le parfum se révèle plus discrètement mais tient plus longtemps. ${concentrationLine}`;
}

export function generatePersona(product: Product): string {
  const audience =
    audienceByCategory[product.category] ||
    "les amateurs de parfumerie de qualité en Algérie";
  const occasionsList = product.occasions?.length
    ? product.occasions.join(", ").toLowerCase()
    : "le quotidien";
  const seasonsList = product.seasons?.length
    ? product.seasons.join(", ").toLowerCase()
    : "toutes les saisons";
  const seasonAdvice = (() => {
    const s = (product.seasons || []).map((x) => x.toLowerCase());
    if (s.includes("été") && s.includes("printemps"))
      return "Sur le littoral algérois ou oranais, ce parfum trouve sa pleine expression en saison chaude — appliquez-le légèrement le matin pour éviter la saturation à l'arrivée des hautes températures.";
    if (s.includes("hiver") && s.includes("automne"))
      return "Pour les soirées d'hiver à Constantine ou les après-midi d'automne sur les Hauts Plateaux, la profondeur du parfum se révèle pleinement et accompagne les tenues plus couvrantes.";
    if (s.includes("été"))
      return "Réservé aux mois les plus chauds, ce parfum trouve toute sa cohérence sous le soleil estival algérien, notamment sur les plages d'Oran ou de Tipaza.";
    if (s.includes("hiver"))
      return "C'est un parfum de saison froide : la chaleur du corps en hiver libère progressivement ses notes les plus précieuses, parfait pour les soirées et les sorties d'hiver.";
    return "Sa polyvalence saisonnière en fait un compagnon olfactif fiable tout au long de l'année, à adapter selon la météo et l'occasion.";
  })();

  return `Ce parfum s'adresse particulièrement à ${audience}. Les occasions où ${product.brand} ${product.name} déploie tout son potentiel sont nombreuses : ${occasionsList}. Côté calendrier, il est conseillé en ${seasonsList}. ${seasonAdvice} Que ce soit pour un usage quotidien à Alger, Oran, Constantine, Annaba, Sétif ou n'importe quelle autre wilaya, ${product.name} sait s'adapter au rythme de vie algérien tout en affirmant un parti pris olfactif assumé.`;
}

export function generateComparison(product: Product): string {
  const family = product.family || "";
  const competitorCategory =
    product.category === "parfums-homme"
      ? "masculines"
      : product.category === "parfums-femme"
      ? "féminines"
      : "orientales et unisexes";
  const concentrationCompare = concentrationContext(product.concentration);
  const familyCompare = familyContext(family);

  return `Comparé aux autres références ${competitorCategory} disponibles dans le catalogue Maison Numidia, ${product.brand} ${product.name} ${product.concentration} ${product.volume} se positionne dans le segment ${family.toLowerCase()}. ${familyCompare} ${concentrationCompare} Si vous appréciez cette signature olfactive, vous trouverez dans nos collections d'autres parfums proches en termes de famille ou de profil — n'hésitez pas à explorer notre catégorie ${product.category === "parfums-homme" ? "Parfums Homme" : product.category === "parfums-femme" ? "Parfums Femme" : "Parfums Orientaux"} pour découvrir des alternatives complémentaires.`;
}

export function generateFAQ(product: Product): { q: string; a: string }[] {
  const longevity = product.longevity ?? 3;
  const longevityHours =
    longevity >= 5
      ? "10 à 12 heures"
      : longevity === 4
      ? "7 à 9 heures"
      : longevity === 3
      ? "5 à 7 heures"
      : "3 à 5 heures";

  return [
    {
      q: `Quelle est la tenue de ${product.brand} ${product.name} ?`,
      a: `${product.brand} ${product.name} ${product.concentration} offre une tenue de ${longevityHours} environ. La performance varie selon le type de peau (les peaux sèches retiennent moins le parfum), la saison (la chaleur accélère l'évaporation des notes de tête mais intensifie le fond) et la zone d'application (les zones chaudes comme le cou ou les poignets diffusent davantage).`,
    },
    {
      q: `Comment reconnaître un ${product.name} original en Algérie ?`,
      a: `Vérifiez le numéro de lot (batch code) gravé sur le flacon et imprimé sur la boîte — les deux doivent être identiques. Le verre du flacon doit être épais et le spray fluide. L'odeur doit être complexe et évoluer dans le temps : un faux sent souvent l'alcool pur en ouverture et disparaît rapidement. Méfiez-vous des prix trop bas. Chez Maison Numidia, chaque flacon est garanti 100% authentique avec possibilité de refus à la livraison.`,
    },
    {
      q: `Combien coûte ${product.brand} ${product.name} en Algérie ?`,
      a: `${product.brand} ${product.name} ${product.concentration} ${product.volume} est proposé chez Maison Numidia au prix affiché en haut de cette page, en dinar algérien. Ce prix inclut un flacon 100% authentique, importé depuis nos fournisseurs vérifiés. Les frais de livraison Yalidine sont en supplément (à partir de 500 DA selon la wilaya). Aucune carte bancaire n'est requise — vous payez uniquement à la livraison.`,
    },
    {
      q: `Combien de temps pour la livraison en Algérie ?`,
      a: `La livraison est assurée par Yalidine Express dans les 58 wilayas d'Algérie. Pour Alger, Oran, Blida et les grandes villes du nord, comptez 24 à 48 heures après confirmation de la commande. Pour les wilayas plus éloignées (Tamanrasset, Adrar, Tindouf), la livraison prend généralement 48 à 72 heures. Notre équipe vous contacte par téléphone dans les 24 heures pour valider votre commande avant expédition.`,
    },
  ];
}
