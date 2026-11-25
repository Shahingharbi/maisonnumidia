import { NextResponse } from "next/server";
import { base } from "@/lib/tdb/d1";
import { estConnecte } from "@/lib/tdb/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Clé publique à donner au navigateur pour qu'il crée un abonnement. */
export async function GET() {
  if (!(await estConnecte())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const cle = process.env.VAPID_PUBLIC_KEY ?? "";
  return NextResponse.json({ ok: true, clePublique: cle, actif: Boolean(cle) });
}

/** Enregistre l'appareil. Appelé après que l'utilisateur a accepté les notifications. */
export async function POST(req: Request) {
  if (!(await estConnecte())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = await base();
  if (!db) return NextResponse.json({ ok: false, erreur: "Base indisponible." }, { status: 503 });

  let corps: {
    endpoint?: string;
    cles?: { p256dh?: string; auth?: string };
    appareil?: string;
  };
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erreur: "Requête illisible." }, { status: 400 });
  }

  const endpoint = typeof corps.endpoint === "string" ? corps.endpoint : "";
  const p256dh = corps.cles?.p256dh ?? "";
  const auth = corps.cles?.auth ?? "";
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ ok: false, erreur: "Abonnement incomplet." }, { status: 400 });
  }

  await db
    .prepare(
      `INSERT INTO abonnes_push (id, endpoint, p256dh, auth, appareil, cree_le)
       VALUES (?,?,?,?,?,?)
       ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth`,
    )
    .bind(
      crypto.randomUUID(),
      endpoint,
      p256dh,
      auth,
      (corps.appareil ?? "").slice(0, 120),
      new Date().toISOString(),
    )
    .run();

  return NextResponse.json({ ok: true });
}

/** Retire l'appareil (bouton « ne plus me notifier sur ce téléphone »). */
export async function DELETE(req: Request) {
  if (!(await estConnecte())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const db = await base();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });

  let endpoint = "";
  try {
    const corps = (await req.json()) as { endpoint?: string };
    endpoint = corps.endpoint ?? "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (endpoint) {
    await db.prepare("DELETE FROM abonnes_push WHERE endpoint = ?").bind(endpoint).run();
  }
  return NextResponse.json({ ok: true });
}
