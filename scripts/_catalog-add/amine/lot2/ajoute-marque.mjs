#!/usr/bin/env node
// Stock Amine, lot 2 : crée la maison Eau Jeune dans brands[] (pour la fiche Double Je).
// SIMULATION par défaut, --apply pour écrire. Mêmes contrôles que scripts/_catalog-add/apply-marques.mjs,
// qu'on ne lance pas ici : il créerait aussi les maisons en attente de la vague 2.
import fs from "fs";

const APPLY = process.argv.includes("--apply");
const chemin = "./data/products.json";
const d = JSON.parse(fs.readFileSync(chemin, "utf8"));
const r = JSON.parse(fs.readFileSync("./scripts/_catalog-add/amine/marques/eau-jeune.json", "utf8"));

if (d.brands.some((b) => b.slug === r.slug)) { console.log("déjà présente :", r.slug); process.exit(0); }
const mots = r.description.split(/\s+/).filter(Boolean).length;
if (mots < 25 || mots > 90) throw new Error(`description ${mots} mots`);
if (r.confiance === "basse" && /\b(19|20)\d{2}\b/.test(r.description)) throw new Error("confiance basse mais une année est affirmée");
if (/\b(incontournable|legendaire|légendaire|mythique|le meilleur|la meilleure|numero un|numéro un)\b/i.test(r.description)) throw new Error("superlatif publicitaire");

const entree = { slug: r.slug, name: r.nom, origin: r.origine || "Non documenté", featured: false, description: r.description.trim() };
console.log((APPLY ? "APPLIQUÉ" : "SIMULATION") + " — marque créée :", JSON.stringify(entree));
if (APPLY) {
  d.brands.push(entree);
  d.brands.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  fs.writeFileSync(chemin, JSON.stringify(d, null, 2) + "\n");
}
