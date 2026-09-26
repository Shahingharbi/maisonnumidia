#!/usr/bin/env node
// Sort du lot une fiche dont le TEXTE et la PYRAMIDE se contredisent au point qu'on ne sait
// plus laquelle des deux dit vrai.
//
// Cas rencontré le 26/09/2026 sur deux Dolce & Gabbana de la collection Velvet : la recherche
// avait enregistré trois notes par étage, le rédacteur en citait le double (davana, hysope,
// cannelle, baume de sapin, rose de Turquie, cade pour Exotic Leather ; orange tarocco et
// ciste labdanum pour Patchouli). Les deux agents ont lu la même page Fragrantica, donc l'un
// des deux relevés est tronqué — et on ne peut pas départager sans rouvrir la source, qui est
// fermée aux outils automatiques.
//
// Publier le texte tel quel afficherait une fiche qui se contredit elle-même : la pyramide
// montrerait trois notes, le paragraphe en nommerait huit. Réécrire le texte pour coller à la
// pyramide reviendrait à figer un relevé qu'on soupçonne incomplet. On repart donc de zéro :
// recherche ET texte sont mis de côté, le parfum retourne dans la file.
//
// Usage : node scripts/_catalog-add/ecarter-pyramide-douteuse.mjs <slug-fiche> [...]
import fs from "fs";

const RACINE = "./scripts/_catalog-add";
const REBUT = `${RACINE}/a-rechercher-de-nouveau`;
const slugs = process.argv.slice(2);
if (!slugs.length) { console.error("usage : ecarter-pyramide-douteuse.mjs <slug> [...]"); process.exit(1); }

fs.mkdirSync(REBUT, { recursive: true });

const fiches = JSON.parse(fs.readFileSync(`${RACINE}/fiches.json`, "utf8"));
const restantes = fiches.filter((f) => !slugs.includes(f.slug));

for (const slug of slugs) {
  const fiche = fiches.find((f) => f.slug === slug);
  if (!fiche) { console.log(`  ${slug} : absent de fiches.json`); continue; }

  // Le fichier de recherche porte le slug du candidat, pas toujours celui de la fiche :
  // on le retrouve par le slug qu'il déclare à l'intérieur.
  const recherches = fs.readdirSync(`${RACINE}/research`).filter((f) => f.endsWith(".json"));
  let fichierRecherche = null;
  for (const f of recherches) {
    const r = JSON.parse(fs.readFileSync(`${RACINE}/research/${f}`, "utf8"));
    if (r.slug === slug || r.slugFiche === slug || f === `${slug}.json`) { fichierRecherche = f; break; }
  }

  for (const [dossier, nom] of [["research", fichierRecherche], ["texts", `${slug}.json`]]) {
    if (!nom) continue;
    const src = `${RACINE}/${dossier}/${nom}`;
    if (!fs.existsSync(src)) continue;
    fs.renameSync(src, `${REBUT}/${dossier}--${nom}`);
    console.log(`  déplacé ${dossier}/${nom}`);
  }
  // L'image reste : elle a été téléchargée depuis l'ID Fragrantica, qui n'est pas en cause.
  console.log(`${slug} — écarté du lot, à rechercher de nouveau`);
}

fs.writeFileSync(`${RACINE}/fiches.json`, JSON.stringify(restantes, null, 1));
console.log(`\nfiches.json : ${fiches.length} → ${restantes.length}`);
