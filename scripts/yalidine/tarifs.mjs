// Récupère les tarifs de livraison Yalidine (départ Blida, service express) et les bureaux stop-desk.
//
//   node --env-file=.env.local scripts/yalidine/tarifs.mjs
//
// Sorties :
//   data/livraison.json             complet (adresses des bureaux), lu au build par la page /livraison
//   data/livraison-formulaire.json  léger (prix + noms des bureaux), embarqué dans les formulaires de commande
//   data/livraison-communes.json    communes livrables à domicile par wilaya, chargées par le formulaire
//                                   seulement quand le client a choisi sa wilaya (morceau JS séparé)
//
// La clé API (YALIDINE_API_ID, YALIDINE_API_TOKEN) vit dans .env.local et nulle part ailleurs :
// le dépôt est public. Les tarifs, eux, sont publics et peuvent être committés.
// À relancer quand Yalidine change ses prix, puis commit + push.
import fs from "node:fs";

const API = "https://api.yalidine.app/v1";
const DEPART = 9; // Blida
const { YALIDINE_API_ID: ID, YALIDINE_API_TOKEN: TOKEN } = process.env;
if (!ID || !TOKEN) {
  console.error("YALIDINE_API_ID / YALIDINE_API_TOKEN absents. Lancer avec --env-file=.env.local");
  process.exit(1);
}

// Quotas Yalidine : 5/s, 50/min, 1 000/h, 10 000/jour. On espace les appels et on attend
// la minute suivante si le quota restant devient bas.
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(chemin) {
  for (let essai = 1; essai <= 4; essai++) {
    let res;
    try {
      res = await fetch(API + chemin, { headers: { "X-API-ID": ID, "X-API-TOKEN": TOKEN } });
    } catch (err) {
      // Coupure réseau (ECONNRESET vu le 11/11/2026) : on attend et on réessaie.
      console.warn(`  ${chemin} : ${err.cause?.code ?? err.message}, essai ${essai}/4`);
      await pause(5_000 * essai);
      continue;
    }
    const resteMinute = Number(res.headers.get("minute-quota-left") ?? 50);
    if (res.status === 429 || resteMinute <= 2) await pause(61_000);
    else await pause(1_300);
    if (res.ok) return res.json();
    if (res.status === 401 || res.status === 403) throw new Error(`Clé API refusée (${res.status})`);
    console.warn(`  ${chemin} : HTTP ${res.status}, essai ${essai}/4`);
  }
  throw new Error(`Échec définitif : ${chemin}`);
}
async function toutesLesPages(chemin) {
  const out = [];
  for (let page = 1; ; page++) {
    const sep = chemin.includes("?") ? "&" : "?";
    const j = await get(`${chemin}${sep}page_size=1000&page=${page}`);
    out.push(...j.data);
    if (!j.has_more) return out;
  }
}

console.log("Wilayas, communes, bureaux…");
const wilayas = await toutesLesPages("/wilayas/");
const centres = await toutesLesPages("/centers/");
console.log(`  ${wilayas.length} wilayas, ${centres.length} bureaux`);

const resultat = [];
for (const w of wilayas.sort((a, b) => a.id - b.id)) {
  if (!w.is_deliverable) {
    resultat.push({ id: w.id, nom: w.name, livrable: false, communes: [], bureaux: [] });
    continue;
  }
  const f = await get(`/fees/?from_wilaya_id=${DEPART}&to_wilaya_id=${w.id}`);
  const lignes = Object.values(f.per_commune).map((c) => ({
    id: c.commune_id,
    nom: c.commune_name,
    domicile: c.express_home ?? null,
    bureau: c.express_desk ?? null,
  }));
  const bureaux = centres
    .filter((c) => c.wilaya_id === w.id)
    .map((c) => ({ id: c.center_id, nom: c.name, adresse: c.address, commune: c.commune_name, communeId: c.commune_id }));
  resultat.push({
    id: w.id,
    nom: w.name,
    livrable: true,
    retour: f.retour_fee ?? null,
    communes: lignes.sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
    bureaux: bureaux.sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
  });
  process.stdout.write(`\r  tarifs ${w.id}/${wilayas.length}`);
}
console.log();

const aujourdHui = new Date().toISOString().slice(0, 10);
// "Agence de Chlef [Guepex]" → "Agence de Chlef". Le nom du partenaire n'aide pas le client ;
// il n'est gardé que si deux agences d'une même wilaya porteraient sinon le même nom.
const nomsBureaux = (liste) => {
  const court = (b) => b.nom.replace(/\s*\[[^\]]*\]\s*$/, "").trim();
  const vus = new Map();
  for (const b of liste) vus.set(court(b), (vus.get(court(b)) ?? 0) + 1);
  return liste.map((b) => {
    const partenaire = b.nom.match(/\[([^\]]+)\]\s*$/)?.[1];
    return vus.get(court(b)) > 1 && partenaire ? `${court(b)} (${partenaire})` : court(b);
  });
};

// Le prix Yalidine dépend aujourd'hui de la wilaya seule (vérifié le 11/11/2026 : identique dans
// toutes les communes). Si ça change un jour, on garde le prix le plus haut de la wilaya pour ne
// jamais annoncer moins que ce que le client paiera, et on le signale.
const plusHaut = (valeurs) => {
  const v = valeurs.filter((x) => x != null);
  return v.length ? Math.max(...v) : null;
};
const complet = {
  maj: aujourdHui,
  depart: "Blida",
  service: "express",
  wilayas: resultat.map((w) => {
    if (!w.livrable) return { id: w.id, nom: w.nom, livrable: false, domicile: null, bureau: null, bureaux: [] };
    const dom = new Set(w.communes.map((c) => c.domicile));
    const bur = new Set(w.communes.map((c) => c.bureau));
    if (dom.size > 1 || bur.size > 1) console.warn(`⚠️ ${w.nom} : prix différents selon la commune, prix le plus haut retenu`);
    return {
      id: w.id,
      nom: w.nom,
      livrable: true,
      domicile: plusHaut(w.communes.map((c) => c.domicile)),
      bureau: w.bureaux.length ? plusHaut(w.communes.map((c) => c.bureau)) : null,
      bureaux: nomsBureaux(w.bureaux).map((nom, i) => ({ nom, commune: w.bureaux[i].commune, adresse: w.bureaux[i].adresse })),
    };
  }),
};
fs.writeFileSync("data/livraison.json", JSON.stringify(complet, null, 1) + "\n");

// Version légère pour les formulaires : { id: [domicile, bureau, [[nomBureau, commune], …]] }
const formulaire = {};
for (const w of complet.wilayas.filter((x) => x.livrable)) {
  formulaire[w.id] = [w.domicile, w.bureau, w.bureaux.map((b) => [b.nom, b.commune])];
}
fs.writeFileSync("data/livraison-formulaire.json", JSON.stringify({ maj: aujourdHui, w: formulaire }) + "\n");

// Communes où Yalidine livre à domicile (prix domicile non nul), par wilaya, triées.
const communes = {};
for (const w of resultat.filter((x) => x.livrable)) {
  communes[w.id] = w.communes.filter((c) => c.domicile != null).map((c) => c.nom);
}
fs.writeFileSync("data/livraison-communes.json", JSON.stringify(communes) + "\n");

const liv = complet.wilayas.filter((w) => w.livrable);
console.log(`OK : ${liv.length}/${complet.wilayas.length} wilayas livrées, domicile ${Math.min(...liv.map((w) => w.domicile))} à ${Math.max(...liv.map((w) => w.domicile))} DA`);
console.log(`Non livrées : ${complet.wilayas.filter((w) => !w.livrable).map((w) => w.nom).join(", ") || "aucune"}`);
console.log(`Sans bureau : ${liv.filter((w) => !w.bureaux.length).map((w) => w.nom).join(", ") || "aucune"}`);
