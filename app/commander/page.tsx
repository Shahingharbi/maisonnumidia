"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Phone, ShoppingBag, ExternalLink } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products";
import emailjs from "@emailjs/browser";

// ─────────────────────────────────────────────────────────────────────────────
// EMAILJS CONFIG — à remplir sur https://www.emailjs.com/
// 1. Crée un compte gratuit
// 2. Add Service → Gmail (ou autre) → copie le Service ID
// 3. Email Templates → crée un template → copie le Template ID
// 4. Account → API Keys → copie la Public Key
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "YOUR_PUBLIC_KEY";

// Ton numéro WhatsApp France (pour le redirect après commande)
const WHATSAPP_NUMBER = "33782214993";

const wilayas = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
  "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
  "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
  "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Oran","El Bayadh",
  "Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued",
  "Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent",
  "Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès",
  "In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Menia",
];

export default function CommanderPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [adresse, setAdresse] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Build order text
    const lignesCommande = items
      .map((i) => `• ${i.brand} ${i.name} x${i.quantity} = ${formatPrice(i.price * i.quantity)}`)
      .join("\n");
    const orderText = `${lignesCommande}\n\nTOTAL : ${formatPrice(subtotal)}`;

    // ── 1. Send via EmailJS ───────────────────────────────────────────────────
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          client_nom:       nom,
          client_telephone: telephone,
          client_wilaya:    wilaya,
          client_adresse:   adresse || "—",
          client_message:   message || "—",
          commande_details: orderText,
          commande_total:   formatPrice(subtotal),
          site_source:      "maisonnumidia.store",
        },
        EMAILJS_PUBLIC_KEY,
      );
    } catch (err) {
      console.error("EmailJS error:", err);
      // Don't block the order — still show success and WhatsApp
    }

    // ── 2. Build WhatsApp redirect URL ───────────────────────────────────────
    const waText = encodeURIComponent(
      `🛒 Nouvelle commande Maison Numidia\n\n` +
      `👤 Nom : ${nom}\n` +
      `📞 Tél : ${telephone}\n` +
      `📍 Wilaya : ${wilaya}\n` +
      (adresse ? `🏠 Adresse : ${adresse}\n` : "") +
      `\n📦 Commande :\n${lignesCommande}\n\n` +
      `💰 Total : ${formatPrice(subtotal)}\n` +
      (message ? `\n💬 Message : ${message}` : "")
    );
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
    setWhatsappUrl(waUrl);

    clearCart();
    setLoading(false);
    setSubmitted(true);
  }

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 pt-20">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={28} className="text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-3">Votre panier est vide</h1>
          <p className="text-gray-400 mb-8">Ajoutez des parfums avant de commander.</p>
          <Link
            href="/parfums-homme"
            className="inline-block bg-[#111111] hover:bg-[#333333] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            Voir les parfums
          </Link>
        </div>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#111111] mb-3">Commande envoyée !</h1>
            <p className="text-gray-500 leading-relaxed">
              Merci <strong className="text-[#111111]">{nom}</strong>. Vous recevrez un appel
              de confirmation au <strong className="text-[#111111]">{telephone}</strong> dans
              les prochaines heures.
            </p>
          </div>

          {/* WhatsApp CTA — envoie le récap dans WhatsApp */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-white mb-4 transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg viewBox="0 0 32 32" width="20" height="20" fill="white">
                <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.356.627 4.665 1.817 6.687L2.667 29.333l6.84-1.793A13.278 13.278 0 0016.003 29.333C23.364 29.333 29.333 23.364 29.333 16S23.364 2.667 16.003 2.667zm5.99 18.079c-.328-.164-1.942-.957-2.243-1.066-.301-.11-.52-.164-.739.164-.22.328-.85 1.066-.04 1.285.819.22 1.395.41 1.887.574.492.163 1.092.124 1.394-.22.301-.348.328-.819.164-1.148a.508.508 0 00-.164-.164l-.26-.425zm-5.558 5.215c-4.444-2.218-6.678-7.128-6.678-7.128s.93-1.038 1.148-1.723c.22-.685.11-1.37-.274-1.887-.383-.52-.929-1.203-1.312-1.723-.384-.52-.711-.355-.984-.301l-.984.21c-.328.075-.656.41-.82.684-.164.274-.465 1.477.137 2.93.6 1.449 2.025 4.006 4.444 5.59 2.42 1.585 4.334 1.888 5.262 1.888h.548c.82 0 1.64-.328 2.16-.847l.493-.52c.218-.219.109-.465-.11-.574l-2.03-1.599z"/>
              </svg>
              Confirmer sur WhatsApp
              <ExternalLink size={14} />
            </a>
          )}

          <Link
            href="/"
            className="block w-full text-center border border-gray-200 text-gray-600 hover:border-[#C9A84C] hover:text-[#C9A84C] font-medium px-7 py-3.5 rounded-xl transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        <div className="mb-10">
          <span className="text-xs font-semibold text-[#C9A84C] tracking-[0.2em] uppercase">
            Paiement à la livraison
          </span>
          <h1 className="text-3xl font-bold text-[#111111] mt-2">Finaliser ma commande</h1>
          <p className="text-gray-400 mt-2">
            Remplissez le formulaire — nous vous appelons pour confirmer la livraison.
          </p>
        </div>

        {/* Cart summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
          <p className="text-xs font-semibold text-[#C9A84C] tracking-[0.15em] uppercase mb-4">
            Votre commande
          </p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400">{item.brand}</p>
                  <p className="text-sm font-medium text-[#111111] truncate">{item.name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                  <p className="text-sm font-semibold text-[#111111]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
            <span className="text-sm font-bold text-[#111111]">Total</span>
            <span className="text-base font-bold text-[#111111]">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-3">
            <Link href="/panier" className="text-xs text-[#C9A84C] hover:text-[#8B6914] transition-colors">
              ← Modifier le panier
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Prénom &amp; Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Mohamed Benali"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="0555 XX XX XX"
                pattern="^0[5-7]\d{8}$"
                title="Numéro algérien valide (ex: 0555123456)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Wilaya <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition bg-white"
            >
              <option value="">Sélectionnez votre wilaya</option>
              {wilayas.map((w, i) => (
                <option key={w} value={w}>{String(i + 1).padStart(2, "0")} — {w}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Adresse <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Rue, quartier, commune..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Message <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Questions, demandes particulières..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}

          <div className="bg-[#FAFAF8] rounded-xl p-4 text-sm text-gray-500 space-y-1">
            <p>✓ Aucun paiement en ligne — vous payez à la réception</p>
            <p>✓ Livraison Yalidine 24–72h dans toutes les wilayas</p>
            <p>✓ Confirmation par appel dans les 24h</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] hover:bg-[#333] disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors text-base"
          >
            {loading ? "Envoi en cours..." : `Valider la commande — ${formatPrice(subtotal)}`}
          </button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Des questions ?</p>
          <a
            href="tel:0699418569"
            className="inline-flex items-center gap-2 mt-2 text-[#C9A84C] font-medium text-sm hover:text-[#8B6914] transition-colors"
          >
            <Phone size={14} />
            06 99 41 85 69
          </a>
        </div>

      </div>
    </div>
  );
}
