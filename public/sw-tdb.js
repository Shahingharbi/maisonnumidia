// Service worker du tableau de bord interne.
//
// Il ne sert qu'à une chose : recevoir le réveil envoyé par le serveur quand une
// commande arrive, aller chercher son contenu, et afficher la notification sur
// le téléphone. Le serveur n'envoie aucune donnée dans le réveil lui-même, donc
// rien de sensible ne transite par les serveurs push de Google ou d'Apple.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Présence volontaire : certains navigateurs n'installent une application que si
// le service worker a un gestionnaire de requêtes. Celui-ci ne change rien.
self.addEventListener("fetch", () => {});

function prix(n) {
  return `${Math.round(Number(n) || 0).toLocaleString("fr-FR").replace(/ | /g, " ")} DA`;
}

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let titre = "Nouvelle commande";
      let corps = "Ouvrir le tableau de bord";
      let url = "/tableau-de-bord";
      let tag = "commande";

      try {
        const reponse = await fetch("/api/tableau-de-bord/commandes?limite=1", {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (reponse.ok) {
          const data = await reponse.json();
          const c = data && data.commandes && data.commandes[0];
          if (c) {
            const parfums = (c.articles || [])
              .map((a) => `${a.marque} ${a.nom}${a.qte > 1 ? ` x${a.qte}` : ""}`)
              .join(", ");
            titre = `Commande ${c.numero} — ${prix(c.total)}`;
            corps = `${c.client} · ${c.wilaya || "wilaya non précisée"}\n${parfums}`;
            url = `/tableau-de-bord?c=${encodeURIComponent(c.numero)}`;
            tag = `commande-${c.numero}`;
          }
        }
      } catch {
        // Hors ligne au moment du réveil : on affiche quand même l'alerte.
      }

      await self.registration.showNotification(titre, {
        body: corps,
        icon: "/logo-192.png",
        badge: "/logo-192.png",
        vibrate: [220, 120, 220],
        tag,
        renotify: true,
        requireInteraction: true,
        data: { url },
      });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const cible = (event.notification.data && event.notification.data.url) || "/tableau-de-bord";
  event.waitUntil(
    (async () => {
      const fenetres = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      for (const f of fenetres) {
        if (f.url.includes("/tableau-de-bord")) {
          await f.focus();
          if ("navigate" in f) {
            try {
              await f.navigate(cible);
            } catch {
              // déjà au bon endroit
            }
          }
          return;
        }
      }
      await self.clients.openWindow(cible);
    })(),
  );
});
