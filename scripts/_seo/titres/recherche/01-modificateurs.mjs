// Q1 : part des impressions (rp-A, échantillon requête × page) dont la requête contient tel mot,
// par type de page. Script jetable : node scripts/_seo/titres/recherche/01-modificateurs.mjs
import { rp, somme } from "../../../_gsc/lib-analyse.mjs";

const lignes = rp("A");
const norm = (s) => " " + s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC").replace(/[’']/g, " ").replace(/\s+/g, " ").trim() + " ";

const MODS = [
  ["prix (latin : prix, price, combien, coute)", /\b(prix|price|combien|coute)\b/],
  ["prix arabe (سعر, ثمن, شحال)", /(سعر|ثمن|شحال|بكم)/],
  ["prix, toutes graphies", /\b(prix|price|combien|coute)\b|(سعر|ثمن|شحال|بكم)/],
  ["algérie / algerie / algeria", /\b(algerie|algeria|alger?ie|algerien|algerienne)\b/],
  ["dz", /\bdz\b/],
  ["الجزائر", /الجزائر/],
  ["lieu, toutes graphies", /\b(algerie|algeria|algerien|algerienne|dz)\b|الجزائر/],
  ["original / authentique / الأصلي", /\b(original|originale|originaux|authentique|orginal)\b|(الأصلي|الاصلي|اصلي|أصلي)/],
  ["homme / men / رجالي", /\b(homme|hommes|men)\b|(رجالي|للرجال|رجال)/],
  ["femme / women / نسائي", /\b(femme|femmes|women|woman)\b|(نسائي|للنساء|نساء)/],
  ["parfum / perfume / عطر", /\b(parfum|parfums|perfume|perfumes|parfume|fragrance)\b|(عطر|عطور)/],
  ["edp / eau de parfum", /\b(edp|eau de parfum)\b/],
  ["edt / eau de toilette", /\b(edt|eau de toilette)\b/],
  ["elixir", /\belixir\b/],
  ["intense", /\bintense\b/],
  ["« le parfum »", /\ble parfum\b/],
  ["extrait / absolu", /\b(extrait|absolu|absolute)\b/],
  ["concentration, une au moins", /\b(edp|eau de parfum|edt|eau de toilette|elixir|intense|le parfum|extrait|absolu|cologne)\b/],
  ["volume (… ml)", /\b\d{2,3} ?ml\b/],
  ["100 ml", /\b100 ?ml\b/],
  ["mot en arabe", /[؀-ۿ]/],
  ["acheter / où trouver / boutique", /\b(acheter|achat|ou trouver|boutique|magasin|site|vente)\b/],
  ["navigation « numidia »", /numidia|نوميديا/],
];

const TYPES = ["produit", "marque", "fille", "mere", "accueil", "blog", "tout"];
const parType = {};
for (const l of lignes) {
  const t = TYPES.includes(l.type) ? l.type : "autre";
  (parType[t] ??= []).push(l);
  (parType.tout ??= []).push(l);
}

const pct = (a, b) => (b ? ((a / b) * 100).toFixed(1) : "–");
const out = [];
out.push("Base : rp-A (90 jours, 21/08 → 18/11/2026), échantillon requête × page. Part = impressions des requêtes contenant le mot / impressions du type.");
out.push("");
const tot = {};
for (const t of TYPES) tot[t] = somme(parType[t] || []);
out.push("| mot dans la requête | " + TYPES.map((t) => `${t} (${Math.round(tot[t].imp / 1000)}k imp)`).join(" | ") + " |");
out.push("|---|" + TYPES.map(() => "---").join("|") + "|");
for (const [nom, re] of MODS) {
  const cells = TYPES.map((t) => {
    const ls = (parType[t] || []).filter((l) => re.test(norm(l.requete)));
    const s = somme(ls);
    return `${pct(s.imp, tot[t].imp)} %`;
  });
  out.push(`| ${nom} | ${cells.join(" | ")} |`);
}
out.push("");
out.push("### Même tableau en part des CLICS");
out.push("| mot dans la requête | " + TYPES.map((t) => `${t} (${tot[t].clics} clics)`).join(" | ") + " |");
out.push("|---|" + TYPES.map(() => "---").join("|") + "|");
for (const [nom, re] of MODS) {
  const cells = TYPES.map((t) => {
    const s = somme((parType[t] || []).filter((l) => re.test(norm(l.requete))));
    return `${pct(s.clics, tot[t].clics)} %`;
  });
  out.push(`| ${nom} | ${cells.join(" | ")} |`);
}
out.push("");
out.push("### CTR et position des requêtes avec / sans le mot (fiches produit, hors navigation)");
out.push("| mot | imp avec | CTR avec | pos avec | imp sans | CTR sans | pos sans |");
out.push("|---|---|---|---|---|---|---|");
const prod = (parType.produit || []).filter((l) => !/numidia/.test(l.requete));
for (const [nom, re] of MODS) {
  const a = somme(prod.filter((l) => re.test(norm(l.requete))));
  const b = somme(prod.filter((l) => !re.test(norm(l.requete))));
  out.push(`| ${nom} | ${a.imp} | ${(a.ctr * 100).toFixed(1)} % | ${a.pos.toFixed(1)} | ${b.imp} | ${(b.ctr * 100).toFixed(1)} % | ${b.pos.toFixed(1)} |`);
}

// CTR à position égale : fiches produit, requêtes avec « prix » contre sans, par bande
out.push("");
out.push("### Fiches produit : CTR par bande de position, requêtes avec / sans « prix » (toutes graphies) et avec / sans lieu");
const bandes = [[1, 3], [3, 5], [5, 8], [8, 12], [12, 20]];
const reP = MODS[2][1], reL = MODS[6][1];
const groupes = {
  "prix + lieu": (q) => reP.test(q) && reL.test(q),
  "prix sans lieu": (q) => reP.test(q) && !reL.test(q),
  "lieu sans prix": (q) => !reP.test(q) && reL.test(q),
  "ni prix ni lieu": (q) => !reP.test(q) && !reL.test(q),
};
out.push("| groupe | " + bandes.map(([a, b]) => `pos ${a}-${b}`).join(" | ") + " |");
out.push("|---|" + bandes.map(() => "---").join("|") + "|");
for (const [g, f] of Object.entries(groupes)) {
  const ls = prod.filter((l) => f(norm(l.requete)));
  out.push(`| ${g} | ` + bandes.map(([a, b]) => {
    const s = somme(ls.filter((l) => l.pos >= a && l.pos < b));
    return s.imp ? `${(s.ctr * 100).toFixed(1)} % (${s.imp})` : "–";
  }).join(" | ") + " |");
}
console.log(out.join("\n"));
