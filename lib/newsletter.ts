// Stockage des abonnés à la newsletter.
//
// Le site n'a pas de base de données : les produits sont dans un JSON, les commandes
// partent par EmailJS, et le tableau de bord garde ses données dans le navigateur de
// Shahin (localStorage). Un email tapé par un visiteur n'avait donc nulle part où
// arriver — le formulaire du footer, affiché depuis le lancement, ne faisait rien.
//
// On utilise Upstash Redis, branché depuis Vercel → Storage → Upstash for Redis.
// L'intégration injecte les variables d'environnement toute seule. On parle à Redis par
// son API HTTP : aucune dépendance à installer.
//
// Structure :
//   nl:abonnes   hash  email → {"date": ISO, "source": "footer" | "page" | "commande"}
//   nl:rl:<ip>   compteur anti-abus, expire au bout de 10 minutes
//
// Fichier réservé au serveur : il lit le jeton Redis, qui ne doit jamais partir dans le
// JavaScript envoyé au navigateur.

import "server-only";

export const SOURCES = ["footer", "page", "commande"] as const;
export type Source = (typeof SOURCES)[number];

export type Abonne = { email: string; date: string; source: Source };

const CLE = "nl:abonnes";

function config(): { url: string; jeton: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const jeton = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && jeton ? { url: url.replace(/\/$/, ""), jeton } : null;
}

/** Vrai quand le stockage est branché. Sans lui, les formulaires ne s'affichent pas. */
export function newsletterActive(): boolean {
  return config() !== null;
}

async function redis(commande: (string | number)[]): Promise<unknown> {
  const c = config();
  if (!c) throw new Error("Stockage newsletter non configuré");
  const r = await fetch(c.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.jeton}`, "Content-Type": "application/json" },
    body: JSON.stringify(commande),
    cache: "no-store",
  });
  const data = (await r.json()) as { result?: unknown; error?: string };
  if (!r.ok || data.error) throw new Error(`Redis : ${data.error || r.status}`);
  return data.result;
}

async function pipeline(commandes: (string | number)[][]): Promise<unknown[]> {
  const c = config();
  if (!c) throw new Error("Stockage newsletter non configuré");
  const r = await fetch(`${c.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.jeton}`, "Content-Type": "application/json" },
    body: JSON.stringify(commandes),
    cache: "no-store",
  });
  const data = (await r.json()) as { result?: unknown; error?: string }[];
  if (!r.ok) throw new Error(`Redis : ${r.status}`);
  return data.map((d) => {
    if (d.error) throw new Error(`Redis : ${d.error}`);
    return d.result;
  });
}

// Assez strict pour écarter les fautes de frappe grossières, assez souple pour ne jamais
// refuser une adresse réelle. La seule vraie validation, c'est l'email qui arrive.
const FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailValide(email: string): boolean {
  return email.length <= 254 && FORMAT.test(email);
}

/**
 * Inscrit un email. Renvoie "nouveau" ou "deja". HSETNX conserve la date et la source
 * de la PREMIÈRE inscription : se réinscrire depuis un autre formulaire n'écrase rien.
 */
export async function inscrire(email: string, source: Source): Promise<"nouveau" | "deja"> {
  const valeur = JSON.stringify({ date: new Date().toISOString(), source });
  const r = await redis(["HSETNX", CLE, email, valeur]);
  return r === 1 ? "nouveau" : "deja";
}

/**
 * Limite à 8 tentatives par tranche de 10 minutes et par visiteur. L'adresse IP n'est
 * pas stockée telle quelle : seule une empreinte courte sert de clé, et elle expire.
 */
export async function tropDeTentatives(ip: string): Promise<boolean> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`nl:${ip}`));
  const empreinte = Array.from(new Uint8Array(buf).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const cle = `nl:rl:${empreinte}`;
  const [compte] = await pipeline([
    ["INCR", cle],
    ["EXPIRE", cle, 600],
  ]);
  return Number(compte) > 8;
}

export async function listerAbonnes(): Promise<Abonne[]> {
  const brut = (await redis(["HGETALL", CLE])) as string[] | null;
  const abonnes: Abonne[] = [];
  for (let i = 0; brut && i < brut.length; i += 2) {
    let date = "";
    let source: Source = "footer";
    try {
      const v = JSON.parse(brut[i + 1]);
      date = String(v.date || "");
      if (SOURCES.includes(v.source)) source = v.source;
    } catch {
      // valeur illisible : on garde l'email, c'est ce qui compte
    }
    abonnes.push({ email: brut[i], date, source });
  }
  return abonnes.sort((a, b) => b.date.localeCompare(a.date));
}

export async function retirerAbonne(email: string): Promise<boolean> {
  return (await redis(["HDEL", CLE, email])) === 1;
}
