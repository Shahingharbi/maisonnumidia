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

        <div className="mb-12">
          <p className="text-xs tracking-[0.2em] text-[#C9A84C] uppercase font-medium mb-2">
            Pourquoi nous choisir
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111]">
            Simple, rapide, fiable
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg border border-[#C9A84C]/30 flex items-center justify-center">
                <f.icon size={18} className="text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] text-sm mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
