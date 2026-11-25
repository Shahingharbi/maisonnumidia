"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  LogOut,
  MoreHorizontal,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { TdbProvider } from "@/components/tdb/TdbProvider";
import { useCommandes } from "@/components/tdb/useCommandes";
import { versAncienModele } from "@/lib/tdb/adaptateur";
import VueJour from "@/components/tdb/VueJour";
import FicheCommande from "@/components/tdb/FicheCommande";
import ActiverNotifications from "@/components/tdb/ActiverNotifications";
import VueTableauDeBord from "@/components/tdb/VueTableauDeBord";
import VueClients from "@/components/tdb/VueClients";
import VueCaisse from "@/components/tdb/VueCaisse";
import VueReglages from "@/components/tdb/VueReglages";

type Vue = "commandes" | "chiffres" | "clients" | "caisse" | "reglages" | "notifications";

const AUTRES: { cle: Vue; label: string; aide: string; Icone: typeof Users }[] = [
  { cle: "chiffres", label: "Les chiffres", aide: "Ce que ça rapporte vraiment", Icone: BarChart3 },
  { cle: "clients", label: "Clients", aide: "Historique et liste noire", Icone: Users },
  { cle: "caisse", label: "Caisse", aide: "Qui a avancé quoi", Icone: Wallet },
  { cle: "notifications", label: "Notifications", aide: "Être prévenu sur ce téléphone", Icone: Bell },
  { cle: "reglages", label: "Réglages", aide: "Associés, fournisseurs, tarifs", Icone: Settings },
];

function Coque({ etat }: { etat: ReturnType<typeof useCommandes> }) {
  const router = useRouter();
  const [vue, setVue] = useState<Vue>("commandes");
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [ficheId, setFicheId] = useState<string | null>(null);

  // Ouverture directe d'une commande depuis la notification du téléphone.
  useEffect(() => {
    const numero = new URLSearchParams(window.location.search).get("c");
    if (!numero || !etat.commandes.length) return;
    const trouvee = etat.commandes.find((c) => c.numero === numero);
    if (trouvee) {
      setFicheId(trouvee.id);
      window.history.replaceState(null, "", "/tableau-de-bord");
    }
  }, [etat.commandes]);

  async function deconnexion() {
    await fetch("/api/tableau-de-bord/deconnexion", { method: "POST" });
    router.replace("/tableau-de-bord/connexion");
    router.refresh();
  }

  const fiche = ficheId ? etat.commandes.find((c) => c.id === ficheId) ?? null : null;
  const titre = vue === "commandes" ? "Commandes" : AUTRES.find((a) => a.cle === vue)?.label ?? "";

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="bg-[#111111] sticky top-0 z-30">
        <div className="max-w-[760px] mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {vue !== "commandes" ? (
              <button
                onClick={() => setVue("commandes")}
                className="-ml-1 p-2 text-[#9A9A94] hover:text-white transition-colors"
                aria-label="Revenir aux commandes"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <Image
                src="/logo-192.png"
                alt=""
                width={24}
                height={24}
                className="invert opacity-90 shrink-0"
                unoptimized
              />
            )}
            <p className="text-white text-[15px] font-medium truncate">{titre}</p>
          </div>

          <button
            onClick={() => setMenuOuvert(true)}
            className="p-2 text-[#9A9A94] hover:text-white transition-colors"
            aria-label="Plus"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-[760px] mx-auto px-4 py-5">
        {vue === "commandes" && <VueJour etat={etat} ouvrirFiche={setFicheId} />}
        {vue === "chiffres" && <VueTableauDeBord />}
        {vue === "clients" && <VueClients />}
        {vue === "caisse" && <VueCaisse />}
        {vue === "reglages" && <VueReglages />}
        {vue === "notifications" && <ActiverNotifications />}
      </main>

      {fiche && (
        <FicheCommande commande={fiche} etat={etat} fermer={() => setFicheId(null)} />
      )}

      {menuOuvert && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center sm:justify-center">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOuvert(false)}
            aria-label="Fermer"
          />
          <div className="relative w-full sm:max-w-[420px] bg-white rounded-t-lg sm:rounded-lg border border-[#E9E9E4] p-3 pb-6 sm:pb-3">
            <div className="flex items-center justify-between px-2 py-2">
              <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-[#8A8A84]">
                Le reste
              </p>
              <button
                onClick={() => setMenuOuvert(false)}
                className="p-1.5 text-[#9A9A94] hover:text-[#111111]"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {AUTRES.map(({ cle, label, aide, Icone }) => (
              <button
                key={cle}
                onClick={() => {
                  setVue(cle);
                  setMenuOuvert(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-lg hover:bg-[#FAFAF8] text-left transition-colors"
              >
                <Icone size={18} className="text-[#C9A84C] shrink-0" strokeWidth={1.7} />
                <span className="min-w-0">
                  <span className="block text-[14px] text-[#111111]">{label}</span>
                  <span className="block text-[12px] text-[#8A8A84]">{aide}</span>
                </span>
              </button>
            ))}

            <button
              onClick={deconnexion}
              className="w-full flex items-center gap-3 px-3 py-3.5 mt-1 rounded-lg hover:bg-[#FBE7E5] text-left transition-colors border-t border-[#F0F0EA]"
            >
              <LogOut size={18} className="text-[#B3261E] shrink-0" strokeWidth={1.7} />
              <span className="text-[14px] text-[#B3261E]">Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PageTableauDeBord() {
  const etat = useCommandes();
  const anciennes = useMemo(
    () => etat.commandes.map(versAncienModele),
    [etat.commandes],
  );
  return (
    <TdbProvider commandes={anciennes}>
      <Coque etat={etat} />
    </TdbProvider>
  );
}
