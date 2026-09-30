"use client";

import { usePathname } from "next/navigation";
import FormulaireNewsletter from "./FormulaireNewsletter";

/**
 * Bloc newsletter du pied de page. Il s'efface sur /newsletter, qui porte déjà le
 * formulaire : deux champs identiques sur la même page, c'est un de trop.
 */
export default function BlocNewsletterFooter() {
  if (usePathname() === "/newsletter") return null;
  return (
    <>
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
        <FormulaireNewsletter source="footer" />
      </div>

      {/* HR */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <hr className="border-none" style={{ borderTop: "1px solid #e5e5e5" }} />
      </div>
    </>
  );
}
