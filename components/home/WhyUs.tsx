import { Truck, CreditCard, Shield, Phone } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Livraison partout en Algérie",
    description: "Yalidine Express dans les 58 wilayas. Délai de 24h à 72h selon votre localisation.",
  },
  {
    icon: CreditCard,
    title: "Paiement à la livraison",
    description: "Aucune carte bancaire. Vous réglez uniquement en cash à la réception de votre commande.",
  },
  {
    icon: Shield,
    title: "100% Authentique",
    description: "Tous nos parfums sont originaux et garantis authentiques. Qualité certifiée.",
  },
  {
    icon: Phone,
    title: "Conseillers disponibles",
    description: "Appelez-nous au 06 99 41 85 69. Réponse rapide garantie tous les jours.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-16 sm:py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12">
          <span className="text-xs font-medium text-[#AC9270] tracking-[1.5px] uppercase">
            Pourquoi nous choisir
          </span>
          <h2
            className="text-[clamp(28px,3vw,38px)] text-[#535359] mt-3"
            style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}
          >
            Simple, rapide, fiable
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#AC9270]/30 flex items-center justify-center">
                <f.icon size={20} className="text-[#AC9270]" />
              </div>
              <div>
                <h3 className="font-medium text-[#535359] text-sm mb-1.5">{f.title}</h3>
                <p className="text-sm text-[#8A8A90] leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
