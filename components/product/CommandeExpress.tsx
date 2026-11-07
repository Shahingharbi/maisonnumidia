"use client";

// Commande en un geste depuis la fiche produit : des clients qui veulent un seul parfum ne
// trouvaient pas le panier. Le formulaire passe par le même service et le même modèle
// EmailJS que /commander, donc la commande arrive au vendeur sous la même forme.
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/products";
import { WILAYAS } from "@/lib/tdb/constantes";

const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "YOUR_PUBLIC_KEY";
const WHATSAPP_NUMBER = "213794496059";

interface Props {
  brand: string;
  name: string;
  slug: string;
  price: number;
  volume: string;
}

const champ =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#111111] bg-white focus:outline-none focus:border-[#C9A84C] transition-colors";

export default function CommandeExpress({ brand, name, slug, price, volume }: Props) {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [message, setMessage] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [fini, setFini] = useState<"" | "ok" | "whatsapp">("");
  const [waUrl, setWaUrl] = useState("");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnvoi(true);
    const ligne = `• ${brand} ${name} ${volume} x1 = ${formatPrice(price)}`;
    const details = `${ligne}\n\nTOTAL : ${formatPrice(price)}\n\nCommande express depuis la fiche /parfums/${slug}`;

    // Lien WhatsApp préparé dans tous les cas : c'est le secours si l'email ne part pas.
    setWaUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `🛒 Commande Maison Numidia\n\n👤 ${nom}\n📞 ${telephone}\n📍 ${wilaya}, ${commune}\n\n📦 ${ligne}` +
      (message ? `\n\n💬 ${message}` : ""))}`);

    let ok = false;
    if (EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" && EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          name: nom,
          email: "",
          client_nom: nom,
          client_telephone: telephone,
          client_wilaya: wilaya,
          client_adresse: commune,
          client_message: message || "—",
          commande_details: details,
          commande_total: formatPrice(price),
          site_source: "maisonnumidia.store (commande express)",
        }, EMAILJS_PUBLIC_KEY);
        ok = true;
      } catch (err) {
        console.error("EmailJS error:", err);
      }
    } else {
      console.error("[Commande express] EmailJS non configuré : variables NEXT_PUBLIC_EMAILJS_* absentes du build.");
    }
    setEnvoi(false);
    setFini(ok ? "ok" : "whatsapp");
  }

  if (fini) {
    return (
      <div className="border border-[#C9A84C]/40 bg-[#FAFAF8] rounded-lg p-5 text-center">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={28} />
        {fini === "ok" ? (
          <>
            <p className="font-semibold text-[#111111]">Commande reçue, merci {nom.split(" ")[0]} !</p>
            <p className="text-sm text-gray-600 mt-1">Nous vous appelons très vite au {telephone} pour confirmer la livraison.</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-[#111111]">Dernière étape pour valider votre commande</p>
            <p className="text-sm text-gray-600 mt-1 mb-3">Envoyez-nous le récapitulatif en un clic :</p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Confirmer ma commande
            </a>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} className="border border-[#C9A84C]/40 bg-[#FAFAF8] rounded-lg p-4 sm:p-5">
      <p className="font-semibold text-[#111111]">Commander directement</p>
      <p className="text-xs text-gray-500 mt-0.5 mb-3">Paiement à la livraison · Livraison dans les 69 wilayas</p>
      <div className="grid grid-cols-2 gap-2.5">
        <input className={champ} required placeholder="Nom complet" autoComplete="name"
          value={nom} onChange={(e) => setNom(e.target.value)} />
        <input className={champ} required type="tel" inputMode="tel" placeholder="Téléphone" autoComplete="tel"
          pattern="^[+0-9 ().\-]{8,20}$" title="Numéro de téléphone (algérien ou étranger)"
          value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        <select className={champ} required value={wilaya} onChange={(e) => setWilaya(e.target.value)}>
          <option value="" disabled>Wilaya</option>
          {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
        <input className={champ} required placeholder="Commune"
          value={commune} onChange={(e) => setCommune(e.target.value)} />
        <textarea className={`${champ} col-span-2 resize-none`} rows={2} placeholder="Message (facultatif)"
          value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <button type="submit" disabled={envoi}
        className="w-full mt-3 bg-[#C9A84C] hover:bg-[#8B6914] disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition-colors">
        {envoi ? "Envoi en cours…" : `Commander · ${formatPrice(price)}`}
      </button>
    </form>
  );
}
