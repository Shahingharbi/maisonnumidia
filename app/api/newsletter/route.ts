import { NextResponse } from "next/server";
import {
  SOURCES,
  emailValide,
  inscrire,
  newsletterActive,
  tropDeTentatives,
  type Source,
} from "@/lib/newsletter";

export const dynamic = "force-dynamic";

/** Le formulaire d'après-commande demande d'abord si les inscriptions sont ouvertes. */
export async function GET() {
  return NextResponse.json({ actif: newsletterActive() });
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
  if (piege) return NextResponse.json({ ok: true, deja: false });

  if (!emailValide(email)) {
    return NextResponse.json({ ok: false, erreur: "format" }, { status: 400 });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
    if (await tropDeTentatives(ip)) {
      return NextResponse.json({ ok: false, erreur: "trop" }, { status: 429 });
    }
    const r = await inscrire(email, source);
    return NextResponse.json({ ok: true, deja: r === "deja" });
  } catch (e) {
    console.error("[newsletter]", e);
    return NextResponse.json({ ok: false, erreur: "serveur" }, { status: 500 });
  }
}
