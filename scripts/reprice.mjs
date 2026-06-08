#!/usr/bin/env node
// Repricing basé sur les prix marché européens × 270 (1€ = 270 DA).
// Référence = prix DA d'un 100ml EDP par marque, puis ajustement volume + concentration.
// Simulation par défaut. `--apply` écrit dans data/products.json.
import fs from "fs";

const FILE = "./data/products.json";
const RATE_NOTE = "prix marché € × 270";

// Référence DA pour un 100ml EDP (dérivée des prix marché européens réels × 270).
const BRAND_REF = {
  // ── Orientaux (≈ inchangés, marché ~20-35€) ──
  "Lattafa": 7500, "Al Haramain": 8500, "Rasasi": 7000, "Swiss Arabian": 7500,
  "Ajmal": 6500, "Armaf": 7000, "Al Rehab": 3200, "Afnan": 7500, "El Nabil": 7000,
  "Arabian Oud": 9000, "Orientica": 9500, "Evaflor": 3500,
  // ── Célébrités / entrée de gamme (~25-40€) ──
  "Shakira": 6000, "Paris Hilton": 7000, "Antonio Banderas": 6500, "Britney Spears": 6500,
  "Jennifer Lopez": 7500, "Mariah Carey": 7000, "Beyoncé": 7000, "Ariana Grande": 8500,
  "Anna Sui": 8000, "Victoria's Secret": 9000, "Adopt Mon Parfum": 6000, "Pierre Cardin": 5500,
  "Franck Olivier": 5000, "Zara": 6000, "Elizabeth Taylor": 7000, "Nikos": 8000, "Yves Rocher": 9000,
  // ── Designer abordable (~40-70€) ──
  "Hugo Boss": 16000, "Calvin Klein": 14000, "Lacoste": 15000, "Davidoff": 13000,
  "Ralph Lauren": 17000, "Guess": 12000, "Diesel": 16000, "Jimmy Choo": 18000,
  "Marc Jacobs": 21000, "Michael Kors": 20000, "Coach": 17000, "Mauboussin": 11000,
  "Trussardi": 14000, "Cerruti": 13000, "Karl Lagerfeld": 12000, "Escada": 15000,
  "Chopard": 13000, "Roberto Cavalli": 14000, "DKNY": 16000, "Kate Spade": 17000,
  "Elizabeth Arden": 11000, "Joop!": 12000, "S.T. Dupont": 14000, "Guy Laroche": 12000,
  "Nautica": 12000, "Salvatore Ferragamo": 16000, "Moschino": 16000, "Lolita Lempicka": 14000,
  "Lalique": 15000, "Nina Ricci": 17000, "Cacharel": 17000, "Donna Karan": 16000,
  "Ungaro": 11000, "Rochas": 14000, "Boucheron": 17000, "Lanvin": 14000,
  "Mont Blanc": 18000, "Kenzo": 19000, "Azzaro": 20000, "Zadig & Voltaire": 19000,
  // ── Designer cœur (~80-120€) ──
  "Dior": 28000, "Chanel": 30000, "Yves Saint Laurent": 28000, "YSL": 28000,
  "Giorgio Armani": 26000, "Armani": 26000, "Guerlain": 29000, "Hermès": 28000,
  "Givenchy": 24000, "Paco Rabanne": 23000, "Jean Paul Gaultier": 23000,
  "Dolce & Gabbana": 22000, "Dolce&Gabbana": 22000, "Prada": 26000, "Valentino": 28000,
  "Lancôme": 26000, "Versace": 22000, "Gucci": 27000, "Burberry": 23000,
  "Carolina Herrera": 25000, "Mugler": 26000, "Bvlgari": 23000, "Narciso Rodriguez": 24000,
  "Chloé": 25000, "Cartier": 26000, "Issey Miyake": 22000, "Viktor & Rolf": 26000,
  "Elie Saab": 23000, "Miu Miu": 25000, "Van Cleef & Arpels": 28000, "Jean Patou": 22000,
  "Kayali": 24000,
  // ── Premium / niche accessible (~100-160€) ──
  "Tom Ford": 42000, "Jo Malone London": 34000, "Maison Margiela": 32000,
  "Acqua di Parma": 40000, "Mancera": 17500, "Montale": 17500, "Juliette Has A Gun": 30000,
  // ── Niche (~160-240€) ──
  "Xerjoff": 48000, "Parfums de Marly": 54000, "Initio Parfums Privés": 60000,
  "By Kilian": 58000, "Frédéric Malle": 60000, "Nishane": 48000, "Ex Nihilo": 52000,
  "Memo Paris": 51000, "Byredo": 51000, "Diptyque": 38000, "Penhaligon's": 48000,
  "Serge Lutens": 38000, "Louis Vuitton": 75000,
  // ── Ultra-niche (~280-480€) ──
  "Maison Francis Kurkdjian": 95000, "Creed": 85000, "Amouage": 98000, "Roja Dove": 100000,
};

function volFactor(volume) {
  const ml = parseInt(String(volume).replace(/[^0-9]/g, ""), 10) || 100;
  return Math.pow(ml / 100, 0.72); // sous-linéaire : un 50ml ne coûte pas la moitié d'un 100ml
}
function concFactor(c) {
  const k = String(c || "EDP").toUpperCase();
  if (k.includes("EXTRAIT")) return 1.3;
  if (k === "PARFUM") return 1.2;
  if (k === "EDT") return 0.85;
  if (k.includes("COLOGNE") || k === "EDC") return 0.7;
  return 1.0; // EDP
}
function round500(n) { return Math.max(1500, Math.round(n / 500) * 500); }

const apply = process.argv.includes("--apply");
const db = JSON.parse(fs.readFileSync(FILE, "utf8"));
const unmapped = new Set();
let up = 0, down = 0, same = 0, sumOld = 0, sumNew = 0;
const samples = [];
const all = [];
const anchors = ["baccarat", "mancera", "aventus", "sauvage", "bleu-de-chanel", "roja", "amouage", "xerjoff"];

for (const p of db.products) {
  const ref = BRAND_REF[p.brand];
  if (!ref) { unmapped.add(p.brand); continue; }
  const computed = round500(ref * volFactor(p.volume) * concFactor(p.concentration));
  const target = Math.max(p.price, computed); // plancher : on ne baisse jamais, on remonte
  sumOld += p.price; sumNew += target;
  if (target > p.price) up++; else if (target < p.price) down++; else same++;
  const line = `${p.brand} ${p.name} (${p.concentration} ${p.volume}) : ${p.price} -> ${target}`;
  if (anchors.some((a) => p.slug.includes(a))) samples.push("  [ANCRE] " + line);
  all.push({ brand: p.brand, cat: p.category, line });
  if (apply) p.price = target;
}

console.log(`=== REPRICING (${RATE_NOTE}) ===`);
console.log(`Produits: ${db.products.length} | en hausse: ${up} | en baisse: ${down} | inchangés: ${same}`);
console.log(`Marques non mappées (ignorées): ${unmapped.size ? [...unmapped].join(", ") : "aucune"}`);
console.log(`Panier moyen — avant: ${Math.round(sumOld / db.products.length)} DA -> après: ${Math.round(sumNew / db.products.length)} DA`);
console.log(`\n--- Ancres (tes exemples + best-sellers) ---`);
samples.slice(0, 20).forEach((s) => console.log(s));

const dz = (arr, n) => arr.slice(0, n).forEach((x) => console.log("  " + x.line));
console.log(`\n--- DESIGNERS (échantillon) ---`);
dz(all.filter((x) => ["Dior","Chanel","Paco Rabanne","Jean Paul Gaultier","Giorgio Armani","Yves Saint Laurent","Versace","Lancôme","Carolina Herrera","Hugo Boss"].includes(x.brand)), 12);
console.log(`\n--- ORIENTAUX (doivent rester ~stables) ---`);
dz(all.filter((x) => x.cat === "parfums-orientaux"), 10);
if (apply) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
  console.log(`\n✅ APPLIQUÉ — ${FILE} mis à jour.`);
} else {
  console.log(`\n(simulation — rien écrit. Ajoute --apply pour écrire.)`);
}
