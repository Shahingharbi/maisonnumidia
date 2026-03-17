import type { Metadata } from "next";
import { Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Maison Numidia | Parfums en Algérie",
  description: "Contactez Maison Numidia pour toute question sur nos parfums. WhatsApp disponible, réponse rapide garantie.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <div className="mb-12">
          <span className="text-xs font-semibold text-[#C9A84C] tracking-[0.2em] uppercase">
            On est là pour vous
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Nous contacter</h1>
          <p className="text-gray-400 mt-2">
            Une question sur un parfum, une commande, la livraison ? On vous répond vite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Phone,
              title: "WhatsApp",
              desc: "La façon la plus rapide de nous joindre",
              action: "Ouvrir WhatsApp",
              href: "https://wa.me/213XXXXXXXXX",
            },
            {
              icon: MapPin,
              title: "Localisation",
              desc: "Blida, Algérie · Livraison dans toutes les wilayas",
              action: null,
              href: null,
            },
            {
              icon: Clock,
              title: "Disponibilité",
              desc: "9h - 21h, 7j/7",
              action: null,
              href: null,
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#FAFAFA] rounded-2xl p-6 border border-[#E5E5E5]">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-4">
                <item.icon size={18} className="text-[#C9A84C]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              {item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-medium text-[#C9A84C] hover:text-[#8B6914] transition-colors"
                >
                  {item.action} →
                </a>
              )}
            </div>
          ))}
        </div>

        <a
          href="https://wa.me/213XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0F0F0F] font-semibold px-8 py-4 rounded-xl transition-colors"
        >
          <Phone size={16} />
          Nous écrire sur WhatsApp
        </a>
      </div>
    </div>
  );
}
