#!/usr/bin/env node
// Corrige les h1, en s'appuyant sur les requêtes réelles de chaque fiche.
// SIMULATION par défaut, --apply pour écrire dans data/products.json.
//
// Trois corrections seulement, chacune justifiée par la donnée :
//   A. « Parfum Oriental » -> « Parfum {Genre} » : sur les 35 fiches concernées, le mot
//      « oriental » n'apparaît dans AUCUNE impression. Le genre, lui, est tapé.
//   B. h1 sans le mot « Parfum » : on le remet, c'est le mot-clé de tête du site.
//   C. h1 qui omet un terme du nom que les gens tapent vraiment (« juicy apple » pèse
//      587 impressions sur la fiche Kayali, absent du h1) : on complète.
//
// Ce qu'on NE touche PAS : la forme de la marque. Les données montrent qu'elle varie selon
// la maison — « Armani » est tapé 6 fois plus que « Giorgio Armani », « Rabanne » 869 fois
// contre 0 pour « Paco Rabanne ». Un gabarit unique dégraderait ces h1.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const chemin = "./data/products.json";
const d = JSON.parse(fs.readFileSync(chemin, "utf8"));
const rp = JSON.parse(fs.readFileSync("./scripts/_gsc/data/requete-page.json", "utf8"));

const COMB = /[̀-ͯ]/g;
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(COMB, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const parFiche = new Map();
for (const r of rp) {
  const m = r.keys[1].match(/\/parfums\/([a-z0-9-]+)/);
  if (!m) continue;
  if (!parFiche.has(m[1])) parFiche.set(m[1], []);
  parFiche.get(m[1]).push({ q: norm(r.keys[0]), imp: r.impressions });
}

const G = { homme: "Homme", femme: "Femme", unisexe: "Mixte" };
const OUTILS = new Set(["de", "du", "des", "le", "la", "les", "l", "d", "pour", "the", "of", "by", "et", "a", "in", "01", "02", "03"]);

const changements = [];
for (const p of d.products) {
  const h1 = p.h1 || "";
  let nouveau = h1;
  const raisons = [];

  // A — « Parfum Oriental » ne capte rien : on remet le genre.
  if (/\bParfum Oriental\b/i.test(nouveau)) {
    nouveau = nouveau.replace(/\bParfum Oriental\b/i, `Parfum ${G[p.gender]}`);
    raisons.push("« Parfum Oriental » -> genre (0 impression sur « oriental »)");
  }

  // B — le mot « Parfum » manque.
  if (!/\bParfum\b/i.test(nouveau)) {
    nouveau = nouveau.replace(/\s*Alg[ée]rie\s*$/i, "").trim();
    if (!new RegExp(`\\b(${Object.values(G).join("|")})\\b`, "i").test(nouveau)) {
      nouveau = `${nouveau} Parfum ${G[p.gender]} Algérie`;
    } else {
      nouveau = `${nouveau.replace(new RegExp(`\\s*\\b(${Object.values(G).join("|")})\\b\\s*$`, "i"), "")} Parfum ${G[p.gender]} Algérie`;
    }
    raisons.push("mot « Parfum » absent");
  }

  // C — terme du nom absent du h1 alors qu'il est tapé.
  const reqs = parFiche.get(p.slug) || [];
  if (reqs.length) {
    const h1n = norm(nouveau);
    const manquants = norm(p.name)
      .split(" ")
      .filter((t) => t && t.length > 2 && !OUTILS.has(t) && !h1n.includes(t));
    const tapes = manquants.filter((t) => {
      const imp = reqs.filter((r) => r.q.includes(t)).reduce((s, r) => s + r.imp, 0);
      return imp >= 30;
    });
    if (tapes.length) {
      // On insère le nom complet à la place du nom partiel, sans toucher à la marque.
      const avant = nouveau.replace(/\s*Parfum\s+(Homme|Femme|Mixte)\s+Alg[ée]rie\s*$/i, "").trim();
      // Le numero de serie du nom officiel (Kayali « Eden Juicy Apple 01 ») n'est jamais
      // tape : il reste dans le champ `name` mais n'a rien a faire dans le h1.
      const sansNumero = (t) => {
        const mots = t.replace("|", " ").trim().split(/\s+/);
        const dernier = mots[mots.length - 1] || "";
        const estNumero = dernier.length > 0 && dernier.length <= 2 && [...dernier].every((c) => "0123456789".includes(c));
        return (estNumero ? mots.slice(0, -1) : mots).join(" ");
      };
      const nomComplet = sansNumero(p.name);
      const base = norm(avant).includes(norm(p.brand))
        ? `${p.brand} ${nomComplet}`
        : `${avant} ${tapes.join(" ")}`;
      const candidat = `${base} Parfum ${G[p.gender]} Algérie`.replace(/\s+/g, " ");
      if (candidat.length <= 75) {
        nouveau = candidat;
        raisons.push(`terme tapé absent du h1 : ${tapes.join(", ")}`);
      }
    }
  }

  if (nouveau !== h1 && nouveau.trim()) {
    const imp = reqs.reduce((s, r) => s + r.imp, 0);
    changements.push({ slug: p.slug, avant: h1, apres: nouveau, imp, raisons });
    if (APPLY) p.h1 = nouveau;
  }
}

if (APPLY) fs.writeFileSync(chemin, JSON.stringify(d, null, 2) + "\n");

changements.sort((a, b) => b.imp - a.imp);
console.log(`${APPLY ? "APPLIQUÉ" : "SIMULATION"} — ${changements.length} h1 corrigés`);
const parRaison = {};
changements.forEach((c) => c.raisons.forEach((r) => {
  const cle = r.split(" :")[0];
  parRaison[cle] = (parRaison[cle] || 0) + 1;
}));
console.log("motifs :", parRaison);
console.log("\n15 plus vus :");
changements.slice(0, 15).forEach((c) => {
  console.log(`  ${String(c.imp).padStart(5)} imp.  ${c.slug}`);
  console.log(`         avant : ${c.avant}`);
  console.log(`         après : ${c.apres}`);
});
fs.writeFileSync("./scripts/_gsc/h1-changements.json", JSON.stringify(changements, null, 1));
