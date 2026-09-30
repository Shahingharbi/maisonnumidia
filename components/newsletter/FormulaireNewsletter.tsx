"use client";

import { useId, useState } from "react";

type Source = "footer" | "page" | "commande";
type Etat = "repos" | "envoi" | "ok" | "deja" | "erreur";

const MESSAGES_ERREUR: Record<string, string> = {
  format: "Cette adresse email ne semble pas valide.",
  trop: "Trop de tentatives. Réessayez dans quelques minutes.",
  indisponible: "Les inscriptions sont momentanément fermées.",
};

/**
 * Formulaire d'inscription à la newsletter, en trois habillages :
 *  - "footer" : reprend exactement le bloc d'origine du pied de page (champ souligné, « Valider ») ;
 *  - "page"   : la page /newsletter ;
 *  - "carte"  : l'écran de confirmation de commande.
 */
export default function FormulaireNewsletter({
  source,
  variante = source === "footer" ? "footer" : "page",
}: {
  source: Source;
  variante?: "footer" | "page" | "carte";
}) {
  const [email, setEmail] = useState("");
  const [site, setSite] = useState(""); // champ piège anti-robots, invisible
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");
  const id = useId();

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etat === "envoi") return;
    setEtat("envoi");
    setErreur("");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, site }),
      });
      const data = await r.json().catch(() => ({}));
      if (data.ok) {
        setEtat(data.deja ? "deja" : "ok");
        return;
      }
      setErreur(MESSAGES_ERREUR[data.erreur] || "Une erreur est survenue. Réessayez.");
      setEtat("erreur");
    } catch {
      setErreur("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setEtat("erreur");
    }
  }

  const footer = variante === "footer";

  if (etat === "ok" || etat === "deja") {
    return (
      <p
        role="status"
        className={footer ? "text-sm text-[#535359] py-2" : "text-[14px] text-[#111111] py-2"}
      >
        {etat === "ok"
          ? "Merci, c'est noté. Vous serez parmi les premiers informés."
          : "Cette adresse est déjà inscrite. Merci de votre fidélité."}
      </p>
    );
  }

  return (
    <form onSubmit={envoyer} className="w-full">
      {/* Piège : caché aux humains et aux lecteurs d'écran, rempli par les robots. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor={`${id}-site`}>Ne pas remplir</label>
        <input
          id={`${id}-site`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={site}
          onChange={(e) => setSite(e.target.value)}
        />
      </div>

      <label htmlFor={`${id}-email`} className="sr-only">
        Votre adresse email
      </label>

      {footer ? (
        <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
          <input
            id={`${id}-email`}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-[#535359] py-2"
            style={{ borderBottom: "1px solid #535359" }}
          />
          <button
            type="submit"
            disabled={etat === "envoi"}
            className="cursor-pointer bg-transparent border-none text-xs font-medium uppercase tracking-[1px] text-[#535359] hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            {etat === "envoi" ? "…" : "Valider"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            id={`${id}-email`}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 min-w-0 border border-[#DCDCD5] rounded-lg px-4 py-3 text-[14px] text-[#111111] bg-white focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition"
          />
          <button
            type="submit"
            disabled={etat === "envoi"}
            className="bg-[#111111] hover:bg-[#2C2C2C] text-white text-[13px] font-semibold tracking-wide px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {etat === "envoi" ? "Inscription…" : "S'inscrire"}
          </button>
        </div>
      )}

      {etat === "erreur" && (
        <p role="alert" className={`text-[12.5px] text-[#B3261E] mt-2 ${footer ? "text-center" : ""}`}>
          {erreur}
        </p>
      )}
    </form>
  );
}
