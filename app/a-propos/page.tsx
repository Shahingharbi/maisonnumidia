import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Shield, Truck, Award, Users } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "À propos — Maison Numidia, parfums authentiques en Algérie",
  description:
    "Découvrez l'histoire de Maison Numidia : boutique de parfums originaux fondée à Blida, livraison Yalidine 58 wilayas, engagement authenticité 100% garanti.",
  alternates: { canonical: "https://maisonnumidia.store/a-propos" },
};

export default function APropos() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Accueil", url: "/" },
    { name: "À propos", url: "/a-propos" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          <Breadcrumb items={[{ label: "À propos", href: "/a-propos" }]} />
        </div>

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-12">
          <p className="text-xs font-semibold text-[#C9A84C] tracking-[0.25em] uppercase mb-3">
            Notre Histoire
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight mb-6">
            Maison Numidia — Le parfum authentique, à la portée de l&apos;Algérie
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-3xl">
            Fondée à Blida, Maison Numidia est née d&apos;un constat simple : en Algérie, le
            marché du parfum est saturé de contrefaçons. Trouver un vrai flacon, avec la bonne
            concentration, le bon sillage, la bonne longévité, relevait du parcours du
            combattant. Nous avons décidé de créer un espace où chaque parfum vendu est
            garanti 100% original, sourcé auprès de distributeurs officiels, et livré partout
            dans les 58 wilayas avec paiement à la réception.
          </p>
        </section>

        {/* Qui nous sommes */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 border-t border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8">
            Qui nous sommes
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              Maison Numidia est une petite équipe algérienne passionnée de parfumerie. Nous
              avons grandi entre Blida et Alger, et nous avons vu trop de personnes se faire
              avoir par des flacons contrefaits vendus à prix fort sur les marchés parallèles
              ou sur les réseaux sociaux. Nous avons travaillé pendant des mois à construire
              une chaîne d&apos;approvisionnement sérieuse, avec des fournisseurs vérifiés à
              Dubaï, Paris et Istanbul, pour garantir que chaque flacon qui quitte notre
              entrepôt est identique à celui que vous trouveriez dans une parfumerie de luxe
              en France ou à Dubaï.
            </p>
            <p>
              Le nom <strong className="text-[#111111]">Numidia</strong> vient de l&apos;antique
              royaume berbère qui couvrait le nord de l&apos;Algérie actuelle. C&apos;est
              notre façon d&apos;ancrer la marque dans l&apos;identité algérienne, avec la
              rigueur d&apos;une maison qui respecte son nom.
            </p>
            <p>
              Notre catalogue couvre plus de 750 parfums répartis sur 120 marques : les
              grandes maisons françaises (Dior, Chanel, Guerlain, Lancôme, YSL), les signatures
              italiennes (Armani, Versace, Valentino), les classiques américains (Tom Ford,
              Calvin Klein) et une sélection pointue de parfumerie orientale (Lattafa, Al
              Haramain, Rasasi, Ajmal, Afnan) — cette dernière catégorie étant particulièrement
              plébiscitée en Algérie pour sa richesse olfactive et ses tarifs accessibles.
            </p>
          </div>
        </section>

        {/* Notre engagement */}
        <section className="bg-[#FAFAF8] py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-3">
              Notre engagement : l&apos;authenticité, rien d&apos;autre
            </h2>
            <p className="text-gray-500 mb-10 max-w-2xl leading-relaxed">
              Voici les règles que nous nous sommes fixées et que nous n&apos;avons jamais
              négociées depuis le premier jour.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 p-6">
                <Shield className="w-7 h-7 text-[#C9A84C] mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-[#111111] mb-2">
                  100% originaux, garantis
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Chaque flacon est sourcé auprès de distributeurs officiels. Si vous avez le
                  moindre doute à la réception, vous refusez le colis — aucune question, aucun
                  frais.
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-6">
                <Truck className="w-7 h-7 text-[#C9A84C] mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-[#111111] mb-2">
                  Livraison 58 wilayas
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Partenariat avec Yalidine Express : 24-48h sur Alger, Blida, Oran, 48-72h
                  pour les wilayas éloignées. Numéro de suivi envoyé dès l&apos;expédition.
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-6">
                <Award className="w-7 h-7 text-[#C9A84C] mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-[#111111] mb-2">
                  Paiement à la réception
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Aucun paiement en ligne, aucune carte bancaire exigée. Vous payez cash au
                  livreur Yalidine, uniquement après avoir vu et validé votre commande.
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-6">
                <Users className="w-7 h-7 text-[#C9A84C] mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-[#111111] mb-2">
                  Conseil humain, pas un bot
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  WhatsApp et téléphone répondus par notre équipe à Blida. Conseils
                  olfactifs, recommandations selon la saison, doutes sur une commande — on
                  répond sous quelques heures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8">
            Comment passer commande
          </h2>
          <ol className="space-y-6">
            {[
              {
                num: "1",
                title: "Choisissez votre parfum",
                desc: "Parcourez nos catégories (homme, femme, orientaux) ou cherchez directement une marque ou un parfum. Chaque fiche produit détaille la pyramide olfactive, la concentration, le volume et l'authenticité garantie.",
              },
              {
                num: "2",
                title: "Ajoutez au panier et remplissez la commande",
                desc: "Indiquez simplement votre nom, téléphone, wilaya et adresse. Pas de carte bancaire, pas de compte à créer. Le formulaire prend moins d'une minute.",
              },
              {
                num: "3",
                title: "Confirmation WhatsApp sous 1h ouvrée",
                desc: "Notre équipe vous rappelle ou vous écrit sur WhatsApp pour confirmer la commande, vérifier l'adresse et répondre à vos questions. Rien n'est envoyé avant votre accord explicite.",
              },
              {
                num: "4",
                title: "Livraison Yalidine en 24 à 72h",
                desc: "Votre colis est confié à Yalidine avec numéro de suivi. Vous recevez le SMS quand il arrive au relais, vous venez récupérer, vous ouvrez devant le livreur si vous voulez, vous payez cash.",
              },
              {
                num: "5",
                title: "Satisfaction garantie, retour simple",
                desc: "Le moindre doute sur l'authenticité ou un défaut visible sur le flacon ? Vous refusez le colis. Le retour est à notre charge, et le remboursement traité sous 48h.",
              },
            ].map((step) => (
              <li key={step.num} className="flex gap-5">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111111] mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Contact info */}
        <section className="bg-[#111111] text-white py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Nous joindre</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Siège
                  </p>
                  <p className="text-sm">
                    Blida,
                    <br />
                    Algérie
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                    Téléphone
                  </p>
                  <a href="tel:0699418569" className="text-sm hover:text-[#C9A84C]">
                    06 99 41 85 69
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                    WhatsApp
                  </p>
                  <a
                    href="https://wa.me/33782214993"
                    className="text-sm hover:text-[#C9A84C]"
                  >
                    +33 7 82 21 49 93
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Maillage */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4">
            Explorer
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Parfums Homme", href: "/parfums-homme" },
              { label: "Parfums Femme", href: "/parfums-femme" },
              { label: "Parfums Orientaux", href: "/parfums-orientaux" },
              { label: "Toutes les marques", href: "/marques" },
              { label: "Blog parfumerie", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs border border-gray-200 hover:border-[#C9A84C] hover:text-[#C9A84C] text-gray-600 px-4 py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
