// Vérification de la session du tableau de bord dans les routes API.
// Le middleware ne protège que les pages /tableau-de-bord : les routes
// /api/tableau-de-bord doivent vérifier le cookie elles-mêmes.

import { cookies } from "next/headers";
import { COOKIE_TDB, jetonAttendu, memeJeton } from "./auth";

export async function estConnecte(): Promise<boolean> {
  const jar = await cookies();
  const cookie = jar.get(COOKIE_TDB)?.value;
  return memeJeton(cookie, await jetonAttendu());
}
