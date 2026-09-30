import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_TDB, jetonAttendu, memeJeton } from "@/lib/tdb/auth";
import { listerAbonnes, newsletterActive, retirerAbonne } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

// Liste des abonnés : des adresses email de clients, donc des données personnelles.
//
// Deux verrous, et le second compte autant que le premier :
//
// 1. Le cookie de session du tableau de bord. Le middleware ne protège que les pages
//    /tableau-de-bord/*, pas /api/* : la vérification doit être refaite ici.
//
// 2. Un mot de passe DÉFINI DANS VERCEL (TDB_PASS). Le dépôt GitHub est public, et
//    lib/tdb/auth.ts contient un mot de passe par défaut écrit en clair. Tant que le
//    tableau de bord ne montrait que les données stockées dans le navigateur de Shahin,
//    ce mot de passe public ne donnait accès à rien. La liste des abonnés, elle, vit sur
//    le serveur : avec le mot de passe par défaut, n'importe quel lecteur du dépôt
//    pourrait la télécharger. On refuse donc de la servir tant qu'il n'a pas été remplacé.

async function refus(req: NextRequest) {
  if (!memeJeton(req.cookies.get(COOKIE_TDB)?.value, await jetonAttendu())) {
    return NextResponse.json({ ok: false, raison: "auth" }, { status: 401 });
  }
  if (!process.env.TDB_PASS) {
    return NextResponse.json({ ok: false, raison: "mdp" }, { status: 403 });
  }
  if (!newsletterActive()) {
    return NextResponse.json({ ok: false, raison: "config" }, { status: 503 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const r = await refus(req);
  if (r) return r;
  try {
    const abonnes = await listerAbonnes();
    return NextResponse.json({ ok: true, abonnes });
  } catch (e) {
    console.error("[newsletter liste]", e);
    return NextResponse.json({ ok: false, raison: "serveur" }, { status: 500 });
  }
}

/** Retire une adresse : demande de désinscription, doublon, faute de frappe. */
export async function DELETE(req: NextRequest) {
  const r = await refus(req);
  if (r) return r;
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!email) return NextResponse.json({ ok: false, raison: "email" }, { status: 400 });
  try {
    return NextResponse.json({ ok: await retirerAbonne(email) });
  } catch (e) {
    console.error("[newsletter retrait]", e);
    return NextResponse.json({ ok: false, raison: "serveur" }, { status: 500 });
  }
}
