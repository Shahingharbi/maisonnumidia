import Link from "next/link";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    title: "Collection Prestige",
    subtitle: "Dior · Chanel · Paco Rabanne",
    description:
      "Les grandes maisons françaises réunies. Dior Sauvage, Bleu de Chanel, 1 Million — les parfums que chaque Algérien reconnaît et respecte.",
    href: "/parfums-homme",
    tag: "Best-sellers",
    bg: "bg-[#111111]",
    tagColor: "text-[#C9A84C]",
    textColor: "text-white",
    subColor: "text-white/40",
    descColor: "text-white/60",
    borderColor: "border-white/10",
  },
  {
    title: "Collection Orientaux",
    subtitle: "Lattafa · Al Haramain · Franck Olivier",
    description:
      "Oud véritable, ambre profond, musc enveloppant. Les parfums qui racontent l'histoire des traditions olfactives arabes — riches, chaleureux, durables.",
    href: "/parfums-orientaux",
    tag: "Populaire en Algérie",
    bg: "bg-[#FAFAF8]",
    tagColor: "text-[#C9A84C]",
    textColor: "text-[#111111]",
    subColor: "text-gray-400",
    descColor: "text-gray-500",
    borderColor: "border-gray-100",
  },
  {
    title: "Collection Femme",
    subtitle: "Chanel · YSL · Lancôme",
    description:
      "Des floraux délicats aux orientaux féminins envoûtants. Black Opium, Coco Mademoiselle, La Vie Est Belle — l'élégance féminine dans toute sa diversité.",
    href: "/parfums-femme",
    tag: "Cadeaux femme",
    bg: "bg-white",
    tagColor: "text-[#C9A84C]",
    textColor: "text-[#111111]",
    subColor: "text-gray-400",
    descColor: "text-gray-500",
    borderColor: "border-gray-100",
  },
];

export default function Collections() {
  return (
    <section className="bg-[#FAFAF8] py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <span className="text-xs font-medium text-[#AC9270] tracking-[1.5px] uppercase">
            Nos collections
          </span>
          <h2
            className="text-[clamp(28px,3vw,38px)] text-[#535359] mt-3"
            style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}
          >
            Parfums par univers olfactif
          </h2>
          <p className="mt-3 text-[#8A8A90] max-w-xl mx-auto text-sm">
            Trois univers, des dizaines de fragrances. Chaque collection est soigneusement sélectionnée pour le marché algérien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((col) => (
            <div
              key={col.title}
              className={`${col.bg} border ${col.borderColor} p-8 flex flex-col justify-between min-h-[260px]`}
            >
              <div>
                <span className={`text-xs font-medium tracking-[1.5px] uppercase ${col.tagColor}`}>
                  {col.tag}
                </span>
                <h3 className={`text-xl font-bold mt-3 mb-1 ${col.textColor}`}>
                  {col.title}
                </h3>
                <p className={`text-sm mb-4 ${col.subColor}`}>{col.subtitle}</p>
                <p className={`text-sm leading-relaxed ${col.descColor}`}>
                  {col.description}
                </p>
              </div>

              <Link
                href={col.href}
                className={`inline-flex items-center gap-2 mt-6 text-sm font-medium group ${col.tagColor} hover:opacity-80 transition-opacity`}
              >
                Explorer la collection
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* SEO paragraph */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-[#8A8A90] leading-relaxed max-w-3xl mx-auto text-center">
            Maison Numidia propose une sélection de <strong className="text-[#535359]">parfums originaux en Algérie</strong> répartis en trois grandes collections : les classiques occidentaux de prestige, les fragrances orientales traditionnelles, et les parfums féminins d'exception. Chaque flacon est importé directement et livré via Yalidine Express dans les{" "}
            <strong className="text-[#535359]">58 wilayas algériennes</strong>, avec paiement à la réception.
          </p>
        </div>

      </div>
    </section>
  );
}
