// Q6 : requêtes en arabe — volume, pages concernées, et faut-il un nom arabe dans le titre ?
// Base : rp-A (échantillon requête × page) + volumes DataForSEO (Google Algérie).
// Script jetable : node scripts/_seo/titres/recherche/06-arabe.mjs
import fs from "fs";
import { rp, requetes, produits, somme } from "../../../_gsc/lib-analyse.mjs";

const AR = /[؀-ۿ]/;
const nfc = (s) => s.normalize("NFC");
// mots arabes génériques (prix, parfum, lieu, genre, original, prépositions)
const GEN = new Set(["عطر", "عطور", "العطر", "سعر", "ثمن", "اسعار", "أسعار", "في", "الجزائر", "بالجزائر", "الأصلي", "الاصلي", "اصلي", "أصلي", "الأصلية", "رجالي", "نسائي", "للرجال", "للنساء", "رجال", "نساء",
  "افضل", "أفضل", "من", "و", "بكم", "شحال", "كم", "هل", "اين", "أين", "يوجد", "شراء", "متجر", "دينار", "دج", "مل", "ملل", "الرجالي", "النسائي", "نوع", "ما", "هو", "هي", "على", "عن", "مع", "ريحة", "رائحة", "parfum", "prix", "algerie", "algérie", "dz", "ml", "السعر", "بالدينار", "الجزائري", "فالجزائر", "الدينار", "بالجزائري", "الحقيقي", "ثمن", "العطر", "عطرها", "عطره"]);
// mots de conversation avec un assistant (Google AI, Gemini) : « son prix », « oui », « montre-moi »
const CONV = new Set(["سعره", "سعرها", "سعرو", "ثمنه", "ثمنها", "نعم", "واه", "ايه", "اعطني", "اعطيني", "صورهم", "صورته", "صورتها", "صور", "يباع", "وين", "بالعربية", "اريد", "أريد", "ممكن", "شكرا", "لا", "هذا", "هذه", "يوجد", "oui", "non"]);

const lignes = rp("A").map((l) => ({ ...l, requete: nfc(l.requete) }));
const ar = lignes.filter((l) => AR.test(l.requete));
const tot = somme(lignes), sAr = somme(ar);
const out = [];
out.push(`Base : rp-A (échantillon). Requêtes contenant au moins un mot arabe : ${new Set(ar.map((l) => l.requete)).size} requêtes distinctes, ${sAr.imp} imp (${((sAr.imp / tot.imp) * 100).toFixed(1)} % de l'échantillon), ${sAr.clics} clics (${((sAr.clics / tot.clics) * 100).toFixed(1)} %), CTR ${(sAr.ctr * 100).toFixed(1)} %, pos ${sAr.pos.toFixed(1)} (latin : CTR ${(somme(lignes.filter((l) => !AR.test(l.requete))).ctr * 100).toFixed(1)} %, pos ${somme(lignes.filter((l) => !AR.test(l.requete))).pos.toFixed(1)}).`);
// Requêtes seules (requetes-A) pour contrôle
const rq = requetes("A").filter((r) => AR.test(r.requete));
out.push(`Contrôle requetes-A : ${rq.length} requêtes arabes, ${somme(rq).imp} imp, ${somme(rq).clics} clics.`);
out.push("");

// Par type de page
out.push("| type de page | imp arabes | part des imp du type | clics | CTR | pos |");
out.push("|---|---|---|---|---|---|");
for (const t of ["produit", "marque", "fille", "mere", "accueil", "blog"]) {
  const a = somme(ar.filter((l) => l.type === t)), all = somme(lignes.filter((l) => l.type === t));
  out.push(`| ${t} | ${a.imp} | ${((a.imp / all.imp) * 100).toFixed(1)} % | ${a.clics} | ${(a.ctr * 100).toFixed(1)} % | ${a.pos.toFixed(1)} |`);
}

// Classement : nom en arabe / nom latin dans une requête arabe / générique
const classe = (q) => {
  const mots = q.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, " ").trim().split(" ").filter(Boolean);
  if (mots.some((m) => CONV.has(m))) return { c: "conversationnel (« سعره », « نعم » : suite d'un échange avec un assistant)", nom: "" };
  const reste = mots.filter((m) => !GEN.has(m) && !/^\d+$/.test(m));
  const resteAr = reste.filter((m) => AR.test(m));
  const resteLat = reste.filter((m) => !AR.test(m));
  if (resteAr.length) return { c: "nom écrit en arabe", nom: resteAr.join(" ") };
  if (resteLat.length) return { c: "nom en latin dans une requête arabe", nom: resteLat.join(" ") };
  return { c: "générique (« سعر عطر في الجزائر »…)", nom: "" };
};
const parClasse = {};
for (const l of ar) { const k = classe(l.requete); l.k = k; (parClasse[k.c] ??= []).push(l); }
out.push("");
out.push("| forme de la requête arabe | imp | clics | CTR | pos | exemples |");
out.push("|---|---|---|---|---|---|");
for (const [c, ls] of Object.entries(parClasse).sort((a, b) => somme(b[1]).imp - somme(a[1]).imp)) {
  const s = somme(ls);
  const ex = [...new Map(ls.sort((a, b) => b.imp - a.imp).map((l) => [l.requete, l])).values()].slice(0, 4).map((l) => `${l.requete} (${l.imp})`).join(" ; ");
  out.push(`| ${c} | ${s.imp} | ${s.clics} | ${(s.ctr * 100).toFixed(1)} % | ${s.pos.toFixed(1)} | ${ex} |`);
}

// Noms arabes : regroupés par fiche (page qui les reçoit)
out.push("");
out.push("### Noms écrits en arabe : pages qui les reçoivent (≥ 10 imp)");
const noms = new Map();
for (const l of parClasse["nom écrit en arabe"] || []) {
  const k = l.chemin;
  const e = noms.get(k) || noms.set(k, { chemin: k, ls: [], formes: new Map() }).get(k);
  e.ls.push(l);
  e.formes.set(l.k.nom, (e.formes.get(l.k.nom) || 0) + l.imp);
}
const impPage = new Map();
for (const l of lignes) impPage.set(l.chemin, (impPage.get(l.chemin) || 0) + l.imp);
out.push("| page | imp nom arabe | part des imp de la page (échantillon) | clics | pos | formes tapées (imp) |");
out.push("|---|---|---|---|---|---|");
const rowsNoms = [...noms.values()].map((e) => ({ ...e, s: somme(e.ls) })).filter((e) => e.s.imp >= 10).sort((a, b) => b.s.imp - a.s.imp);
for (const e of rowsNoms.slice(0, 30))
  out.push(`| ${e.chemin} | ${e.s.imp} | ${((e.s.imp / impPage.get(e.chemin)) * 100).toFixed(1)} % | ${e.s.clics} | ${e.s.pos.toFixed(1)} | ${[...e.formes].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([f, i]) => `${f} (${i})`).join(", ")} |`);

// Pages les plus exposées à l'arabe, toutes formes confondues
out.push("");
out.push("### Pages où l'arabe pèse le plus (≥ 40 imp arabes)");
out.push("| page | imp arabes | part des imp de la page | clics | requête arabe n°1 |");
out.push("|---|---|---|---|---|");
const parPage = new Map();
for (const l of ar) (parPage.get(l.chemin) || parPage.set(l.chemin, []).get(l.chemin)).push(l);
for (const [c, ls] of [...parPage].map(([c, ls]) => [c, ls, somme(ls)]).filter((x) => x[2].imp >= 40).sort((a, b) => b[2].imp - a[2].imp).slice(0, 25).map((x) => [x[0], x[1]])) {
  const s = somme(ls); const t = ls.sort((a, b) => b.imp - a.imp)[0];
  out.push(`| ${c} | ${s.imp} | ${((s.imp / impPage.get(c)) * 100).toFixed(1)} % | ${s.clics} | ${t.requete} (${t.imp}, pos ${t.pos.toFixed(1)}) |`);
}

// Volumes DataForSEO : arabe contre latin pour les mêmes parfums
const vs = JSON.parse(fs.readFileSync("scripts/_seo/donnees/volumes-sujets.json", "utf8"));
const vc = JSON.parse(fs.readFileSync("scripts/_seo/donnees/volumes-catalogue.json", "utf8"));
out.push("");
out.push("### Volumes DataForSEO (Google Algérie, mensuel) : requêtes arabes mesurées, et le nom latin du même parfum");
const latin = (slug) => vc.find((v) => v.slug === slug);
const corres = { "عطر خمرة": "lattafa-khamrah", "عطر اسد": "lattafa-asad", "ديور سوفاج": "dior-sauvage", "عطر لطافة": null, "عطر شانيل": null };
for (const v of vs.filter((v) => AR.test(v.requete)).sort((a, b) => b.volume - a.volume)) {
  const s = corres[v.requete] ? latin(corres[v.requete]) : null;
  out.push(`- ${v.requete} : ${v.volume}${s ? ` (latin « ${s.requete} » : ${s.volume})` : ""}`);
}
const totAr = vs.filter((v) => AR.test(v.requete)).reduce((s, v) => s + v.volume, 0);
const totCat = vc.reduce((s, v) => s + (v.volume || 0), 0);
out.push(`Total arabe mesuré : ${totAr}/mois ; demande latine des noms du catalogue : ${totCat}/mois.`);
console.log(out.join("\n"));

// CTR à position égale : requêtes arabes contre latines, fiches produit, hors conversationnel
{
  const o = [];
  const B = [[1, 3], [3, 5], [5, 8], [8, 12]];
  const prod = lignes.filter((l) => l.type === "produit");
  const nomAr = prod.filter((l) => AR.test(l.requete) && classe(l.requete).c === "nom écrit en arabe");
  const genAr = prod.filter((l) => AR.test(l.requete) && classe(l.requete).c.startsWith("générique"));
  const conv = prod.filter((l) => AR.test(l.requete) && classe(l.requete).c.startsWith("conversationnel"));
  const lat = prod.filter((l) => !AR.test(l.requete));
  o.push("");
  o.push("### Fiches produit : CTR par bande de position, arabe contre latin");
  o.push("| groupe | " + B.map(([a, b]) => `pos ${a}-${b}`).join(" | ") + " |");
  o.push("|---|" + B.map(() => "---").join("|") + "|");
  for (const [n, ls] of [["latin", lat], ["arabe, nom écrit en arabe", nomAr], ["arabe, générique", genAr], ["arabe, conversationnel", conv]])
    o.push(`| ${n} | ` + B.map(([a, b]) => { const s = somme(ls.filter((l) => l.pos >= a && l.pos < b)); return s.imp ? `${(s.ctr * 100).toFixed(1)} % (${s.imp})` : "–"; }).join(" | ") + " |");
  console.log(o.join("\n"));
}
