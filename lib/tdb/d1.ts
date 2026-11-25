// Accès à la base D1 des commandes depuis les routes serveur.
//
// Le site tourne sur Cloudflare Workers (adaptateur OpenNext) : la base est
// attachée au Worker sous le nom « DB » dans wrangler.jsonc. Rien à installer,
// rien à payer, elle vit dans le même compte Cloudflare que le site.

import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface D1Resultat<T> {
  results: T[];
}

export interface D1Requete {
  bind(...valeurs: unknown[]): D1Requete;
  all<T = Record<string, unknown>>(): Promise<D1Resultat<T>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}

export interface D1 {
  prepare(sql: string): D1Requete;
  batch(requetes: D1Requete[]): Promise<unknown>;
}

/**
 * Renvoie la base, ou null si elle n'est pas attachée (développement local sans
 * `wrangler dev`, par exemple). L'appelant doit gérer ce cas plutôt que planter :
 * une commande ne doit jamais être perdue à cause d'un problème de configuration.
 */
export async function base(): Promise<D1 | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as unknown as { DB?: D1 }).DB;
    return db ?? null;
  } catch {
    return null;
  }
}
