// Rail social flottant (gauche) — avis Google, Instagram, Facebook, WhatsApp.
// Chaque bouton = cercle avec logo officiel ; au survol il se déplie en pastille
// avec son propre texte d'appel à l'action. Logos officiels en SVG (qualité nette).

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="white" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
function FacebookGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="white" aria-hidden="true">
      <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.6H6.6v3.56h3.08V22h3.68v-9.14h3.06l.46-3.56h-3.52V7.05c0-1.03.28-1.73 1.76-1.73Z" />
    </svg>
  );
}
function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="white" aria-hidden="true">
      <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.356.627 4.665 1.817 6.687L2.667 29.333l6.84-1.793A13.278 13.278 0 0016.003 29.333C23.364 29.333 29.333 23.364 29.333 16S23.364 2.667 16.003 2.667zm0 24.267c-2.027 0-4.012-.546-5.747-1.58l-.413-.245-4.058 1.063 1.083-3.948-.27-.427A10.907 10.907 0 015.067 16C5.067 9.965 9.965 5.067 16.003 5.067S26.933 9.965 26.933 16c0 6.038-4.896 10.934-10.93 10.934zm6.135-8.179c-.336-.168-1.988-.981-2.296-1.093-.308-.112-.532-.168-.756.168-.224.336-.868 1.093-1.064 1.317-.196.224-.392.252-.728.084-.336-.168-1.419-.523-2.703-1.668-.999-.891-1.673-1.991-1.869-2.327-.196-.336-.021-.518.147-.685.151-.15.336-.392.504-.588.168-.196.224-.336.336-.56.112-.224.056-.42-.028-.588-.084-.168-.756-1.823-1.036-2.495-.273-.655-.551-.566-.756-.577l-.644-.011c-.224 0-.588.084-.896.42-.308.336-1.176 1.149-1.176 2.804s1.204 3.252 1.372 3.476c.168.224 2.37 3.619 5.742 5.075.802.346 1.428.553 1.916.708.805.256 1.537.22 2.116.133.645-.096 1.988-.813 2.268-1.597.28-.784.28-1.456.196-1.597-.084-.14-.308-.224-.644-.392z" />
    </svg>
  );
}

interface Item {
  href: string;
  label: string;
  bg: string;
  color: string;
  logo: React.ReactNode;
}

const items: Item[] = [
  { href: "https://g.page/r/CbvXGSvflJQzEAE/review", label: "Laissez-nous un avis", bg: "#ffffff", color: "#4285F4", logo: <GoogleG /> },
  { href: "https://www.instagram.com/maisonnumidia.dz/", label: "Suivez-nous sur Instagram", bg: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "#ffffff", logo: <InstagramGlyph /> },
  { href: "https://www.facebook.com/share/1KpReQm4Z5/?mibextid=wwXIfr", label: "Suivez-nous sur Facebook", bg: "#1877F2", color: "#ffffff", logo: <FacebookGlyph /> },
  { href: "https://wa.me/33782214993", label: "Contactez-nous sur WhatsApp", bg: "#25D366", color: "#ffffff", logo: <WhatsAppGlyph /> },
];

export default function SocialRail() {
  return (
    <div className="fixed left-3 sm:left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5 sm:gap-3">
      {items.map((it) => (
        <a
          key={it.href}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.label}
          className="group flex items-center h-11 sm:h-14 rounded-full shadow-lg ring-1 ring-black/5 overflow-hidden hover:shadow-xl transition-shadow duration-200"
          style={{ background: it.bg }}
        >
          <span className="flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 shrink-0">
            {it.logo}
          </span>
          <span
            className="max-w-0 group-hover:max-w-[260px] overflow-hidden whitespace-nowrap pr-0 group-hover:pr-5 font-semibold text-sm transition-all duration-300 ease-out"
            style={{ color: it.color }}
          >
            {it.label}
          </span>
        </a>
      ))}
    </div>
  );
}
