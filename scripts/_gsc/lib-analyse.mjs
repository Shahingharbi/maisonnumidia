// Outils communs aux analyses Search Console : chargement des extractions de pull-analyse.mjs
// (scripts/_gsc/brut/), typage des URL, rapprochement avec le catalogue.
//
//   import { pages, requetes, rp, typePage, produits } from "./lib-analyse.mjs";
//
// Périodes : A = 90 derniers jours, B = 90 jours d'avant, C = 28 derniers jours, D = 28 jours d'avant.
import fs from "fs";

const ici = (rel) => new URL(rel, import.meta.url);
export const charger = (nom) => JSON.parse(fs.readFileSync(ici(`./brut/${nom}.json`), "utf8"));
export const resume = charger("_resume");

export const catalogue = JSON.parse(fs.readFileSync(ici("../../data/products.json"), "utf8"));
export const produits = new Map(catalogue.products.map((p) => [p.slug, p]));
export const marques = new Map(catalogue.brands.map((b) => [b.slug, b]));

/** "/parfums/dior-sauvage" : sans domaine, sans barre finale, sans paramètres. */
export function chemin(url) {
  const u = new URL(url);
  return u.pathname.replace(/\/+$/, "") || "/";
}
export const estWww = (url) => new URL(url).hostname.startsWith("www.");

const MERES = new Set(["/parfums-homme", "/parfums-femme", "/parfums-orientaux"]);
/** accueil | produit | mere | fille | marque | marques-index | blog | blog-index | autre */
export function typePage(url) {
  const c = chemin(url);
  if (c === "/") return "accueil";
  if (MERES.has(c)) return "mere";
  const [, a, b, reste] = c.split("/");
  if (reste !== undefined) return "autre";
  if (a === "parfums" && b) return "produit";
  if (MERES.has("/" + a) && b) return "fille";
  if (a === "marques") return b ? "marque" : "marques-index";
  if (a === "blog") return b ? "blog" : "blog-index";
  return "autre";
}
/** Le produit du catalogue derrière une URL de fiche, ou undefined (fiche supprimée, redirigée). */
export const produitDe = (url) => (typePage(url) === "produit" ? produits.get(chemin(url).split("/")[2]) : undefined);

const ligne = (r) => ({ clics: r.clicks, imp: r.impressions, ctr: r.ctr, pos: r.position });
/** Lignes par page. Données COMPLÈTES (toutes les requêtes, anonymisées comprises). */
export const pages = (periode) =>
  charger(`pages-${periode}`).map((r) => ({ url: r.keys[0], chemin: chemin(r.keys[0]), type: typePage(r.keys[0]), ...ligne(r) }));
/** Lignes par requête. ÉCHANTILLON : Google masque les requêtes rares (voir CONTEXTE.md). */
export const requetes = (periode) => charger(`requetes-${periode}`).map((r) => ({ requete: r.keys[0], ...ligne(r) }));
/** Lignes requête × page. Même échantillon que requetes(). */
export const rp = (periode) =>
  charger(`rp-${periode}`).map((r) => ({ requete: r.keys[0], url: r.keys[1], chemin: chemin(r.keys[1]), type: typePage(r.keys[1]), ...ligne(r) }));
/** Courbe quotidienne : "" pour tout le site, sinon accueil | produit | mere | fille | marque | blog. */
export const jours = (type = "") =>
  charger(type ? `jours-${type}` : "jours").map((r) => ({ date: r.keys[0], ...ligne(r) }));

/** Sans accents ni ponctuation, en minuscules : pour comparer une requête à un nom de parfum. */
export const normaliser = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9؀-ۿ]+/g, " ").trim();

/** Somme pondérée correcte d'un groupe de lignes (la position se pondère par les impressions). */
export function somme(lignes) {
  const clics = lignes.reduce((s, l) => s + l.clics, 0);
  const imp = lignes.reduce((s, l) => s + l.imp, 0);
  const pos = imp ? lignes.reduce((s, l) => s + l.pos * l.imp, 0) / imp : 0;
  return { clics, imp, ctr: imp ? clics / imp : 0, pos };
}
