import { NextResponse } from "next/server";
import { base } from "@/lib/tdb/d1";
import { prochainNumero, type ArticleCommande } from "@/lib/tdb/commandes-serveur";
import { notifierNouvelleCommande } from "@/lib/tdb/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Enregistre la commande AVANT tout envoi de mail. Si la notification échoue,
// la commande existe quand même et apparaît dans le tableau de bord.

interface Entree {
  client?: string;
  telephone?: string;
  wilaya?: string;
  commune?: string;
  adresse?: string;
  modeLivraison?: string;
  noteClient?: string;
  fraisLivraison?: number;
  source?: string;
  articles?: ArticleCommande[];
}

function nettoyer(v: unknown, max = 300): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  let entree: Entree;
  try {
    entree = (await req.json()) as Entree;
  } catch {
    return NextResponse.json({ ok: false, erreur: "Requête illisible." }, { status: 400 });
  }

  const client = nettoyer(entree.client, 120);
  const telephone = nettoyer(entree.telephone, 30);
  const articles = Array.isArray(entree.articles) ? entree.articles.slice(0, 30) : [];

  if (!client || !telephone || articles.length === 0) {
    return NextResponse.json(
      { ok: false, erreur: "Nom, téléphone et panier sont obligatoires." },
      { status: 400 },
    );
  }

  const propres: ArticleCommande[] = articles.map((a) => ({
    slug: nettoyer(a?.slug, 120),
    nom: nettoyer(a?.nom, 160),
    marque: nettoyer(a?.marque, 80),
    image: nettoyer(a?.image, 300),
    prix: Math.max(0, Math.round(Number(a?.prix) || 0)),
    qte: Math.min(50, Math.max(1, Math.round(Number(a?.qte) || 1))),
  }));

  const totalProduits = propres.reduce((t, a) => t + a.prix * a.qte, 0);
  const fraisLivraison = Math.max(0, Math.round(Number(entree.fraisLivraison) || 0));
  const total = totalProduits + fraisLivraison;

  const db = await base();
  if (!db) {
    // Pas de base disponible : on le dit au client pour qu'il bascule sur le
    // canal de secours, plutôt que de faire croire que la commande est passée.
    return NextResponse.json(
      { ok: false, erreur: "Base indisponible." },
      { status: 503 },
    );
  }

  const maintenant = new Date();
  const iso = maintenant.toISOString();
  const id = crypto.randomUUID();

  let numero = await prochainNumero(db, maintenant);
  const enregistrer = async (num: string) =>
    db
      .prepare(
        `INSERT INTO commandes (
          id, numero, cree_le, maj_le, statut,
          client, telephone, wilaya, commune, adresse, mode_livraison, note_client,
          articles, total_produits, frais_livraison, total, source
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .bind(
        id,
        num,
        iso,
        iso,
        "Nouvelle",
        client,
        telephone,
        nettoyer(entree.wilaya, 60),
        nettoyer(entree.commune, 120),
        nettoyer(entree.adresse, 400),
        nettoyer(entree.modeLivraison, 40),
        nettoyer(entree.noteClient, 1000),
        JSON.stringify(propres),
        totalProduits,
        fraisLivraison,
        total,
        nettoyer(entree.source, 60) || "Site",
      )
      .run();

  try {
    await enregistrer(numero);
  } catch {
    // Collision de numéro (deux commandes à la même seconde) : on en reprend un.
    numero = `${numero}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    try {
      await enregistrer(numero);
    } catch {
      return NextResponse.json(
        { ok: false, erreur: "Enregistrement impossible." },
        { status: 500 },
      );
    }
  }

  // La notification ne doit jamais faire échouer la commande.
  let mailEnvoye = false;
  try {
    const r = await notifierNouvelleCommande({
      numero,
      client,
      telephone,
      wilaya: nettoyer(entree.wilaya, 60),
      commune: nettoyer(entree.commune, 120),
      adresse: nettoyer(entree.adresse, 400),
      modeLivraison: nettoyer(entree.modeLivraison, 40),
      noteClient: nettoyer(entree.noteClient, 1000),
      articles: propres,
      totalProduits,
      fraisLivraison,
      total,
    });
    mailEnvoye = r.mailEnvoye;
  } catch {
    // silencieux côté client, la commande est déjà sauvée
  }

  // mailEnvoye dit au site s'il doit déclencher le canal de secours EmailJS,
  // pour que le vendeur reçoive exactement un mail par commande, jamais zéro.
  return NextResponse.json({ ok: true, numero, mailEnvoye });
}
