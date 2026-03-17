import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | Maison Numidia",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Mentions Légales</h1>

        <div className="prose prose-gray text-gray-600 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-800">Éditeur du site</h2>
            <p>
              Maison Numidia<br />
              Blida, Algérie<br />
              Email : contact@maisonnumidia.store
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">Hébergement</h2>
            <p>
              Ce site est hébergé par Vercel Inc., 340 Pine Street Suite 701,
              San Francisco, California 94104, USA.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, visuels) est la propriété
              de Maison Numidia. Toute reproduction est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800">Données personnelles</h2>
            <p>
              Les informations collectées via le formulaire de commande (nom, téléphone, wilaya)
              sont utilisées uniquement pour le traitement de votre commande et ne sont pas
              transmises à des tiers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
