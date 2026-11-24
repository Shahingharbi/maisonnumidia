#!/usr/bin/env node
// Fusion de deux doublons signalés par les relecteurs des textes de marque (24/11/2026).
//   node scripts/_catalog-audit/fusion-2026-11-24.mjs           (simulation)
//   node scripts/_catalog-audit/fusion-2026-11-24.mjs --apply
//
// 1. dior-homme-edp (« Dior Homme Intense », 45 impressions en 90 jours) et dior-homme-intense
//    (« Homme Intense », 661 impressions) : même parfum, même EDP 100 ml, mêmes offres concurrentes
//    au rapprochement des prix. On garde dior-homme-intense (l'URL qui reçoit le trafic), avec la
//    pyramide de Fragrantica, qui ne correspondait à aucune des deux fiches :
//    fragrantica.com/perfume/Dior/Dior-Homme-Intense-2011-13016.html
//    (lavande ; iris, ambrette, poire ; cèdre de Virginie, vétiver — François Demachy, 2011).
// 2. guerlain-les-absolus-d-orient-santal-royal et guerlain-santal-royal : même pyramide, même
//    125 ml. Santal Royal est le parfum de la ligne Les Absolus d'Orient (2014) :
//    fragrantica.com/perfume/Guerlain/Les-Absolus-d-Orient-Santal-Royal-28246.html
//    On garde guerlain-santal-royal (124 impressions, requête « santal royal » 210/mois).
// Les 301 sont ajoutées à la main dans next.config.ts (règle n°7).
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const F = "data/products.json";
const cat = JSON.parse(fs.readFileSync(F, "utf8"));
const bySlug = new Map(cat.products.map((p) => [p.slug, p]));

const FUSIONS = [
  { retire: "dior-homme-edp", garde: "dior-homme-intense" },
  { retire: "guerlain-les-absolus-d-orient-santal-royal", garde: "guerlain-santal-royal" },
];

const dhi = bySlug.get("dior-homme-intense");
Object.assign(dhi, {
  notes: { top: ["Lavande"], heart: ["Iris", "Ambrette", "Poire"], base: ["Cèdre de Virginie", "Vétiver"] },
  family: "Floral Boisé Musqué",
  occasions: ["Soirée", "Rendez-vous", "Occasions formelles"],
  shortDescription:
    "Dior Homme Intense est l'eau de parfum de la ligne Dior Homme, signée François Demachy en 2011. La lavande ouvre sur un cœur d'iris, d'ambrette et de poire, posé sur le cèdre de Virginie et le vétiver.",
  description: [
    "Dior Homme Intense est sorti en 2011, signé François Demachy, le parfumeur-créateur de Dior. C'est l'eau de parfum de la ligne Dior Homme, et Fragrantica le range parmi les floraux boisés musqués. Tout tourne autour de l'iris, une matière qu'on croise plus souvent dans les parfums féminins et qui lui donne un caractère poudré, presque cosmétique, devenu sa signature.",
    "La lavande ouvre la composition, brièvement, comme une transition vers le cœur. L'iris y prend toute la place, accompagné de l'ambrette, une graine aux accents musqués, et d'une poire qui l'adoucit sans le rendre fruité. C'est ce trio qu'on reconnaît d'un porteur à l'autre.",
    "Le fond reste sobre : du cèdre de Virginie et du vétiver, deux bois secs qui tiennent l'iris sans l'alourdir. Sur Fragrantica, des porteurs disent y percevoir du cacao ou de l'ambre ; la pyramide publiée ne cite ni l'un ni l'autre.",
    "C'est un parfum d'automne et d'hiver, pour le soir ou une occasion où l'on veut une présence feutrée plutôt qu'un sillage frais. Pour la journée et les mois chauds, [Dior Homme](/parfums/dior-homme), l'eau de toilette de la ligne, est moins concentré, et [Dior Sauvage](/parfums/dior-sauvage) joue un tout autre registre, frais et poivré.",
    "Maison Numidia vend le flacon de 100 ml en eau de parfum, original, livré par Yalidine dans les 69 wilayas et payé à la réception.",
  ].join("\n\n"),
});

let changes = 0;
for (const { retire, garde } of FUSIONS) {
  if (!bySlug.has(retire)) { console.log("déjà retiré :", retire); continue; }
  for (const p of cat.products) {
    if (p.slug === retire || !p.related.includes(retire)) continue;
    const avant = p.related.join(",");
    let rel = p.related.map((r) => (r === retire ? garde : r));
    rel = [...new Set(rel)].filter((r) => r !== p.slug);
    // Compléter à 3 avec un parfum de la même maison si la fusion a fait un doublon
    if (rel.length < 3) {
      const sub = cat.products.find((x) => x.brandSlug === p.brandSlug && x.slug !== p.slug && x.slug !== retire && !rel.includes(x.slug) && x.inStock);
      if (sub) rel.push(sub.slug);
    }
    p.related = rel;
    console.log(`related ${p.slug} : ${avant} → ${rel.join(",")}`);
    changes++;
  }
  cat.products = cat.products.filter((p) => p.slug !== retire);
  console.log(`retiré ${retire} (301 → ${garde})`);
  changes++;
}
console.log(`${changes} changements, ${cat.products.length} produits`);
if (APPLY) { fs.writeFileSync(F, JSON.stringify(cat, null, 2) + "\n"); console.log("écrit", F); }
else console.log("simulation : relancer avec --apply");
