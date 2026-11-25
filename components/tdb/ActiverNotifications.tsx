"use client";

// Un seul geste : activer les alertes de commande sur le téléphone qu'on tient
// en main. Les trois associés passent par ici, et aucun n'est technicien : tout
// ce qui est écrit à l'écran doit se comprendre sans connaître le mot
// « notification push », « service worker » ou « abonnement ».
//
// Le service worker est déjà écrit (/sw-tdb.js) et le manifeste aussi
// (/tdb.webmanifest) : ce composant ne fait que les brancher et prévenir le
// serveur (/api/tableau-de-bord/push) que cet appareil veut être réveillé.

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  BellOff,
  BellRing,
  Check,
  EllipsisVertical,
  LoaderCircle,
  Share,
  Smartphone,
  TriangleAlert,
} from "lucide-react";
import { BORDURE, Carte } from "./ui";

const CHEMIN_SERVICE_WORKER = "/sw-tdb.js";
const ROUTE_PUSH = "/api/tableau-de-bord/push";

const VERT = "#1E7A45";
const VERT_FOND = "#E4F4EA";
const ROUGE = "#B3261E";
const ROUGE_FOND = "#FBE7E5";
const AMBRE = "#9A5B00";
const AMBRE_FOND = "#FDF1DC";
const BLEU = "#1F4E79";
const BLEU_FOND = "#E5EDF6";

const TEXTE_NON_CONFIGURE =
  "Les notifications ne sont pas encore prêtes sur le serveur. Rien à faire de votre côté pour l'instant.";

type Etat =
  | "chargement"
  | "non-supporte"
  | "non-configure"
  | "refuse"
  | "disponible"
  | "actif";

type Message = { ton: "ok" | "erreur"; texte: string };

/**
 * Convertit la clé publique du serveur (base64url) en octets, seule forme
 * acceptée par `pushManager.subscribe`.
 */
function cleEnOctets(cleBase64url: string): Uint8Array<ArrayBuffer> {
  const complement = "=".repeat((4 - (cleBase64url.length % 4)) % 4);
  const base64 = (cleBase64url + complement).replace(/-/g, "+").replace(/_/g, "/");
  const brut = atob(base64);
  const octets = new Uint8Array(brut.length);
  for (let i = 0; i < brut.length; i += 1) octets[i] = brut.charCodeAt(i);
  return octets;
}

/** Étiquette courte et lisible de l'appareil, pour s'y retrouver côté serveur. */
function nomAppareil(): string {
  const ua = navigator.userAgent;
  const systeme = /iphone/i.test(ua)
    ? "iPhone"
    : /ipad/i.test(ua)
      ? "iPad"
      : /android/i.test(ua)
        ? "Android"
        : /windows/i.test(ua)
          ? "Windows"
          : /mac os/i.test(ua)
            ? "Mac"
            : "Appareil";
  const navigateur = /edg\//i.test(ua)
    ? "Edge"
    : /opr\//i.test(ua)
      ? "Opera"
      : /chrome\//i.test(ua)
        ? "Chrome"
        : /firefox\//i.test(ua)
          ? "Firefox"
          : /safari\//i.test(ua)
            ? "Safari"
            : "navigateur";
  return `${systeme} · ${navigateur}`;
}

/** iPhone et iPad, y compris l'iPad récent qui se présente comme un Mac. */
function estAppareilApple(): boolean {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return true;
  return /macintosh/i.test(ua) && navigator.maxTouchPoints > 1;
}

/** L'espace tourne-t-il déjà depuis l'écran d'accueil ? */
function estDejaInstalle(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) return true;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

/** Suit le passage de l'onglet au mode installé (écran d'accueil). */
function suivreModeInstalle(rappel: () => void): () => void {
  if (typeof window.matchMedia !== "function") return () => {};
  const requete = window.matchMedia("(display-mode: standalone)");
  requete.addEventListener("change", rappel);
  return () => requete.removeEventListener("change", rappel);
}

/** Valeur lue une fois sur l'appareil : rien ne la fera changer en cours de route. */
function neRienSuivre(): () => void {
  return () => {};
}

// Au rendu serveur on suppose « déjà installé » et « pas un iPhone » : le bloc
// d'installation n'apparaît donc qu'une fois l'appareil connu, sans clignoter.
const SUPPOSE_INSTALLE = () => true;
const SUPPOSE_PAS_APPLE = () => false;

/** Les deux instructions sont toujours visibles ; `enAvant` met en valeur celle
 * qui correspond au téléphone qu'on tient en main. */
function cadre(enAvant: boolean): string {
  return `rounded-lg px-4 py-4 ${enAvant ? "" : BORDURE}`;
}

function BlocIphone({ enAvant }: { enAvant: boolean }) {
  return (
    <div
      className={cadre(enAvant)}
      style={enAvant ? { backgroundColor: AMBRE_FOND } : undefined}
    >
      <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.06em] uppercase text-[#111111]">
        <Share size={16} color={enAvant ? AMBRE : "#6B6B6B"} aria-hidden="true" />
        Sur iPhone
      </p>
      <p className="text-[14px] leading-relaxed text-[#4A4A4A] mt-2">
        Touchez le bouton Partager en bas de Safari, puis « Sur l&apos;écran d&apos;accueil ».
      </p>
      <p className="text-[13px] leading-relaxed mt-2 font-medium" style={{ color: AMBRE }}>
        Sur iPhone, cette étape est obligatoire pour recevoir les notifications.
      </p>
    </div>
  );
}

function BlocAndroid({ enAvant }: { enAvant: boolean }) {
  return (
    <div
      className={cadre(enAvant)}
      style={enAvant ? { backgroundColor: AMBRE_FOND } : undefined}
    >
      <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.06em] uppercase text-[#111111]">
        <EllipsisVertical size={16} color={enAvant ? AMBRE : "#6B6B6B"} aria-hidden="true" />
        Sur Android
      </p>
      <p className="text-[14px] leading-relaxed text-[#4A4A4A] mt-2">
        Ouvrez le menu de Chrome en haut à droite, puis « Ajouter à l&apos;écran d&apos;accueil ».
      </p>
    </div>
  );
}

export default function ActiverNotifications() {
  const [etat, setEtat] = useState<Etat>("chargement");
  const [clePublique, setClePublique] = useState("");
  const [texteIndisponible, setTexteIndisponible] = useState(TEXTE_NON_CONFIGURE);
  const [message, setMessage] = useState<Message | null>(null);
  const [occupe, setOccupe] = useState(false);

  const modeInstalle = useSyncExternalStore(
    suivreModeInstalle,
    estDejaInstalle,
    SUPPOSE_INSTALLE,
  );
  const surApple = useSyncExternalStore(neRienSuivre, estAppareilApple, SUPPOSE_PAS_APPLE);

  useEffect(() => {
    let vivant = true;

    (async () => {
      const supporte =
        "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!supporte) {
        if (vivant) setEtat("non-supporte");
        return;
      }
      try {
        const reponse = await fetch(ROUTE_PUSH, { cache: "no-store" });
        const donnees = (await reponse.json()) as {
          ok?: boolean;
          clePublique?: string;
          actif?: boolean;
        };
        if (!vivant) return;
        if (!reponse.ok || !donnees.ok || !donnees.actif || !donnees.clePublique) {
          setTexteIndisponible(TEXTE_NON_CONFIGURE);
          setEtat("non-configure");
          return;
        }
        setClePublique(donnees.clePublique);

        const enregistrement = await navigator.serviceWorker.getRegistration();
        const abonnement = enregistrement
          ? await enregistrement.pushManager.getSubscription()
          : null;
        if (!vivant) return;

        if (abonnement && Notification.permission === "granted") {
          setEtat("actif");
        } else if (Notification.permission === "denied") {
          setEtat("refuse");
        } else {
          setEtat("disponible");
        }
      } catch {
        if (!vivant) return;
        setTexteIndisponible(
          "Impossible de vérifier pour le moment. Rechargez la page dans un instant.",
        );
        setEtat("non-configure");
      }
    })();

    return () => {
      vivant = false;
    };
  }, []);

  const activer = useCallback(async () => {
    setOccupe(true);
    setMessage(null);
    try {
      let enregistrement: ServiceWorkerRegistration;
      try {
        enregistrement = await navigator.serviceWorker.register(CHEMIN_SERVICE_WORKER);
      } catch {
        setMessage({
          ton: "erreur",
          texte: "Ce navigateur n'a pas pu préparer les alertes. Rechargez la page et réessayez.",
        });
        return;
      }

      let permission: NotificationPermission;
      try {
        permission = await Notification.requestPermission();
      } catch {
        setMessage({
          ton: "erreur",
          texte: "La demande d'autorisation n'a pas pu s'ouvrir. Rechargez la page et réessayez.",
        });
        return;
      }
      if (permission === "denied") {
        setEtat("refuse");
        return;
      }
      if (permission !== "granted") {
        setMessage({
          ton: "erreur",
          texte: "La question a été fermée sans réponse. Touchez le bouton, puis choisissez Autoriser.",
        });
        return;
      }

      let cle = clePublique;
      if (!cle) {
        try {
          const reponse = await fetch(ROUTE_PUSH, { cache: "no-store" });
          const donnees = (await reponse.json()) as { clePublique?: string; actif?: boolean };
          if (donnees.actif && donnees.clePublique) {
            cle = donnees.clePublique;
            setClePublique(cle);
          }
        } catch {
          cle = "";
        }
      }
      if (!cle) {
        setMessage({
          ton: "erreur",
          texte: "Les alertes ne sont pas encore prêtes sur le serveur. Réessayez plus tard.",
        });
        return;
      }

      let abonnement = await enregistrement.pushManager.getSubscription();
      if (!abonnement) {
        try {
          abonnement = await enregistrement.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: cleEnOctets(cle),
          });
        } catch {
          setMessage({
            ton: "erreur",
            texte:
              "Ce téléphone a refusé de créer l'alerte. Vérifiez qu'il est connecté à internet, puis réessayez.",
          });
          return;
        }
      }

      const brut = abonnement.toJSON();
      const p256dh = brut.keys?.p256dh ?? "";
      const auth = brut.keys?.auth ?? "";
      if (!brut.endpoint || !p256dh || !auth) {
        setMessage({
          ton: "erreur",
          texte: "L'alerte créée par le téléphone est incomplète. Rechargez la page et réessayez.",
        });
        return;
      }

      let reponse: Response;
      try {
        reponse = await fetch(ROUTE_PUSH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: brut.endpoint,
            cles: { p256dh, auth },
            appareil: nomAppareil(),
          }),
        });
      } catch {
        setMessage({
          ton: "erreur",
          texte: "Pas de connexion au serveur. Vérifiez internet, puis réessayez.",
        });
        return;
      }
      if (reponse.status === 401) {
        setMessage({
          ton: "erreur",
          texte: "Votre session a expiré. Reconnectez-vous, puis touchez à nouveau le bouton.",
        });
        return;
      }
      if (!reponse.ok) {
        setMessage({
          ton: "erreur",
          texte: "Le serveur n'a pas pu enregistrer ce téléphone. Réessayez dans un instant.",
        });
        return;
      }

      setEtat("actif");
      setMessage({
        ton: "ok",
        texte: "C'est fait. Ce téléphone sonnera dès qu'une commande arrivera.",
      });

      try {
        await enregistrement.showNotification("Alertes activées", {
          body: "Voici à quoi ressemblera le message quand une commande arrivera.",
          icon: "/logo-192.png",
          badge: "/logo-192.png",
          tag: "essai-tdb",
        });
      } catch {
        // L'essai n'a pas pu s'afficher : les vraies alertes marchent quand même.
      }
    } finally {
      setOccupe(false);
    }
  }, [clePublique]);

  const desactiver = useCallback(async () => {
    setOccupe(true);
    setMessage(null);
    try {
      const enregistrement = await navigator.serviceWorker.getRegistration();
      const abonnement = enregistrement
        ? await enregistrement.pushManager.getSubscription()
        : null;
      const endpoint = abonnement ? abonnement.endpoint : "";
      if (abonnement) await abonnement.unsubscribe();
      if (endpoint) {
        await fetch(ROUTE_PUSH, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });
      }
      setEtat("disponible");
      setMessage({ ton: "ok", texte: "Ce téléphone ne recevra plus d'alerte." });
    } catch {
      setMessage({
        ton: "erreur",
        texte: "Impossible d'arrêter les alertes pour l'instant. Réessayez dans un instant.",
      });
    } finally {
      setOccupe(false);
    }
  }, []);

  return (
    <div className="space-y-4">
      <Carte className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span
            className="shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: etat === "actif" ? VERT_FOND : "#F6EFDD" }}
            aria-hidden="true"
          >
            <BellRing size={22} color={etat === "actif" ? VERT : "#8B6914"} />
          </span>
          <div className="min-w-0">
            <h2 className="font-[family-name:var(--font-libre-bodoni)] text-[21px] sm:text-[23px] leading-tight text-[#111111]">
              Être prévenu des commandes
            </h2>
            <p className="text-[14px] leading-relaxed text-[#4A4A4A] mt-2">
              Ce téléphone sonne dès qu&apos;une commande arrive, même rangé dans la poche. Il n&apos;y
              a aucune application à installer.
            </p>
          </div>
        </div>

        <div className="mt-5">
          {etat === "chargement" && (
            <p className="flex items-center gap-2 text-[14px] text-[#8A8A84]">
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              Vérification en cours
            </p>
          )}

          {etat === "non-supporte" && (
            <div
              className="rounded-lg px-4 py-4 flex items-start gap-3"
              style={{ backgroundColor: AMBRE_FOND }}
            >
              <TriangleAlert size={20} color={AMBRE} className="shrink-0 mt-[1px]" aria-hidden="true" />
              <p className="text-[14px] leading-relaxed" style={{ color: AMBRE }}>
                {surApple && !modeInstalle
                  ? "Sur iPhone, il faut d'abord mettre les commandes sur l'écran d'accueil, comme expliqué juste en dessous. Les alertes deviennent possibles ensuite."
                  : "Ce navigateur ne sait pas afficher d'alerte. Sur Android, ouvrez cette page dans Chrome. Sur iPhone, ouvrez-la dans Safari, puis mettez-la sur l'écran d'accueil."}
              </p>
            </div>
          )}

          {etat === "non-configure" && (
            <div
              className="rounded-lg px-4 py-4 flex items-start gap-3"
              style={{ backgroundColor: BLEU_FOND }}
            >
              <BellOff size={20} color={BLEU} className="shrink-0 mt-[1px]" aria-hidden="true" />
              <p className="text-[14px] leading-relaxed" style={{ color: BLEU }}>
                {texteIndisponible}
              </p>
            </div>
          )}

          {etat === "refuse" && (
            <div
              className="rounded-lg px-4 py-4 flex items-start gap-3"
              style={{ backgroundColor: ROUGE_FOND }}
            >
              <BellOff size={20} color={ROUGE} className="shrink-0 mt-[1px]" aria-hidden="true" />
              <p className="text-[14px] leading-relaxed" style={{ color: ROUGE }}>
                Les alertes ont été bloquées sur ce téléphone. Touchez le petit cadenas à côté de
                l&apos;adresse du site, puis autorisez les notifications. Revenez ensuite ici.
              </p>
            </div>
          )}

          {etat === "disponible" && (
            <button
              type="button"
              onClick={activer}
              disabled={occupe}
              className="w-full min-h-[56px] rounded-lg bg-[#111111] text-white px-5 py-4 text-[16px] font-semibold flex items-center justify-center gap-2.5 transition-colors hover:bg-[#2C2C2C] disabled:opacity-50"
            >
              {occupe ? (
                <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />
              ) : (
                <BellRing size={20} aria-hidden="true" />
              )}
              {occupe ? "Un instant" : "Activer les notifications sur ce téléphone"}
            </button>
          )}

          {etat === "actif" && (
            <div>
              <div
                className="rounded-lg px-4 py-4 flex items-center gap-3"
                style={{ backgroundColor: VERT_FOND }}
              >
                <Check size={22} color={VERT} className="shrink-0" aria-hidden="true" />
                <p className="text-[15px] font-semibold" style={{ color: VERT }}>
                  Notifications actives sur ce téléphone
                </p>
              </div>
              <button
                type="button"
                onClick={desactiver}
                disabled={occupe}
                className="mt-3 min-h-[44px] w-full sm:w-auto px-3 text-[13px] text-[#8A8A84] underline underline-offset-4 hover:text-[#111111] disabled:opacity-50"
              >
                {occupe ? "Un instant" : "Ne plus me notifier ici"}
              </button>
            </div>
          )}
        </div>

        {message && (
          <p
            className="mt-4 rounded-lg px-4 py-3 text-[14px] leading-relaxed"
            style={{
              backgroundColor: message.ton === "ok" ? VERT_FOND : ROUGE_FOND,
              color: message.ton === "ok" ? VERT : ROUGE,
            }}
            role="status"
          >
            {message.texte}
          </p>
        )}
      </Carte>

      {!modeInstalle && (
        <Carte className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span
              className="shrink-0 w-11 h-11 rounded-lg bg-[#F2F2EF] flex items-center justify-center"
              aria-hidden="true"
            >
              <Smartphone size={22} color="#4A4A4A" />
            </span>
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-libre-bodoni)] text-[19px] leading-tight text-[#111111]">
                Mettre sur l&apos;écran d&apos;accueil
              </h2>
              <p className="text-[14px] leading-relaxed text-[#4A4A4A] mt-2">
                Les commandes s&apos;ouvrent alors d&apos;un seul geste, comme une application.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {surApple ? (
              <>
                <BlocIphone enAvant />
                <BlocAndroid enAvant={false} />
              </>
            ) : (
              <>
                <BlocAndroid enAvant />
                <BlocIphone enAvant={false} />
              </>
            )}
          </div>
        </Carte>
      )}
    </div>
  );
}
