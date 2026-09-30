import { NextResponse } from "next/server";
import {
  LIEN_FEUILLE,
  SOURCES,
  emailValide,
  inscrire,
  newsletterActive,
  type Source,
} from "@/lib/newsletter";

export const dynamic = "force-dynamic";

/**
 * L'écran d'après-commande et le tableau de bord demandent si les inscriptions sont ouvertes.
 * Le lien de la Sheet n'ouvre rien à un inconnu : Google n'y donne accès qu'au compte de Shahin.
 */
export async function GET() {
  return NextResponse.json({ actif: newsletterActive(), lienFeuille: LIEN_FEUILLE || null });
}

export async function POST(req: Request) {
  if (!newsletterActive()) {
    return NextResponse.json({ ok: false, erreur: "indisponible" }, { status: 503 });
  }

  let email = "";
  let source: Source = "footer";
  let piege = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    if (SOURCES.includes(body?.source)) source = body.source;
    piege = String(body?.site ?? "");
  } catch {
    return NextResponse.json({ ok: false, erreur: "requete" }, { status: 400 });
  }

  // Champ piège invisible pour un humain : un robot le remplit. On lui répond comme à un
  // vrai visiteur pour qu'il ne cherche pas à contourner, et on n'enregistre rien.
  if (piege) return NextResponse.json({ ok: true });

  if (!emailValide(email)) {
    return NextResponse.json({ ok: false, erreur: "format" }, { status: 400 });
  }

  try {
    await inscrire(email, source);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[newsletter]", e);
    return NextResponse.json({ ok: false, erreur: "serveur" }, { status: 502 });
  }
}
