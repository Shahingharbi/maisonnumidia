import type { Metadata } from "next";
import Link from "@/components/Lien";
import { Home, Store, Truck } from "lucide-react";
import livraison from "@/data/livraison.json";
import { formatPrice } from "@/lib/products";
import { WILAYAS } from "@/lib/tdb/constantes";
import { tarifWilaya } from "@/lib/livraison";

// Données : API Yalidine via scripts/yalidine/tarifs.mjs (départ Blida, service express).

export const metadata: Metadata = {
  title: "Prix Livraison Yalidine par Wilaya, à Domicile ou au Bureau",
  description:
    "Tarifs de livraison Yalidine pour chaque wilaya, à domicile ou au bureau. Parfums originaux expédiés depuis Blida, paiement à la livraison partout en Algérie.",
  alternates: { canonical: "https://maisonnumidia.store/livraison" },
};

// Ordre alphabétique (demande de Shahin, 11/11/2026 : « on se perd » par numéro). Le numéro reste affiché.
const wilayas = [...livraison.wilayas].sort((a, b) => WILAYAS[a.id - 1].localeCompare(WILAYAS[b.id - 1], "fr"));
const livrees = wilayas.filter((w) => w.livrable);
const nonLivrees = wilayas.filter((w) => !w.livrable);
const prixDom = livrees.map((w) => w.domicile as number);
const prixBur = livrees.filter((w) => w.bureau != null).map((w) => w.bureau as number);
const ecarts = livrees.filter((w) => w.bureau != null).map((w) => (w.domicile as number) - (w.bureau as number));
const nbBureaux = livrees.reduce((n, w) => n + w.bureaux.length, 0);
const dateMaj = new Date(livraison.maj).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const nouvelles = WILAYAS.slice(58).sort((a, b) => a.localeCompare(b, "fr"));

export default function LivraisonPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-10">
          <span className="text-xs font-semibold text-[#C9A84C] tracking-[0.2em] uppercase">Livraison Yalidine</span>
          <h1 className="text-3xl font-bold text-[#111111] mt-2">Prix de livraison par wilaya</h1>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Nos colis partent de Blida avec Yalidine. Le prix dépend seulement de votre wilaya et du mode de
            livraison : <strong>à domicile</strong>, ou <strong>au bureau Yalidine</strong> de votre choix, moins cher.
            Il s&apos;ajoute au prix du parfum et se règle au livreur, en espèces, à la réception. Tarifs relevés
            sur notre compte Yalidine le {dateMaj}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="border border-gray-100 rounded-lg p-5 bg-[#FAFAF8]">
            <Home size={20} className="text-[#C9A84C] mb-2" />
            <p className="text-sm text-gray-500">À domicile</p>
            <p className="font-semibold text-[#111111]">
              {formatPrice(Math.min(...prixDom))} à {formatPrice(Math.max(...prixDom))}
            </p>
          </div>
          <div className="border border-gray-100 rounded-lg p-5 bg-[#FAFAF8]">
            <Store size={20} className="text-[#C9A84C] mb-2" />
            <p className="text-sm text-gray-500">Au bureau Yalidine</p>
            <p className="font-semibold text-[#111111]">
              {formatPrice(Math.min(...prixBur))} à {formatPrice(Math.max(...prixBur))}
            </p>
          </div>
          <div className="border border-gray-100 rounded-lg p-5 bg-[#FAFAF8]">
            <Truck size={20} className="text-[#C9A84C] mb-2" />
            <p className="text-sm text-gray-500">Points de retrait</p>
            <p className="font-semibold text-[#111111]">{nbBureaux} bureaux Yalidine</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#111111] mb-4">Tarifs des 58 wilayas</h2>
        <div className="overflow-x-auto border border-gray-100 rounded-lg mb-12">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-left text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Wilaya</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap">À domicile</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Au bureau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wilayas.map((w) => (
                <tr key={w.id} id={`wilaya-${w.id}`} className="align-top">
                  <td className="px-4 py-3">
                    <span className="text-gray-400 tabular-nums mr-2">{String(w.id).padStart(2, "0")}</span>
                    <span className="font-medium text-[#111111]">{WILAYAS[w.id - 1]}</span>
                    {w.bureaux.length > 0 && (
                      <details className="mt-1">
                        <summary className="text-xs text-[#8B6914] cursor-pointer">
                          {w.bureaux.length === 1 ? "1 bureau" : `${w.bureaux.length} bureaux`}
                        </summary>
                        <ul className="mt-2 space-y-1.5 text-xs text-gray-500">
                          {w.bureaux.map((b, i) => (
                            <li key={i}>
                              <span className="text-gray-700">{b.nom}</span>
                              <br />
                              {b.adresse}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </td>
                  {w.livrable ? (
                    <>
                      <td className="px-4 py-3 text-right whitespace-nowrap">{formatPrice(w.domicile as number)}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {w.bureau != null ? formatPrice(w.bureau) : <span className="text-gray-400">Pas de bureau</span>}
                      </td>
                    </>
                  ) : (
                    <td colSpan={2} className="px-4 py-3 text-right text-gray-400">
                      Non desservie par Yalidine
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-[#111111] mb-3">Les 11 wilayas créées en 2026</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Yalidine livre déjà ces nouvelles wilayas, mais les rattache encore à la wilaya dont elles sont issues :
          le tarif et les bureaux sont donc ceux de cette dernière.
        </p>
        <div className="overflow-x-auto border border-gray-100 rounded-lg mb-12">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-left text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Wilaya</th>
                <th className="px-4 py-3 font-medium">Tarif de</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap">À domicile</th>
                <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Au bureau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {nouvelles.map((nom) => {
                const t = tarifWilaya(nom);
                return (
                  <tr key={nom}>
                    <td className="px-4 py-3 font-medium text-[#111111]">{nom}</td>
                    <td className="px-4 py-3 text-gray-500">{t?.wilayaMere}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{t?.domicile != null ? formatPrice(t.domicile) : "—"}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{t?.bureau != null ? formatPrice(t.bureau) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#111111] mb-3">À domicile ou au bureau ?</h2>
            <p>
              <strong>À domicile</strong>, le livreur Yalidine vous appelle et apporte le colis à l&apos;adresse
              donnée dans la commande. <strong>Au bureau</strong>, vous choisissez l&apos;agence Yalidine qui vous
              arrange et vous y retirez le colis quand il est arrivé : c&apos;est {formatPrice(Math.min(...ecarts))} à{" "}
              {formatPrice(Math.max(...ecarts))} de moins selon la wilaya. Dans les deux cas, vous payez à la
              réception et vous pouvez vérifier le flacon avant de régler.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#111111] mb-3">Comment se passe une commande</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Vous choisissez votre wilaya et le mode de livraison : le prix exact s&apos;affiche avant de valider.</li>
              <li>Nous vous appelons pour confirmer la commande.</li>
              <li>Le colis part de Blida et Yalidine vous contacte à son arrivée.</li>
              <li>Vous payez le parfum et la livraison au livreur ou au bureau, en espèces. Rien n&apos;est payé en ligne.</li>
            </ul>
          </section>

          {nonLivrees.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-[#111111] mb-3">Wilayas non desservies</h2>
              <p>
                Yalidine ne livre pas encore {nonLivrees.map((w) => WILAYAS[w.id - 1]).join(" ni ")}. Si vous y
                habitez, appelez-nous au{" "}
                <a href="tel:0794496059" className="text-[#8B6914] font-medium">07 94 49 60 59</a> : on cherche
                ensemble une solution d&apos;envoi.
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold text-[#111111] mb-3">Choisir son parfum</h2>
            <p>
              Tous nos parfums sont des originaux, livrés dans leur emballage d&apos;origine. Parcourez les{" "}
              <Link href="/parfums-homme" className="text-[#8B6914] font-medium">parfums homme</Link>, les{" "}
              <Link href="/parfums-femme" className="text-[#8B6914] font-medium">parfums femme</Link> et les{" "}
              <Link href="/parfums-orientaux" className="text-[#8B6914] font-medium">parfums orientaux</Link>, puis
              commandez directement depuis la fiche du parfum.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
