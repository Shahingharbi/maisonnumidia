"use client";

// Source unique des commandes côté navigateur : elles viennent de la base,
// pas du localStorage. Les trois associés voient donc la même chose, et la
// liste se rafraîchit toute seule.

import { useCallback, useEffect, useRef, useState } from "react";
import type { CommandeServeur } from "@/lib/tdb/commandes-serveur";

const INTERVALLE_MS = 25000;

export interface EtatCommandes {
  commandes: CommandeServeur[];
  chargement: boolean;
  erreur: string;
  /** Numéros arrivés depuis le dernier chargement, pour le signal visuel et sonore. */
  nouvelles: string[];
  recharger: () => Promise<void>;
  modifier: (id: string, champs: Record<string, unknown>) => Promise<void>;
  marquerVues: () => void;
}

export function useCommandes(): EtatCommandes {
  const [commandes, setCommandes] = useState<CommandeServeur[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [nouvelles, setNouvelles] = useState<string[]>([]);
  const connus = useRef<Set<string> | null>(null);

  const recharger = useCallback(async () => {
    try {
      const r = await fetch("/api/tableau-de-bord/commandes", { cache: "no-store" });
      if (r.status === 401) {
        setErreur("Session expirée, reconnectez-vous.");
        return;
      }
      const data = (await r.json()) as { ok?: boolean; commandes?: CommandeServeur[] };
      const liste = data.commandes ?? [];

      if (connus.current === null) {
        // Premier chargement : rien n'est « nouveau », on mémorise seulement.
        connus.current = new Set(liste.map((c) => c.numero));
      } else {
        const fraiches = liste
          .filter((c) => !connus.current?.has(c.numero))
          .map((c) => c.numero);
        if (fraiches.length) {
          fraiches.forEach((n) => connus.current?.add(n));
          setNouvelles((v) => [...fraiches, ...v]);
        }
      }

      setCommandes(liste);
      setErreur("");
    } catch {
      setErreur("Connexion impossible, nouvel essai dans un instant.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    void recharger();
    const t = setInterval(() => void recharger(), INTERVALLE_MS);
    const auRetour = () => {
      if (document.visibilityState === "visible") void recharger();
    };
    document.addEventListener("visibilitychange", auRetour);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", auRetour);
    };
  }, [recharger]);

  const modifier = useCallback(async (id: string, champs: Record<string, unknown>) => {
    // Affichage immédiat, correction si le serveur refuse.
    setCommandes((v) =>
      v.map((c) => (c.id === id ? ({ ...c, ...champs } as CommandeServeur) : c)),
    );
    try {
      const r = await fetch("/api/tableau-de-bord/commandes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, champs }),
      });
      const data = (await r.json()) as { ok?: boolean; commande?: CommandeServeur };
      if (data.ok && data.commande) {
        const maj = data.commande;
        setCommandes((v) => v.map((c) => (c.id === maj.id ? maj : c)));
      } else {
        await recharger();
      }
    } catch {
      await recharger();
    }
  }, [recharger]);

  const marquerVues = useCallback(() => setNouvelles([]), []);

  return { commandes, chargement, erreur, nouvelles, recharger, modifier, marquerVues };
}
