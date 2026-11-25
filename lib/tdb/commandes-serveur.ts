// Lecture et écriture des commandes en base, côté serveur uniquement.

import type { D1 } from "./d1";

export interface ArticleCommande {
  slug: string;
  nom: string;
  marque: string;
  image: string;
  prix: number;
  qte: number;
}

export interface CommandeServeur {
  id: string;
  numero: string;
  creeLe: string;
  majLe: string;
  statut: string;
  client: string;
  telephone: string;
  wilaya: string;
  commune: string;
  adresse: string;
  modeLivraison: string;
  noteClient: string;
  articles: ArticleCommande[];
  totalProduits: number;
  fraisLivraison: number;
  total: number;
  quiGere: string;
  remise: number;
  achatFournisseur: number | null;
  fournisseur: string;
  fraisLivraisonPayes: number | null;
  autresFrais: number;
  suivi: string;
  dateEnvoi: string;
  dateLivraison: string;
  dateArgentRecu: string;
  relances: number;
  motif: string;
  noteInterne: string;
  source: string;
}

type Ligne = Record<string, unknown>;

const txt = (v: unknown) => (typeof v === "string" ? v : "");
const nb = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const nbOuNull = (v: unknown) =>
  v === null || v === undefined || v === "" ? null : Number(v);

export function versObjet(l: Ligne): CommandeServeur {
  let articles: ArticleCommande[] = [];
  try {
    const brut = JSON.parse(txt(l.articles) || "[]");
    if (Array.isArray(brut)) articles = brut as ArticleCommande[];
  } catch {
    articles = [];
  }
  return {
    id: txt(l.id),
    numero: txt(l.numero),
    creeLe: txt(l.cree_le),
    majLe: txt(l.maj_le),
    statut: txt(l.statut) || "Nouvelle",
    client: txt(l.client),
    telephone: txt(l.telephone),
    wilaya: txt(l.wilaya),
    commune: txt(l.commune),
    adresse: txt(l.adresse),
    modeLivraison: txt(l.mode_livraison),
    noteClient: txt(l.note_client),
    articles,
    totalProduits: nb(l.total_produits),
    fraisLivraison: nb(l.frais_livraison),
    total: nb(l.total),
    quiGere: txt(l.qui_gere),
    remise: nb(l.remise),
    achatFournisseur: nbOuNull(l.achat_fournisseur),
    fournisseur: txt(l.fournisseur),
    fraisLivraisonPayes: nbOuNull(l.frais_livraison_payes),
    autresFrais: nb(l.autres_frais),
    suivi: txt(l.suivi),
    dateEnvoi: txt(l.date_envoi),
    dateLivraison: txt(l.date_livraison),
    dateArgentRecu: txt(l.date_argent_recu),
    relances: nb(l.relances),
    motif: txt(l.motif),
    noteInterne: txt(l.note_interne),
    source: txt(l.source),
  };
}

/** MN-AAMMJJ-001, le compteur repart à 1 chaque jour. Court, dictable au téléphone. */
export async function prochainNumero(db: D1, maintenant: Date): Promise<string> {
  const p = (n: number) => String(n).padStart(2, "0");
  const jour = `${p(maintenant.getFullYear() % 100)}${p(maintenant.getMonth() + 1)}${p(maintenant.getDate())}`;
  const r = await db
    .prepare("SELECT COUNT(*) AS n FROM commandes WHERE numero LIKE ?")
    .bind(`MN-${jour}-%`)
    .first<{ n: number }>();
  const rang = (r?.n ?? 0) + 1;
  return `MN-${jour}-${String(rang).padStart(3, "0")}`;
}

export const COLONNES_MODIFIABLES: Record<string, string> = {
  statut: "statut",
  quiGere: "qui_gere",
  remise: "remise",
  achatFournisseur: "achat_fournisseur",
  fournisseur: "fournisseur",
  fraisLivraisonPayes: "frais_livraison_payes",
  autresFrais: "autres_frais",
  suivi: "suivi",
  dateEnvoi: "date_envoi",
  dateLivraison: "date_livraison",
  dateArgentRecu: "date_argent_recu",
  relances: "relances",
  motif: "motif",
  noteInterne: "note_interne",
  modeLivraison: "mode_livraison",
  commune: "commune",
  adresse: "adresse",
  wilaya: "wilaya",
  client: "client",
  telephone: "telephone",
  source: "source",
};

export async function listerCommandes(db: D1, limite = 500): Promise<CommandeServeur[]> {
  const r = await db
    .prepare("SELECT * FROM commandes ORDER BY cree_le DESC LIMIT ?")
    .bind(limite)
    .all<Ligne>();
  return (r.results ?? []).map(versObjet);
}
