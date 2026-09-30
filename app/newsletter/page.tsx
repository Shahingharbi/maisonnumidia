import type { Metadata } from "next";
import Link from "next/link";
import FormulaireNewsletter from "@/components/newsletter/FormulaireNewsletter";
import { newsletterActive } from "@/lib/newsletter";

// Page d'inscription, à partager (bio Instagram, story, message). Elle n'a pas vocation à
// se positionner sur Google : noindex, et absente du sitemap (règle n°3).
export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Recevez les nouveaux arrivages et les retours en stock de Maison Numidia, parfums 100% originaux livrés dans les 58 wilayas avec paiement à la livraison.",
  alternates: { canonical: "https://maisonnumidia.store/newsletter" },
  robots: { index: false, follow: true },
};

const AVANTAGES = [
  { titre: "Les nouveaux arrivages", texte: "Les parfums qui entrent au catalogue." },
  { titre: "Les retours en stock", texte: "Les parfums de nouveau disponibles." },
  { titre: "Les offres abonnés", texte: "Des offres réservées à la newsletter." },
];

export default function PageNewsletter() {
  const actif = newsletterActive();

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#C9A84C] text-center">
          Maison Numidia
        </p>
        <h1
          className="text-center text-[#111111] mt-2"
          style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontSize: 34, fontWeight: 400, lineHeight: 1.15 }}
        >
          La newsletter
        </h1>
        <p className="text-center text-[15px] text-[#535359] mt-3 leading-relaxed">
          Nouveautés et offres exclusives, directement dans votre boîte mail.
        </p>

        <ul className="mt-10 space-y-4">
          {AVANTAGES.map((a) => (
            <li key={a.titre} className="flex gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" aria-hidden="true" />
              <p className="text-[14px] text-[#535359] leading-relaxed">
                <strong className="text-[#111111] font-semibold">{a.titre}.</strong> {a.texte}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10 bg-white border border-[#E9E9E4] rounded-lg px-5 py-6">
          {actif ? (
            <FormulaireNewsletter source="page" variante="page" />
          ) : (
            <p className="text-center text-[14px] text-[#535359]">Les inscriptions ouvrent très bientôt.</p>
          )}
          <p className="text-[12px] text-[#9A9A94] mt-4 leading-relaxed">
            Votre adresse sert uniquement à vous écrire. Elle n&apos;est ni vendue ni transmise, et vous
            pouvez vous désinscrire à tout moment. Voir les{" "}
            <Link href="/mentions-legales" className="underline hover:text-[#8B6914]">mentions légales</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
