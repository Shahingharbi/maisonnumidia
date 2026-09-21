"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Users,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";
import { TdbProvider, useTdb } from "@/components/tdb/TdbProvider";
import VueTableauDeBord from "@/components/tdb/VueTableauDeBord";
import VueCommandes from "@/components/tdb/VueCommandes";
import VueClients from "@/components/tdb/VueClients";
import VueCaisse from "@/components/tdb/VueCaisse";
import VueReglages from "@/components/tdb/VueReglages";

const ONGLETS = [
  { cle: "bord", label: "Tableau de bord", Icone: BarChart3 },
  { cle: "commandes", label: "Commandes", Icone: ClipboardList },
  { cle: "clients", label: "Clients", Icone: Users },
  { cle: "caisse", label: "Caisse", Icone: Wallet },
  { cle: "reglages", label: "Réglages", Icone: Settings },
] as const;

type Cle = (typeof ONGLETS)[number]["cle"];

function Contenu() {
  const [onglet, setOnglet] = useState<Cle>("bord");
  const { base, pret } = useTdb();
  const router = useRouter();

  async function deconnexion() {
    await fetch("/api/tableau-de-bord/deconnexion", { method: "POST" });
    router.replace("/tableau-de-bord/connexion");
    router.refresh();
  }

  const enCours = base.commandes.filter(
    (c) => !["Encaissée", "Annulée", "Retour", "Rupture fournisseur"].includes(c.statut),
  ).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-[#111111] sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Image
                src="/logo-192.png"
                alt=""
                width={26}
                height={26}
                className="invert opacity-90"
                unoptimized
              />
              <div className="leading-tight">
                <p className="text-white text-[13px] font-medium">Maison Numidia</p>
                <p className="text-[#8A8A84] text-[10px] tracking-[0.14em] uppercase">
                  Espace interne
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-[#C9A84C]">
                {enCours} commande{enCours > 1 ? "s" : ""} en cours
              </span>
              <button
                onClick={deconnexion}
                className="text-[#8A8A84] hover:text-white transition-colors p-2"
                aria-label="Se déconnecter"
                title="Se déconnecter"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto -mx-1 px-1 pb-0">
            {ONGLETS.map(({ cle, label, Icone }) => {
              const actif = onglet === cle;
              return (
                <button
                  key={cle}
                  onClick={() => setOnglet(cle)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[12.5px] font-medium border-b-2 transition-colors ${
                    actif
                      ? "text-[#C9A84C] border-[#C9A84C]"
                      : "text-[#9A9A94] border-transparent hover:text-white"
                  }`}
                >
                  <Icone size={14} strokeWidth={1.8} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {!pret ? (
          <p className="text-[13px] text-[#9A9A94] py-20 text-center">Chargement...</p>
        ) : (
          <>
            {onglet === "bord" && <VueTableauDeBord />}
            {onglet === "commandes" && <VueCommandes />}
            {onglet === "clients" && <VueClients />}
            {onglet === "caisse" && <VueCaisse />}
            {onglet === "reglages" && <VueReglages />}
          </>
        )}
      </main>
    </div>
  );
}

export default function PageTableauDeBord() {
  return (
    <TdbProvider>
      <Contenu />
    </TdbProvider>
  );
}
