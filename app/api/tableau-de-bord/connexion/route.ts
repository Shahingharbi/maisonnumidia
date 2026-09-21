import { NextResponse } from "next/server";
import {
  COOKIE_TDB,
  jetonAttendu,
  motDePasseAttendu,
  utilisateurAttendu,
} from "@/lib/tdb/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let identifiant = "";
  let motDePasse = "";
  try {
    const body = await req.json();
    identifiant = String(body?.identifiant ?? "");
    motDePasse = String(body?.motDePasse ?? "");
  } catch {
    return NextResponse.json({ ok: false, erreur: "Requête invalide." }, { status: 400 });
  }

  const bon =
    identifiant.trim().toLowerCase() === utilisateurAttendu().toLowerCase() &&
    motDePasse === motDePasseAttendu();

  if (!bon) {
    // Petite temporisation : rend le forçage par essais successifs pénible.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json(
      { ok: false, erreur: "Identifiant ou mot de passe incorrect." },
      { status: 401 },
    );
  }

  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.set({
    name: COOKIE_TDB,
    value: await jetonAttendu(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return reponse;
}
