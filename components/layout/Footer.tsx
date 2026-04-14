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
    <footer className="bg-[#F5F5F5] mt-auto">
      {/* Newsletter */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-14 text-center">
        <h3
          className="text-[#535359]"
          style={{
            fontFamily: "var(--font-libre-bodoni), Georgia, serif",
            fontSize: 24,
            fontWeight: 400,
          }}
        >
          Newsletter
        </h3>
        <p className="text-sm text-[#535359] mt-2 mb-5 opacity-70">
          Abonnez-vous pour recevoir nos nouveautés et offres exclusives
        </p>
        <div className="flex items-center justify-center gap-4 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="Votre email"
            className="flex-1 bg-transparent outline-none text-sm text-[#535359] py-2"
            style={{ borderBottom: "1px solid #535359" }}
          />
          <button
            className="cursor-pointer bg-transparent border-none text-xs font-medium uppercase tracking-[1px] text-[#535359] hover:opacity-70 transition-opacity"
          >
            Valider
          </button>
        </div>
      </div>

      {/* HR */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <hr className="border-none" style={{ borderTop: "1px solid #e5e5e5" }} />
      </div>

      {/* Main footer */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="mb-1">
              <div className="text-[10px] tracking-[2px] text-[#AC9270] font-medium uppercase">
                Maison
              </div>
              <div className="text-xl tracking-[1.5px] text-[#535359] uppercase" style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif" }}>
                Numidia
              </div>
            </div>
            <p className="text-[#8A8A90] text-sm leading-relaxed mt-4 mb-6">
              Parfums de luxe en Algérie. Livraison dans toutes les wilayas,
              paiement à la livraison.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-sm text-[#8A8A90]">
                <MapPin size={13} className="text-[#AC9270] mt-0.5 shrink-0" />
                <span>Blida, Algérie</span>
              </div>
              <a
                href="https://wa.me/33782214993"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[#8A8A90] hover:text-[#AC9270] transition-colors"
              >
                <Phone size={13} className="text-[#AC9270] shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-medium tracking-[1.5px] uppercase text-[#535359] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#8A8A90] hover:text-[#535359] transition-colors"
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

      {/* Bottom bar */}
      <div className="border-t border-[#e5e5e5]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[#B0B0B0] text-xs">
            © {new Date().getFullYear()} Maison Numidia. Tous droits réservés.
          </p>
          <p className="text-[#B0B0B0] text-xs">
            Livraison Yalidine · Paiement COD · Algérie
          </p>
        </div>
      </div>
    </footer>
  );
}
