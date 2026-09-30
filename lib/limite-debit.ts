// Limite simple du nombre de tentatives par visiteur, gardée en mémoire.
//
// Pourquoi : un robot qui enverrait des milliers d'adresses au formulaire newsletter
// remplirait la liste Brevo de faux contacts. Les emails envoyés ensuite à ces adresses
// rebondiraient, et les rebonds dégradent la réputation d'envoi de tout le compte Brevo —
// y compris celle de l'autre boutique de Shahin si c'est le même compte.
//
// Limite connue : chaque instance du serveur (Vercel en lance plusieurs) a sa propre mémoire.
// Ça arrête une rafale depuis un même visiteur, pas une attaque répartie. Suffisant pour une
// boutique de cette taille, sans ajouter de base de données.

type Compte = { n: number; debut: number };

export function creerLimite(max: number, fenetreMs: number) {
  const comptes = new Map<string, Compte>();

  return function depasse(cle: string, maintenant = Date.now()): boolean {
    // Ménage périodique, pour que la mémoire ne grossisse pas indéfiniment.
    if (comptes.size > 5000) {
      for (const [k, c] of comptes) if (maintenant - c.debut > fenetreMs) comptes.delete(k);
    }
    const c = comptes.get(cle);
    if (!c || maintenant - c.debut > fenetreMs) {
      comptes.set(cle, { n: 1, debut: maintenant });
      return false;
    }
    c.n += 1;
    return c.n > max;
  };
}
