"use client";

import { useEffect, useState } from "react";
import FormulaireNewsletter from "./FormulaireNewsletter";

/**
 * Proposé sur l'écran « Commande envoyée ». C'est le moment où le client a le plus
 * confiance : il vient d'acheter. Mais la confirmation de commande reste la priorité,
 * d'où un bloc discret, sous le message principal, et absent quand la commande doit
 * encore être confirmée sur WhatsApp (voir app/commander/page.tsx).
 *
 * Le formulaire de commande ne demande pas d'email : l'inscription se fait par un champ
 * dédié, jamais par une case pré-cochée.
 */
export default function BlocNewsletterCommande() {
  const [actif, setActif] = useState(false);

  useEffect(() => {
    let annule = false;
    fetch("/api/newsletter")
      .then((r) => r.json())
      .then((d) => { if (!annule) setActif(Boolean(d.actif)); })
      .catch(() => {});
    return () => { annule = true; };
  }, []);

  if (!actif) return null;

  return (
    <div className="bg-white border border-[#E9E9E4] rounded-lg px-5 py-5 mb-4">
      <p className="text-[14px] font-semibold text-[#111111]">Envie d&apos;être prévenu en premier ?</p>
      <p className="text-[13px] text-gray-500 mt-1 mb-4 leading-relaxed">
        Nouveaux arrivages, retours en stock et offres réservées aux abonnés.
      </p>
      <FormulaireNewsletter source="commande" variante="carte" />
    </div>
  );
}
