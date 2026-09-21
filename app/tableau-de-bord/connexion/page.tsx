"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function Formulaire() {
  const router = useRouter();
  const params = useSearchParams();
  const configManquante = params.get("config") === "manquante";

  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);
    setErreur("");
    try {
      const r = await fetch("/api/tableau-de-bord/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant, motDePasse }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        setErreur(data.erreur ?? "Connexion impossible.");
        setChargement(false);
        return;
      }
      router.replace("/tableau-de-bord");
      router.refresh();
    } catch {
      setErreur("Connexion impossible, réessayez.");
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-8">
          <Image
            src="/logo-192.png"
            alt="Maison Numidia"
            width={56}
            height={56}
            className="brightness-0 mx-auto mb-4"
            unoptimized
          />
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#C9A84C]">
            Espace interne
          </p>
          <h1 className="font-[family-name:var(--font-libre-bodoni)] text-[26px] text-[#111111] mt-1">
            Tableau de bord
          </h1>
        </div>

        {configManquante && (
          <div className="mb-5 rounded-lg border border-[#E8C9C6] bg-[#FBE7E5] px-4 py-3 text-[12px] text-[#B3261E]">
            Les identifiants ne sont pas configurés sur le serveur. Ajoutez les
            variables <strong>TDB_USER</strong> et <strong>TDB_PASS</strong> dans
            Vercel, puis redéployez.
          </div>
        )}

        <form
          onSubmit={envoyer}
          className="bg-white border border-[#E9E9E4] rounded-lg p-6 space-y-4"
        >
          <label className="block">
            <span className="block text-[11px] font-medium text-[#6B6B6B] mb-1.5">
              Identifiant
            </span>
            <input
              type="text"
              autoComplete="username"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              required
              className="w-full border border-[#DCDCD5] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition"
            />
          </label>

          <label className="block">
            <span className="block text-[11px] font-medium text-[#6B6B6B] mb-1.5">
              Mot de passe
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="w-full border border-[#DCDCD5] rounded-lg px-3 py-2.5 text-[14px] focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition"
            />
          </label>

          {erreur && (
            <p className="text-[12px] text-[#B3261E] bg-[#FBE7E5] rounded-lg px-3 py-2">
              {erreur}
            </p>
          )}

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-[#111111] hover:bg-[#2C2C2C] disabled:opacity-50 text-white font-medium py-3 rounded-lg text-[14px] transition-colors"
          >
            {chargement ? "Connexion..." : "Entrer"}
          </button>
        </form>

        <p className="text-center mt-6">
          <Link href="/" className="text-[12px] text-[#9A9A94] hover:text-[#C9A84C] transition-colors">
            Retour à la boutique
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PageConnexion() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF8]" />}>
      <Formulaire />
    </Suspense>
  );
}
