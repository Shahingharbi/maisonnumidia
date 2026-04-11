import Link from "next/link";
import { Phone, MapPin } from "lucide-react";

const cols = [
  {
    title: "Catalogue",
    links: [
      { label: "Parfums Homme", href: "/parfums-homme" },
      { label: "Parfums Femme", href: "/parfums-femme" },
      { label: "Parfums Orientaux", href: "/parfums-orientaux" },
      { label: "Toutes les Marques", href: "/marques" },
      { label: "Blog Parfums", href: "/blog" },
    ],
  },
  {
    title: "Marques populaires",
    links: [
      { label: "Dior", href: "/marques/dior" },
      { label: "Chanel", href: "/marques/chanel" },
      { label: "Yves Saint Laurent", href: "/marques/ysl" },
      { label: "Paco Rabanne", href: "/marques/paco-rabanne" },
      { label: "Armani", href: "/marques/armani" },
      { label: "Lancôme", href: "/marques/lancome" },
      { label: "Versace", href: "/marques/versace" },
      { label: "Lattafa", href: "/marques/lattafa" },
      { label: "Al Haramain", href: "/marques/al-haramain" },
      { label: "Narciso Rodriguez", href: "/marques/narciso-rodriguez" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "Commander", href: "/commander" },
      { label: "Contact", href: "/contact" },
      { label: "Parfum Algérie", href: "/parfum-algerie" },
      { label: "Plan du site", href: "/plan-du-site" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-1">
              <div className="text-[10px] tracking-[0.35em] text-[#C9A84C] font-medium uppercase">
                Maison
              </div>
              <div className="text-xl font-bold tracking-[0.12em] text-white uppercase">
                Numidia
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mt-4 mb-6">
              Parfums de luxe en Algérie. Livraison dans toutes les wilayas,
              paiement à la livraison.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-sm text-white/40">
                <MapPin size={13} className="text-[#C9A84C] mt-0.5 shrink-0" />
                <span>Blida, Algérie</span>
              </div>
              <a
                href="https://wa.me/213XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/40 hover:text-[#C9A84C] transition-colors"
              >
                <Phone size={13} className="text-[#C9A84C] shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/60 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Maison Numidia. Tous droits réservés.
          </p>
          <p className="text-white/20 text-xs">
            Livraison Yalidine · Paiement COD · Algérie
          </p>
        </div>
      </div>
    </footer>
  );
}
