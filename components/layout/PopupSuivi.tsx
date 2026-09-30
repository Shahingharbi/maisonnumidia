"use client";

// Petite carte « Suivez-nous », en bas à droite. Elle doit se faire oublier plutôt que
// forcer la main — les règles ci-dessous sont là pour ça, et chacune a une raison :
//
//  - jamais avant la 3e page vue : quelqu'un qui arrive de Google pour un prix n'a pas
//    encore de raison de suivre la marque, lui demander dès l'arrivée fait fuir ;
//  - 15 secondes sur la page avant d'apparaître : on ne coupe pas quelqu'un qui arrive ;
//  - une seule fois par visite, et jamais sur le panier, la commande, la newsletter ou le
//    tableau de bord — on n'interrompt pas un achat ;
//  - fermée : silence 30 jours. Fermée deux fois : plus jamais ;
//  - un réseau cliqué : plus jamais, la personne suit déjà ;
//  - pas de fond assombri, pas de défilement bloqué, pas de vol du focus : la page reste
//    entièrement utilisable pendant qu'elle est affichée. Échap la ferme.
//
// Instagram et Facebook sont déjà en permanence dans le rail de gauche. Ce que la carte
// ajoute, c'est une raison de suivre.

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { FacebookGlyph, InstagramGlyph, URL_FACEBOOK, URL_INSTAGRAM } from "./SocialRail";

const CLE = "mn_suivi";
const CLE_SESSION = "mn_suivi_vu";
const PAGES_AVANT = 3;
const DELAI_MS = 15_000;
const SILENCE_MS = 30 * 24 * 3600 * 1000;
const REFUS_MAX = 2;
const EXCLUS = ["/panier", "/commander", "/newsletter", "/tableau-de-bord"];

type Memoire = { vues: number; fermeLe: number; refus: number; suivi: boolean };

// Le stockage du navigateur peut être indisponible (navigation privée, cookies bloqués) :
// dans ce cas on ne montre rien, plutôt que de risquer d'afficher la carte à chaque page.
function lire(): Memoire | null {
  try {
    const brut = localStorage.getItem(CLE);
    const m = brut ? JSON.parse(brut) : {};
    return { vues: Number(m.vues) || 0, fermeLe: Number(m.fermeLe) || 0, refus: Number(m.refus) || 0, suivi: Boolean(m.suivi) };
  } catch {
    return null;
  }
}
function ecrire(m: Memoire) {
  try { localStorage.setItem(CLE, JSON.stringify(m)); } catch { /* rien */ }
}

export default function PopupSuivi() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  // Animation de SORTIE seulement. L'entrée passe par @starting-style (variante `starting:`) :
  // une première version l'amorçait avec requestAnimationFrame, que le navigateur suspend
  // dans un onglet en arrière-plan. La carte restait alors à opacité 0 — invisible, mais
  // bloquant quand même les clics dans son coin. Sans @starting-style (vieux navigateurs),
  // elle apparaît simplement sans animation.
  const [sortie, setSortie] = useState(false);
  const minuteur = useRef<ReturnType<typeof setTimeout> | null>(null);
  const derniereVue = useRef<string | null>(null);

  // Chaque changement de page compte une vue et réarme (ou non) le minuteur.
  useEffect(() => {
    if (minuteur.current) clearTimeout(minuteur.current);
    const exclu = EXCLUS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    // Arrivé au panier ou à la commande pendant qu'elle est affichée : elle s'efface sans
    // que ça compte comme un refus.
    if (exclu) setVisible(false);

    const m = lire();
    if (!m) return;
    // Le ref évite de compter deux fois la même page quand React rejoue l'effet.
    if (derniereVue.current !== pathname) {
      derniereVue.current = pathname;
      m.vues += 1;
      ecrire(m);
    }

    let dejaVueCetteVisite = true;
    try { dejaVueCetteVisite = sessionStorage.getItem(CLE_SESSION) === "1"; } catch { /* rien */ }
    const eligible =
      !exclu &&
      !dejaVueCetteVisite &&
      !m.suivi &&
      m.refus < REFUS_MAX &&
      m.vues >= PAGES_AVANT &&
      Date.now() - m.fermeLe > SILENCE_MS;
    if (!eligible) return;

    minuteur.current = setTimeout(() => {
      // Quelqu'un en train de taper (recherche, formulaire) n'est pas interrompu.
      const actif = document.activeElement;
      if (actif && (actif.tagName === "INPUT" || actif.tagName === "TEXTAREA" || actif.tagName === "SELECT")) return;
      try { sessionStorage.setItem(CLE_SESSION, "1"); } catch { /* rien */ }
      setSortie(false);
      setVisible(true);
    }, DELAI_MS);

    return () => { if (minuteur.current) clearTimeout(minuteur.current); };
  }, [pathname]);

  const fermer = useCallback(() => {
    const m = lire();
    if (m) ecrire({ ...m, fermeLe: Date.now(), refus: m.refus + 1 });
    setSortie(true);
    setTimeout(() => setVisible(false), 250);
  }, []);

  const suivre = useCallback(() => {
    const m = lire();
    if (m) ecrire({ ...m, suivi: true });
    setSortie(true);
    setTimeout(() => setVisible(false), 250);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") fermer(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, fermer]);

  if (!visible) return null;

  const lien =
    "flex items-center justify-center gap-2 rounded-lg border border-[#E2E2DC] text-[13px] font-medium " +
    "text-[#111111] hover:border-[#C9A84C] transition-colors w-11 h-11 sm:w-auto";

  // Sur téléphone, un bandeau d'une ligne (titre, deux icônes, croix) : la carte complète
  // y couvrait un quart de l'écran, nom et prix du parfum compris. À partir de la
  // tablette, la carte avec son texte.
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="popup-suivi-titre"
      className={`fixed z-40 bottom-3 inset-x-3 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[340px]
        bg-white rounded-lg border border-[#E9E9E4] shadow-[0_12px_40px_-12px_rgba(17,17,17,0.28)]
        transition-all duration-300 ease-out motion-reduce:transition-none
        starting:opacity-0 starting:translate-y-3
        ${sortie ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100 translate-y-0"}`}
    >
      <div className="flex items-center gap-2 pl-4 pr-1.5 py-2 sm:block sm:px-5 sm:pt-5 sm:pb-5">
        <div className="min-w-0 flex-1">
          <p className="hidden sm:block text-[10px] font-semibold tracking-[0.16em] uppercase text-[#C9A84C]">
            Maison Numidia
          </p>
          <p
            id="popup-suivi-titre"
            className="font-[family-name:var(--font-libre-bodoni)] text-[16px] sm:text-[20px] leading-snug text-[#111111] sm:mt-1 sm:pr-8"
          >
            Suivez nos arrivages
          </p>
          <p className="hidden sm:block text-[13px] text-[#6B6B6B] leading-relaxed mt-1.5">
            Nouveautés, retours en stock et coulisses de la boutique de Blida, sur nos réseaux.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 sm:grid sm:grid-cols-2 sm:mt-4">
          <a
            href={URL_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            onClick={suivre}
            aria-label="Suivre Maison Numidia sur Instagram"
            className={lien}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5"
              style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
            >
              <InstagramGlyph />
            </span>
            <span className="hidden sm:inline">Instagram</span>
          </a>
          <a
            href={URL_FACEBOOK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={suivre}
            aria-label="Suivre Maison Numidia sur Facebook"
            className={lien}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#1877F2] [&>svg]:w-3.5 [&>svg]:h-3.5">
              <FacebookGlyph />
            </span>
            <span className="hidden sm:inline">Facebook</span>
          </a>
        </div>

        {/* En dernier dans l'ordre de lecture ; sur tablette et ordinateur, en haut à droite. */}
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer"
          className="shrink-0 w-10 h-10 flex items-center justify-center text-[#9A9A94] hover:text-[#111111] transition-colors sm:absolute sm:top-1.5 sm:right-1.5"
        >
          <X size={17} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
