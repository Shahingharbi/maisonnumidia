import { NextResponse } from "next/server";
import { base } from "@/lib/tdb/d1";
import { estConnecte } from "@/lib/tdb/session";
import {
  COLONNES_MODIFIABLES,
  listerCommandes,
  versObjet,
} from "@/lib/tdb/commandes-serveur";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function refuser() {
  return NextResponse.json({ ok: false, erreur: "Non connecté." }, { status: 401 });
}

export async function GET(req: Request) {
  if (!(await estConnecte())) return refuser();
  const db = await base();
  if (!db) return NextResponse.json({ ok: true, commandes: [], baseAbsente: true });
  const demande = Number(new URL(req.url).searchParams.get("limite"));
  const limite = Number.isFinite(demande) && demande > 0 ? Math.min(demande, 1000) : 500;
  const commandes = await listerCommandes(db, limite);
  return NextResponse.json({ ok: true, commandes });
}

export async function PATCH(req: Request) {
  if (!(await estConnecte())) return refuser();
  const db = await base();
  if (!db) {
    return NextResponse.json({ ok: false, erreur: "Base indisponible." }, { status: 503 });
  }

  let corps: { id?: string; champs?: Record<string, unknown> };
  try {
    corps = (await req.json()) as { id?: string; champs?: Record<string, unknown> };
  } catch {
    return NextResponse.json({ ok: false, erreur: "Requête illisible." }, { status: 400 });
  }

  const id = typeof corps.id === "string" ? corps.id : "";
  const champs = corps.champs ?? {};
  if (!id) return NextResponse.json({ ok: false, erreur: "Commande inconnue." }, { status: 400 });

  const colonnes: string[] = [];
  const valeurs: unknown[] = [];
  for (const [cle, valeur] of Object.entries(champs)) {
    const colonne = COLONNES_MODIFIABLES[cle];
    if (!colonne) continue; // on n'écrit que dans les colonnes prévues
    colonnes.push(`${colonne} = ?`);
    valeurs.push(valeur === "" ? null : valeur);
  }
  if (!colonnes.length) {
    return NextResponse.json({ ok: false, erreur: "Rien à modifier." }, { status: 400 });
  }

  colonnes.push("maj_le = ?");
  valeurs.push(new Date().toISOString());
  valeurs.push(id);

  await db
    .prepare(`UPDATE commandes SET ${colonnes.join(", ")} WHERE id = ?`)
    .bind(...valeurs)
    .run();

  const ligne = await db
    .prepare("SELECT * FROM commandes WHERE id = ?")
    .bind(id)
    .first<Record<string, unknown>>();

  return NextResponse.json({ ok: true, commande: ligne ? versObjet(ligne) : null });
}
