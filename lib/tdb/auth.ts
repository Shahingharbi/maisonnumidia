// Authentification du tableau de bord interne.
//
// Le contrôle se fait UNIQUEMENT côté serveur (middleware + route API), donc le
// mot de passe n'est jamais envoyé au navigateur et n'apparaît pas dans le
// bundle JavaScript public. En revanche il est écrit en clair ici : le dépôt
// GitHub doit donc rester PRIVÉ.
//
// Pour changer les identifiants sans toucher au code, définir TDB_USER et
// TDB_PASS dans Vercel → Settings → Environment Variables : elles ont priorité.

const USER_DEFAUT = "Maisonnumidia";
const PASS_DEFAUT = "Blida09";

export const COOKIE_TDB = "mn_tdb";
const SEL = "maison-numidia-tableau-de-bord-v1";

export function utilisateurAttendu(): string {
  return process.env.TDB_USER || USER_DEFAUT;
}

export function motDePasseAttendu(): string {
  return process.env.TDB_PASS || PASS_DEFAUT;
}

/** Empreinte des identifiants, posée en cookie httpOnly après connexion. */
export async function jeton(user: string, pass: string): Promise<string> {
  const data = new TextEncoder().encode(`${user}:${pass}:${SEL}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Jeton attendu, calculé depuis la configuration serveur. */
export async function jetonAttendu(): Promise<string> {
  return jeton(utilisateurAttendu(), motDePasseAttendu());
}

/** Comparaison à temps constant, pour ne pas fuiter le jeton caractère par caractère. */
export function memeJeton(a: string | undefined, b: string | null): boolean {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
