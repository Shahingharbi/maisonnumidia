import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_TDB, jetonAttendu, memeJeton } from "@/lib/tdb/auth";

// Protège /tableau-de-bord. Le contrôle est fait sur le serveur : le mot de
// passe n'est jamais envoyé au navigateur, contrairement à un verrou en
// JavaScript côté client qui se contourne en dix secondes.

export const config = {
  matcher: ["/tableau-de-bord/:path*"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // La page de connexion doit rester accessible.
  if (pathname.startsWith("/tableau-de-bord/connexion")) {
    return NextResponse.next();
  }

  const attendu = await jetonAttendu();
  const cookie = req.cookies.get(COOKIE_TDB)?.value;

  if (memeJeton(cookie, attendu)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/tableau-de-bord/connexion";
  url.search = attendu ? "" : "?config=manquante";
  return NextResponse.redirect(url);
}
