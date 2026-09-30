import { NextResponse } from "next/server";
import { emailValide, inscrire, newsletterActive, numeroListe } from "@/lib/newsletter";
import { creerLimite } from "@/lib/limite-debit";

export const dynamic = "force-dynamic";

// 8 tentatives par tranche de 10 minutes et par adresse IP (voir lib/limite-debit.ts).
const tropDeTentatives = creerLimite(8, 10 * 60 * 1000);

/** L'écran d'après-commande et le tableau de bord demandent si les inscriptions sont ouvertes. */
export async function GET() {
  return NextResponse.json({ actif: newsletterActive(), liste: numeroListe() });
}

export async function POST(req: Request) {
  if (!newsletterActive()) {
    return NextResponse.json({ ok: false, erreur: "indisponible" }, { status: 503 });
  }

  // Le formulaire envoie aussi `source` (footer, pop-up, page, commande). La transmettre
  // demanderait de créer d'abord un attribut dans le compte Brevo : on s'en passe.
  let email = "";
  let piege = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
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

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "inconnu";
  if (tropDeTentatives(ip)) {
    return NextResponse.json({ ok: false, erreur: "trop" }, { status: 429 });
  }

  try {
    await inscrire(email);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[newsletter]", e);
    return NextResponse.json({ ok: false, erreur: "serveur" }, { status: 502 });
  }
}
