// Notifications sur les téléphones, sans application à installer.
//
// Le tableau de bord s'ajoute à l'écran d'accueil et demande l'autorisation une
// fois. Ensuite le serveur envoie une notification « vide » (un simple réveil) :
// c'est le service worker du téléphone qui va chercher la commande et affiche le
// texte. Envoyer un réveil sans contenu évite tout le chiffrement de charge utile
// et reste parfaitement fiable.

import type { D1 } from "./d1";

const base64url = (buf: ArrayBuffer | Uint8Array): string => {
  const octets = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = "";
  for (const o of octets) bin += String.fromCharCode(o);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const depuisBase64url = (s: string): Uint8Array => {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "="));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

async function cleSignature(cleePriveeB64: string): Promise<CryptoKey> {
  // La clé privée VAPID est stockée au format JWK (d/x/y) encodé en base64url.
  const jwk = JSON.parse(new TextDecoder().decode(depuisBase64url(cleePriveeB64)));
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

/** Jeton VAPID signé pour une origine de serveur push donnée. */
async function jetonVapid(
  origine: string,
  sujet: string,
  clePrivee: string,
): Promise<string> {
  const entete = base64url(new TextEncoder().encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const corps = base64url(
    new TextEncoder().encode(
      JSON.stringify({
        aud: origine,
        exp: Math.floor(Date.now() / 1000) + 12 * 3600,
        sub: sujet,
      }),
    ),
  );
  const aSigner = new TextEncoder().encode(`${entete}.${corps}`);
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    await cleSignature(clePrivee),
    aSigner,
  );
  return `${entete}.${corps}.${base64url(signature)}`;
}

export interface Abonne {
  id: string;
  endpoint: string;
}

/**
 * Réveille tous les téléphones abonnés. Un abonnement refusé (404/410) veut dire
 * que l'appareil a désinstallé ou refusé : on le retire pour ne pas le rappeler
 * indéfiniment.
 */
export async function reveillerAbonnes(db: D1): Promise<{ envoyes: number; retires: number }> {
  const clePrivee = process.env.VAPID_PRIVATE_KEY;
  const clePublique = process.env.VAPID_PUBLIC_KEY;
  const sujet = process.env.VAPID_SUBJECT || "mailto:contact@maisonnumidia.store";
  if (!clePrivee || !clePublique) return { envoyes: 0, retires: 0 };

  const r = await db.prepare("SELECT id, endpoint FROM abonnes_push").all<Abonne>();
  const abonnes = r.results ?? [];
  let envoyes = 0;
  const aRetirer: string[] = [];

  await Promise.all(
    abonnes.map(async (a) => {
      try {
        const origine = new URL(a.endpoint).origin;
        const jeton = await jetonVapid(origine, sujet, clePrivee);
        const reponse = await fetch(a.endpoint, {
          method: "POST",
          headers: {
            TTL: "86400",
            Urgency: "high",
            Authorization: `vapid t=${jeton}, k=${clePublique}`,
          },
        });
        if (reponse.status === 404 || reponse.status === 410) {
          aRetirer.push(a.id);
        } else if (reponse.ok || reponse.status === 201) {
          envoyes += 1;
        }
      } catch {
        // un téléphone injoignable ne doit pas bloquer les autres
      }
    }),
  );

  for (const id of aRetirer) {
    try {
      await db.prepare("DELETE FROM abonnes_push WHERE id = ?").bind(id).run();
    } catch {
      // sans conséquence
    }
  }

  return { envoyes, retires: aRetirer.length };
}
