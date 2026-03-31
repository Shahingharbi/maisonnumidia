/**
 * Ajout de ~500 parfums connus en "pending" dans keywords.json
 * Pour lancement progressif des pages produit
 * Généré le 2026-03-18
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KW_PATH = join(__dirname, '..', 'data', 'keywords.json');

const newKeywords = [
  // ─── HOMME ───────────────────────────────────────────────────────────────

  // Armani
  { keyword: "acqua di gio armani", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Bestseller mondial Armani homme", slug: null },
  { keyword: "acqua di gio profumo armani", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Version intense Profumo", slug: null },
  { keyword: "acqua di gio profondo armani", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Version Profondo", slug: null },
  { keyword: "armani code absolu homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Code Absolu EDP", slug: null },
  { keyword: "armani code edp homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Code EDP version", slug: null },
  { keyword: "stronger with you armani", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Stronger With You EDT", slug: null },
  { keyword: "stronger with you absolutely armani", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Version absolue", slug: null },

  // Azzaro
  { keyword: "azzaro pour homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Classique iconique Azzaro homme", slug: null },
  { keyword: "azzaro chrome aqua", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Chrome Aqua EDT", slug: null },
  { keyword: "azzaro chrome intense", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Chrome Intense EDT", slug: null },
  { keyword: "azzaro chrome legend", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Chrome Legend EDT", slug: null },
  { keyword: "azzaro chrome pure", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Chrome Pure EDT", slug: null },
  { keyword: "azzaro chrome united", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Chrome United", slug: null },
  { keyword: "azzaro now homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Azzaro Now", slug: null },

  // Hugo Boss
  { keyword: "boss bottled night hugo boss", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Boss Bottled Night EDT", slug: null },
  { keyword: "hugo man hugo boss", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Hugo Man EDT", slug: null },
  { keyword: "boss the scent homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "The Scent Intense", slug: null },
  { keyword: "boss bottled parfum hugo boss", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Boss Bottled Parfum", slug: null },

  // Burberry
  { keyword: "mr burberry", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Mr. Burberry EDT", slug: null },
  { keyword: "burberry touch homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Touch for Men EDT", slug: null },

  // Bvlgari
  { keyword: "bvlgari pour homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Bvlgari Pour Homme EDT classique", slug: null },
  { keyword: "bvlgari aqva homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Aqva Pour Homme EDT", slug: null },
  { keyword: "bvlgari aqva amara", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Aqva Amara EDT", slug: null },
  { keyword: "bvlgari man in black", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Man in Black EDP bestseller", slug: null },
  { keyword: "bvlgari man wood neroli", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Man Wood Neroli", slug: null },

  // Calvin Klein
  { keyword: "eternity homme calvin klein", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Eternity for Men classique", slug: null },
  { keyword: "obsession homme calvin klein", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Obsession for Men classique 90s", slug: null },
  { keyword: "ck free calvin klein", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "CK Free EDT", slug: null },
  { keyword: "ck be calvin klein", volume: null, kd: null, category: "parfums-mixte", type: "product", status: "pending", note: "CK Be mixte bestseller", slug: null },

  // Cartier
  { keyword: "santos cartier homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Santos de Cartier EDT", slug: null },
  { keyword: "pasha cartier homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Pasha de Cartier EDT", slug: null },
  { keyword: "l envol cartier", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L'Envol de Cartier EDP", slug: null },
  { keyword: "declaration parfum cartier", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Déclaration Parfum version", slug: null },

  // Chanel Homme
  { keyword: "allure homme chanel", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Allure Homme Sport classique", slug: null },
  { keyword: "allure homme sport chanel", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Allure Homme Sport", slug: null },
  { keyword: "egoiste chanel", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Égoïste classique cult", slug: null },
  { keyword: "platinum egoiste chanel", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Platinum Égoïste EDT", slug: null },

  // Davidoff
  { keyword: "davidoff cool water game", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Cool Water Game EDT", slug: null },
  { keyword: "davidoff adventure homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Adventure EDT", slug: null },
  { keyword: "davidoff echo homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Echo Man EDT", slug: null },
  { keyword: "davidoff silver shadow", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Silver Shadow EDT", slug: null },
  { keyword: "davidoff horizon homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Horizon EDT", slug: null },

  // Dior Homme
  { keyword: "eau sauvage dior", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Eau Sauvage classique historique", slug: null },
  { keyword: "dior homme intense", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Homme Intense EDP", slug: null },
  { keyword: "dior homme sport", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Homme Sport EDT", slug: null },
  { keyword: "dior homme cologne", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Homme Cologne", slug: null },
  { keyword: "dior homme parfum", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Homme Parfum concentration", slug: null },

  // Dolce & Gabbana Homme
  { keyword: "dolce gabbana pour homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "D&G Pour Homme EDT", slug: null },
  { keyword: "dolce gabbana intenso", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Intenso EDP", slug: null },
  { keyword: "k dolce gabbana homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "K by D&G EDT", slug: null },
  { keyword: "light blue homme dolce gabbana", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Light Blue Pour Homme bestseller été", slug: null },

  // Givenchy Homme
  { keyword: "pi givenchy homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Pi classique cult homme", slug: null },
  { keyword: "givenchy pour homme blue label", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Blue Label EDT", slug: null },
  { keyword: "xeryus rouge givenchy", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Xeryus Rouge nostalgie", slug: null },

  // Gucci Homme
  { keyword: "gucci guilty homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Guilty Pour Homme EDT", slug: null },
  { keyword: "gucci pour homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Gucci Pour Homme EDT", slug: null },
  { keyword: "gucci guilty absolute homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Guilty Absolute Pour Homme", slug: null },

  // Guerlain Homme
  { keyword: "guerlain vetiver", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Vetiver classique intemporel", slug: null },
  { keyword: "guerlain heritage homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Heritage EDT vintage cult", slug: null },
  { keyword: "l homme ideal edp guerlain", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L'Homme Idéal EDP version", slug: null },

  // Hermès Homme
  { keyword: "terre d hermes edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Terre d'Hermès EDT bestseller", slug: null },
  { keyword: "terre d hermes edp", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Terre d'Hermès EDP", slug: null },
  { keyword: "terre d hermes parfum", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Terre d'Hermès Parfum concentration", slug: null },
  { keyword: "h24 hermes homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "H24 EDP nouveauté Hermès", slug: null },
  { keyword: "voyage d hermes", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Voyage d'Hermès EDT", slug: null },

  // Issey Miyake Homme
  { keyword: "l eau d issey homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L'Eau d'Issey Pour Homme EDT bestseller", slug: null },
  { keyword: "nuit d issey homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Nuit d'Issey EDT", slug: null },
  { keyword: "bleue d issey homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Bleue d'Issey EDP", slug: null },

  // Kenzo Homme
  { keyword: "kenzo homme edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Kenzo Homme EDT classique", slug: null },
  { keyword: "kenzo power homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Kenzo Power EDT", slug: null },

  // Lacoste Homme
  { keyword: "lacoste pour homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Lacoste Pour Homme EDT", slug: null },
  { keyword: "lacoste l12 blanc", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L.12.12 Blanc EDT bestseller", slug: null },
  { keyword: "lacoste l12 vert", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L.12.12 Vert EDT", slug: null },
  { keyword: "lacoste l12 bleu", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L.12.12 Bleu EDT", slug: null },
  { keyword: "lacoste essential homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Essential EDT", slug: null },

  // Mont Blanc Homme
  { keyword: "mont blanc legend edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Legend EDT bestseller absolu", slug: null },
  { keyword: "mont blanc legend edp", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Legend EDP version", slug: null },
  { keyword: "mont blanc explorer platinum", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Explorer Platinum EDP", slug: null },
  { keyword: "mont blanc explorer ultra blue", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Explorer Ultra Blue", slug: null },
  { keyword: "mont blanc individuel", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Individuel EDT", slug: null },

  // Mugler Homme
  { keyword: "a men mugler", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "A*Men bestseller masculin cult", slug: null },
  { keyword: "mugler cologne homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Mugler Cologne mixte", slug: null },

  // Narciso Rodriguez Homme
  { keyword: "narciso rodriguez for him edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "For Him EDT", slug: null },
  { keyword: "narciso rodriguez bleu noir", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Bleu Noir EDP", slug: null },

  // Paco Rabanne Homme
  { keyword: "invictus aqua paco rabanne", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Invictus Aqua EDT été", slug: null },
  { keyword: "invictus victory paco rabanne", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Invictus Victory EDP", slug: null },
  { keyword: "invictus platinum paco rabanne", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Invictus Platinum", slug: null },
  { keyword: "pure xs paco rabanne homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Pure XS EDT", slug: null },
  { keyword: "1 million lucky paco rabanne", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "1 Million Lucky EDT", slug: null },
  { keyword: "1 million parfum paco rabanne", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "1 Million Parfum concentration", slug: null },
  { keyword: "1 million elixir paco rabanne", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "1 Million Elixir Parfum", slug: null },

  // Prada Homme
  { keyword: "prada luna rossa carbon", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Luna Rossa Carbon EDT bestseller", slug: null },
  { keyword: "prada luna rossa ocean", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Luna Rossa Ocean EDP", slug: null },
  { keyword: "prada l homme edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L'Homme Prada EDT", slug: null },
  { keyword: "prada amber homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Amber Pour Homme EDT", slug: null },

  // Ralph Lauren Homme
  { keyword: "polo blue ralph lauren", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Polo Blue EDT bestseller été", slug: null },
  { keyword: "polo black ralph lauren", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Polo Black EDT", slug: null },
  { keyword: "polo red ralph lauren", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Polo Red EDT", slug: null },
  { keyword: "polo intense ralph lauren", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Polo Intense EDP", slug: null },
  { keyword: "ralph lauren romance homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Romance Men EDT", slug: null },

  // Valentino Homme
  { keyword: "valentino uomo edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Uomo EDT version", slug: null },
  { keyword: "valentino uomo intense", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Uomo Intense EDP", slug: null },

  // Versace Homme
  { keyword: "dylan blue versace homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Dylan Blue EDT bestseller", slug: null },
  { keyword: "versace pour homme edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Pour Homme EDT classique", slug: null },
  { keyword: "versace man eau fraiche", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Man Eau Fraîche", slug: null },
  { keyword: "eros flame versace", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Eros Flame EDP", slug: null },
  { keyword: "eros parfum versace", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Eros Parfum concentration", slug: null },

  // Viktor & Rolf Homme
  { keyword: "spicebomb extreme viktor rolf", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Spicebomb Extreme EDP", slug: null },
  { keyword: "spicebomb infrared viktor rolf", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Spicebomb Infrared EDT", slug: null },
  { keyword: "spicebomb fresh viktor rolf", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Spicebomb Fresh EDT", slug: null },

  // YSL Homme
  { keyword: "y edt ysl homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Y EDT bestseller 2020s", slug: null },
  { keyword: "y edp ysl homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Y EDP version intense", slug: null },
  { keyword: "y parfum ysl homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Y Parfum concentration", slug: null },
  { keyword: "kouros ysl homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Kouros EDT classique cult", slug: null },
  { keyword: "l homme ysl edt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L'Homme YSL EDT", slug: null },
  { keyword: "l homme ysl edp", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "L'Homme YSL EDP", slug: null },
  { keyword: "jazz ysl homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Jazz EDT classique vintage", slug: null },

  // Amouage Homme
  { keyword: "amouage interlude man", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Interlude Man EDP niche premium", slug: null },
  { keyword: "amouage epic man", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Epic Man EDP", slug: null },
  { keyword: "amouage gold man", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Gold Man EDP classique", slug: null },
  { keyword: "amouage jubilation xxv", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Jubilation XXV EDP", slug: null },

  // Creed Homme
  { keyword: "creed silver mountain water", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Silver Mountain Water EDP", slug: null },
  { keyword: "creed green irish tweed", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Green Irish Tweed EDP fondateur", slug: null },
  { keyword: "creed royal water", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Royal Water EDP", slug: null },
  { keyword: "creed millesime imperial", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Millesime Imperial EDP", slug: null },
  { keyword: "creed royal oud", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Royal Oud EDP mixte niche", slug: null },

  // Tom Ford Homme
  { keyword: "tom ford tobacco vanille", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Tobacco Vanille bestseller niche", slug: null },
  { keyword: "tom ford oud wood", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Oud Wood EDP niche", slug: null },
  { keyword: "tom ford tuscan leather", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Tuscan Leather niche", slug: null },
  { keyword: "tom ford noir extreme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Noir Extreme EDP", slug: null },
  { keyword: "tom ford ombre leather", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Ombre Leather mixte", slug: null },

  // Xerjoff Homme
  { keyword: "xerjoff lira", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Lira EDP niche", slug: null },
  { keyword: "xerjoff alexandria ii", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Alexandria II EDP oriental", slug: null },
  { keyword: "xerjoff casamorati 1888", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Casamorati 1888 EDP", slug: null },

  // Parfums de Marly Homme
  { keyword: "herod parfums de marly", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Herod EDP niche prisé Algérie", slug: null },
  { keyword: "percival parfums de marly", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Percival EDP", slug: null },
  { keyword: "greenley parfums de marly", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Greenley EDP", slug: null },
  { keyword: "sedley parfums de marly", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Sedley EDP", slug: null },
  { keyword: "habdan parfums de marly", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Habdan EDP oriental", slug: null },

  // Divers Homme
  { keyword: "dkny be delicious homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "DKNY Be Delicious Men EDT", slug: null },
  { keyword: "zadig voltaire this is him", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "This Is Him! EDT", slug: null },
  { keyword: "dunhill icon racing", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Dunhill Icon Racing EDP", slug: null },
  { keyword: "trussardi riflesso homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Riflesso EDT", slug: null },

  // ─── FEMME ────────────────────────────────────────────────────────────────

  // Armani Femme
  { keyword: "armani si edp femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Si EDP bestseller femme", slug: null },
  { keyword: "armani si passione", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Si Passione EDP", slug: null },
  { keyword: "armani si intense femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Si Intense EDP", slug: null },
  { keyword: "armani si rose signature", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Si Rose Signature EDP", slug: null },
  { keyword: "acqua di gio femme armani", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Acqua di Giò Pour Femme EDT", slug: null },
  { keyword: "because it s you armani", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Because It's You EDP", slug: null },

  // Burberry Femme
  { keyword: "burberry her edp", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Her EDP bestseller 2018", slug: null },
  { keyword: "my burberry femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "My Burberry EDP", slug: null },
  { keyword: "my burberry blush", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "My Burberry Blush EDP", slug: null },
  { keyword: "my burberry black femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "My Burberry Black Parfum", slug: null },

  // Calvin Klein Femme
  { keyword: "obsession femme calvin klein", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Obsession Women classique 90s", slug: null },
  { keyword: "eternity femme calvin klein", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Eternity Women EDT", slug: null },
  { keyword: "escape femme calvin klein", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Escape Women EDT", slug: null },
  { keyword: "reveal calvin klein femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Reveal Women EDP", slug: null },

  // Carolina Herrera Femme
  { keyword: "212 women carolina herrera", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "212 Women EDT classique", slug: null },
  { keyword: "212 vip women carolina herrera", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "212 VIP Women EDP bestseller club", slug: null },
  { keyword: "good girl supreme carolina herrera", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Good Girl Suprême EDP", slug: null },
  { keyword: "good girl blush carolina herrera", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Good Girl Blush EDP", slug: null },
  { keyword: "212 sexy women carolina herrera", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "212 Sexy EDP", slug: null },

  // Chanel Femme
  { keyword: "chanel no 5 edt", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "N°5 EDT le parfum le plus connu au monde", slug: null },
  { keyword: "chanel no 5 edp", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "N°5 EDP version", slug: null },
  { keyword: "chanel no 5 l eau", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "N°5 L'Eau version fraiche moderne", slug: null },
  { keyword: "chance chanel femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Chance EDP bestseller", slug: null },
  { keyword: "chance eau tendre chanel", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Chance Eau Tendre EDT bestseller", slug: null },
  { keyword: "chance eau fraiche chanel", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Chance Eau Fraîche EDT", slug: null },
  { keyword: "chanel allure femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Allure Femme EDP", slug: null },
  { keyword: "coco noir chanel femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Coco Noir EDP", slug: null },
  { keyword: "gabrielle chanel femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Gabrielle Chanel EDP", slug: null },
  { keyword: "chanel cristalle femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Cristalle EDT classique", slug: null },

  // Chloe Femme
  { keyword: "chloe nomade femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Chloé Nomade EDP bestseller", slug: null },
  { keyword: "chloe love story femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Love Story EDP", slug: null },
  { keyword: "see by chloe femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "See by Chloé EDT", slug: null },

  // Coach Femme
  { keyword: "coach wild rose femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Wild Rose EDP", slug: null },
  { keyword: "coach dreams femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dreams EDP", slug: null },
  { keyword: "coach floral femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Coach Floral EDP", slug: null },

  // Davidoff Femme
  { keyword: "cool water woman davidoff", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Cool Water Woman EDT bestseller été", slug: null },

  // Dior Femme
  { keyword: "dior addict femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dior Addict EDP bestseller", slug: null },
  { keyword: "dior blooming bouquet", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Blooming Bouquet bestseller mondial", slug: null },
  { keyword: "joy dior femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Joy by Dior EDP", slug: null },
  { keyword: "miss dior rose n roses", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Miss Dior Rose N'Roses EDT", slug: null },

  // Dolce & Gabbana Femme
  { keyword: "dolce edp femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dolce EDP floral blanc bestseller", slug: null },
  { keyword: "dolce gabbana pour femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "D&G Pour Femme EDP", slug: null },
  { keyword: "the only one dolce gabbana femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "The Only One EDP", slug: null },

  // Elizabeth Arden Femme
  { keyword: "elizabeth arden green tea femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Green Tea EDT bestseller accessible", slug: null },
  { keyword: "elizabeth arden sunflowers femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Sunflowers EDT nostalgie 90s", slug: null },
  { keyword: "elizabeth arden red door femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Red Door EDP classique", slug: null },

  // Elie Saab Femme
  { keyword: "elie saab rose couture", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Le Parfum Rose Couture EDP", slug: null },

  // Givenchy Femme
  { keyword: "dahlia divin givenchy femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dahlia Divin EDP", slug: null },
  { keyword: "very irresistible givenchy femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Very Irresistible EDT nostalgie", slug: null },
  { keyword: "amarige givenchy femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Amarige EDT floral cult", slug: null },

  // Gucci Femme
  { keyword: "gucci bloom femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Bloom EDP bestseller floral", slug: null },
  { keyword: "gucci bloom acqua di fiori", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Bloom Acqua di Fiori EDT", slug: null },
  { keyword: "gucci rush femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Rush EDP classique cult", slug: null },
  { keyword: "gucci flora edt femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Flora by Gucci EDT", slug: null },
  { keyword: "gucci guilty femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Guilty Pour Femme EDT", slug: null },

  // Hermès Femme
  { keyword: "twilly d hermes femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Twilly d'Hermès EDP bestseller", slug: null },
  { keyword: "jardin sur le nil hermes", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Un Jardin sur le Nil EDT", slug: null },
  { keyword: "eau des merveilles hermes femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Eau des Merveilles EDT", slug: null },
  { keyword: "24 faubourg hermes femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "24 Faubourg EDP classique", slug: null },

  // Hugo Boss Femme
  { keyword: "boss alive femme hugo boss", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Alive EDP bestseller récent", slug: null },
  { keyword: "boss femme hugo boss", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Boss Femme EDP", slug: null },

  // JPG Femme
  { keyword: "classique jean paul gaultier femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Classique EDT icône flacon corset", slug: null },
  { keyword: "ma dame jean paul gaultier", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Ma Dame EDT", slug: null },

  // Jimmy Choo Femme
  { keyword: "i want choo jimmy choo", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "I Want Choo EDP bestseller récent", slug: null },
  { keyword: "jimmy choo flash femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Flash EDP", slug: null },
  { keyword: "jimmy choo blossom femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Blossom EDP", slug: null },

  // Kenzo Femme
  { keyword: "kenzo world femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Kenzo World EDP bestseller 2016", slug: null },
  { keyword: "jungle femme kenzo", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Jungle Femme EDP cult", slug: null },

  // Lancôme Femme
  { keyword: "miracle lancome femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Miracle EDP bestseller 2000s", slug: null },
  { keyword: "hypnose lancome femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Hypnôse EDP", slug: null },
  { keyword: "la nuit tresor lancome", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "La Nuit Trésor EDP", slug: null },
  { keyword: "tresor in love lancome", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Trésor In Love EDP", slug: null },
  { keyword: "magie noire lancome", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Magie Noire EDP vintage cult", slug: null },

  // Marc Jacobs Femme
  { keyword: "marc jacobs dot femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dot EDP bestseller", slug: null },
  { keyword: "marc jacobs lola femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Lola EDP", slug: null },
  { keyword: "marc jacobs honey femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Honey EDP", slug: null },
  { keyword: "daisy dream marc jacobs", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Daisy Dream EDT", slug: null },
  { keyword: "daisy love marc jacobs", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Daisy Love EDT", slug: null },

  // Michael Kors Femme
  { keyword: "michael kors sexy amber femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Sexy Amber EDP", slug: null },
  { keyword: "michael kors very hollywood", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Very Hollywood EDP", slug: null },

  // Mugler Femme
  { keyword: "angel mugler femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Angel EDP bestseller mondial absolu", slug: null },
  { keyword: "angel muse mugler femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Angel Muse EDP", slug: null },
  { keyword: "alien goddess mugler femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Alien Goddess EDP bestseller", slug: null },
  { keyword: "angel nova mugler femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Angel Nova EDP", slug: null },
  { keyword: "aura mugler femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Aura EDP", slug: null },

  // Narciso Rodriguez Femme
  { keyword: "narciso rodriguez pure musc femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Pure Musc EDP", slug: null },
  { keyword: "narciso rodriguez fleur musc femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "For Her Fleur Musc EDP", slug: null },

  // Nina Ricci Femme
  { keyword: "nina ricci l air du temps", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "L'Air du Temps EDT classique absolu", slug: null },
  { keyword: "nina ricci nina femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Nina EDT flacon pomme bestseller", slug: null },
  { keyword: "luna nina ricci femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Luna EDP floral", slug: null },
  { keyword: "ricci ricci nina ricci femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Ricci Ricci EDP", slug: null },

  // Paco Rabanne Femme
  { keyword: "olympea intense paco rabanne", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Olympéa Intense EDP", slug: null },
  { keyword: "olympea aqua paco rabanne", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Olympéa Aqua EDT", slug: null },
  { keyword: "olympea blossom paco rabanne", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Olympéa Blossom EDT", slug: null },
  { keyword: "fame paco rabanne femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Fame EDP bestseller 2022", slug: null },
  { keyword: "fame parfum paco rabanne femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Fame Parfum concentration", slug: null },
  { keyword: "lady million lucky paco rabanne", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Lady Million Lucky EDP", slug: null },

  // Prada Femme
  { keyword: "prada candy kiss femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Candy Kiss EDP", slug: null },
  { keyword: "prada infusion d iris femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Infusion d'Iris EDP accessible niche", slug: null },
  { keyword: "prada paradoxe femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Paradoxe EDP bestseller 2022", slug: null },
  { keyword: "prada amber femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Amber Pour Femme EDP", slug: null },

  // Ralph Lauren Femme
  { keyword: "ralph femme ralph lauren", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Ralph EDT bestseller ados 2000s", slug: null },
  { keyword: "romance femme ralph lauren", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Romance Women EDP", slug: null },

  // Tom Ford Femme
  { keyword: "tom ford velvet orchid femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Velvet Orchid EDP", slug: null },
  { keyword: "tom ford rose prick femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Rose Prick EDP niche", slug: null },
  { keyword: "tom ford lost cherry femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Lost Cherry EDP cult niche", slug: null },
  { keyword: "tom ford soleil blanc femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Soleil Blanc EDP été", slug: null },
  { keyword: "tom ford cafe rose femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Café Rose EDP", slug: null },

  // Valentino Femme
  { keyword: "valentina femme valentino", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Valentina EDP floral", slug: null },
  { keyword: "valentino donna femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Donna EDP", slug: null },
  { keyword: "voce viva valentino femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Voce Viva EDP", slug: null },

  // Versace Femme
  { keyword: "bright crystal versace femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Bright Crystal EDT bestseller", slug: null },
  { keyword: "yellow diamond versace femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Yellow Diamond EDT", slug: null },
  { keyword: "crystal noir versace femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Crystal Noir EDP", slug: null },
  { keyword: "dylan blue femme versace", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Dylan Blue Pour Femme EDP", slug: null },
  { keyword: "eros pour femme versace", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Eros Pour Femme EDP", slug: null },

  // Viktor & Rolf Femme
  { keyword: "flowerbomb viktor rolf femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Flowerbomb EDP top 5 mondial femme", slug: null },
  { keyword: "flowerbomb nectar viktor rolf", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Flowerbomb Nectar EDP", slug: null },
  { keyword: "flowerbomb midnight viktor rolf", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Flowerbomb Midnight EDP", slug: null },
  { keyword: "good fortune viktor rolf femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Good Fortune EDP", slug: null },

  // YSL Femme
  { keyword: "ysl opium femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Opium EDP classique iconique", slug: null },
  { keyword: "ysl paris femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Paris EDP rose cult classique", slug: null },
  { keyword: "ysl parisienne femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Parisienne EDP", slug: null },
  { keyword: "ysl elle femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Elle EDP", slug: null },
  { keyword: "mon paris intensement ysl", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Mon Paris Intensément EDP", slug: null },
  { keyword: "black opium le parfum ysl", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Black Opium Le Parfum concentration", slug: null },
  { keyword: "libre intense ysl femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Libre Intense EDP", slug: null },

  // Zadig & Voltaire Femme
  { keyword: "this is love femme zadig voltaire", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "This Is Love! Pour Elle EDP", slug: null },
  { keyword: "girls can do anything zadig voltaire", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Girls Can Do Anything EDP", slug: null },

  // Divers Femme
  { keyword: "lolita lempicka femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Lolita Lempicka EDP bestseller France/Maghreb pomme violette", slug: null },
  { keyword: "dkny be delicious femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Be Delicious Women EDP pomme verte bestseller", slug: null },
  { keyword: "issey miyake l eau pure femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "L'Eau d'Issey Pure EDP", slug: null },
  { keyword: "stella mccartney stella femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Stella EDP floral classique", slug: null },
  { keyword: "jil sander sun femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Sun EDT été abordable", slug: null },
  { keyword: "miu miu edp femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Miu Miu EDP jasmin/poivre", slug: null },
  { keyword: "parfums de marly delina exclusif", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Delina Exclusif EDP version intense", slug: null },
  { keyword: "parfums de marly oriana femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Oriana EDP femme niche", slug: null },
  { keyword: "parfums de marly valaya femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Valaya EDP femme niche", slug: null },
  { keyword: "parfums de marly cassili femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Cassili EDP femme niche", slug: null },
  { keyword: "mfk a la rose femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "MFK À la Rose EDP niche", slug: null },
  { keyword: "mfk gentle fluidity gold", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "MFK Gentle Fluidity Gold mixte", slug: null },

  // ─── ORIENTAUX & ARABES ──────────────────────────────────────────────────

  // Al Haramain manquants
  { keyword: "l aventure al haramain homme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "L'Aventure EDP bestseller Algérie", slug: null },
  { keyword: "l aventure femme al haramain", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "L'Aventure Femme EDP", slug: null },
  { keyword: "amber oud black edition al haramain", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Amber Oud Black Edition EDP", slug: null },
  { keyword: "amber oud blue edition al haramain", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Amber Oud Blue Edition EDP", slug: null },
  { keyword: "madinah al haramain oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Madinah EDP oriental", slug: null },
  { keyword: "rose oud al haramain femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Rose & Oud oriental femme", slug: null },

  // Arabian Oud
  { keyword: "kalemat arabian oud", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Kalemat EDP bestseller Algérie/Maghreb", slug: null },
  { keyword: "molto bello arabian oud", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Molto Bello EDP", slug: null },
  { keyword: "safari arabian oud", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Safari EDP", slug: null },
  { keyword: "khaltat al arabia arabian oud", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Khaltat Al Arabia oriental", slug: null },

  // Armaf
  { keyword: "club de nuit intense man armaf", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Club de Nuit Intense Man EDP clone Aventus", slug: null },
  { keyword: "club de nuit intense woman armaf", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Club de Nuit Intense Woman EDP", slug: null },
  { keyword: "club de nuit milestone armaf", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Club de Nuit Milestone EDP", slug: null },
  { keyword: "bucephalus armaf homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Bucephalus EDP", slug: null },

  // Ajmal
  { keyword: "ajmal amber wood oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Amber Wood EDP oriental", slug: null },
  { keyword: "ajmal oudsoul oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Oudsoul EDP", slug: null },
  { keyword: "ajmal sacrifice homme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Sacrifice for Him EDP", slug: null },

  // Attar Collection
  { keyword: "the queen of sheba attar collection", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "The Queen of Sheba EDP oriental premium", slug: null },
  { keyword: "khaltat night attar collection", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Khaltat Night EDP", slug: null },

  // El Nabil manquants
  { keyword: "el nabil musc al imam", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Musc Al Imam populaire Algérie", slug: null },
  { keyword: "el nabil musc tahara", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Musc Tahara bestseller halal", slug: null },
  { keyword: "el nabil sultan oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Sultan EDP", slug: null },
  { keyword: "el nabil or blanc oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Or Blanc EDP", slug: null },
  { keyword: "el nabil rose arabie femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Rose d'Arabie EDP femme oriental", slug: null },

  // Kajal
  { keyword: "kajal lamar oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Lamar EDP niche levantine", slug: null },
  { keyword: "kajal almaz oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Almaz EDP", slug: null },
  { keyword: "kajal wadi al khaleej", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Wadi Al Khaleej EDP", slug: null },
  { keyword: "kajal dahab oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Dahab EDP", slug: null },

  // Khadlaj
  { keyword: "khadlaj rihab oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Rihab EDP oriental", slug: null },
  { keyword: "khadlaj velvet rose oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Velvet Rose EDP", slug: null },
  { keyword: "khadlaj intense oud", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Intense Oud EDP", slug: null },
  { keyword: "hareem al sultan khadlaj femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Hareem Al Sultan oriental femme", slug: null },

  // Lattafa manquants
  { keyword: "lattafa ana abiyedh femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Ana Abiyedh EDP bestseller Algérie", slug: null },
  { keyword: "lattafa yara femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Yara EDP femme bestseller", slug: null },
  { keyword: "lattafa pride oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Pride EDP", slug: null },
  { keyword: "lattafa khaltat layali oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Khaltat Layali EDP", slug: null },
  { keyword: "lattafa oud for glory", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Oud for Glory EDP bestseller", slug: null },
  { keyword: "lattafa badee al oud oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Badee Al Oud EDP", slug: null },
  { keyword: "lattafa caramel man oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Caramel Man EDP gourmand oriental", slug: null },
  { keyword: "lattafa warde femme oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Warde EDP femme rose orientale", slug: null },

  // Montale
  { keyword: "montale dark aoud oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Dark Aoud EDP niche oriental fort", slug: null },
  { keyword: "montale black aoud oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Black Aoud EDP", slug: null },
  { keyword: "montale roses musk femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Roses Musk EDP bestseller féminin", slug: null },
  { keyword: "montale intense cafe oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Intense Café EDP gourmand", slug: null },
  { keyword: "montale aoud damascus oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Aoud Damascus EDP", slug: null },
  { keyword: "montale vanille absolu oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Vanille Absolu EDP gourmand", slug: null },
  { keyword: "montale honey aoud oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Honey Aoud EDP", slug: null },

  // Rasasi manquants
  { keyword: "la yuqawam rasasi homme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "La Yuqawam Homme EDP bestseller", slug: null },
  { keyword: "la yuqawam rasasi femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "La Yuqawam Femme EDP", slug: null },
  { keyword: "dhan al oudh rasasi", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Dhan Al Oudh Bakhoor", slug: null },
  { keyword: "junoon sillage rasasi", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Junoon Sillage EDP", slug: null },
  { keyword: "hawas ice rasasi", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Hawas Ice EDT fraicheur", slug: null },
  { keyword: "nebras al oud rasasi", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Nebras Al Oud EDP", slug: null },

  // Swiss Arabian
  { keyword: "shaghaf oud swiss arabian", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Shaghaf Oud Aswad EDP bestseller", slug: null },
  { keyword: "oud al layl swiss arabian", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Oud Al Layl EDP", slug: null },
  { keyword: "nouf swiss arabian femme", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Nouf EDP femme oriental", slug: null },

  // Zimaya
  { keyword: "zimaya fakhar oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Fakhar EDP Zimaya/Lattafa", slug: null },
  { keyword: "zimaya najdia oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Najdia EDP", slug: null },

  // Amouage Oriental
  { keyword: "amouage gold woman", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Gold Woman EDP classique oriental luxe", slug: null },
  { keyword: "amouage epic woman", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Epic Woman EDP", slug: null },
  { keyword: "amouage interlude woman", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Interlude Woman EDP", slug: null },

  // Nasomatto
  { keyword: "black afgano nasomatto", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Black Afgano Extrait bestseller niche cult", slug: null },

  // Franck Olivier manquants
  { keyword: "franck olivier black touch", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Black Touch EDP accessible", slug: null },
  { keyword: "franck olivier oud touch", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Oud Touch EDP oriental", slug: null },
  { keyword: "franck olivier orient gold", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Orient Gold EDP oriental", slug: null },

  // ─── NICHE / TENDANCE ────────────────────────────────────────────────────

  // Byredo
  { keyword: "byredo bal d afrique", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Bal d'Afrique EDP bestseller niche mondial", slug: null },
  { keyword: "byredo gypsy water", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Gypsy Water EDP niche cult", slug: null },
  { keyword: "byredo mojave ghost", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Mojave Ghost EDP mixte", slug: null },
  { keyword: "byredo blanche femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Blanche EDP", slug: null },
  { keyword: "byredo rose of no man s land", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Rose of No Man's Land EDP", slug: null },

  // Diptyque
  { keyword: "diptyque philosykos", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Philosykos EDT figue niche cult", slug: null },
  { keyword: "diptyque do son femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Do Son EDT floral niche", slug: null },
  { keyword: "diptyque tam dao", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Tam Dao EDT mixte boisé", slug: null },
  { keyword: "diptyque eau rose femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Eau Rose EDT", slug: null },

  // Jo Malone
  { keyword: "jo malone english pear freesia", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "English Pear & Freesia n°1 Jo Malone mondial", slug: null },
  { keyword: "jo malone blackberry bay", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Blackberry & Bay Cologne", slug: null },
  { keyword: "jo malone wood sage sea salt", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Wood Sage & Sea Salt Cologne", slug: null },
  { keyword: "jo malone orange blossom", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Orange Blossom Cologne", slug: null },
  { keyword: "jo malone velvet rose oud", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Velvet Rose & Oud Cologne Intense", slug: null },
  { keyword: "jo malone peony blush suede", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Peony & Blush Suede Cologne", slug: null },

  // Le Labo
  { keyword: "le labo santal 33", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Santal 33 EDP bestseller absolu niche", slug: null },
  { keyword: "le labo rose 31", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Rose 31 EDP mixte niche", slug: null },
  { keyword: "le labo another 13", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Another 13 EDP mixte", slug: null },
  { keyword: "le labo the noir 29", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "The Noir 29 EDP mixte", slug: null },

  // Maison Margiela Replica
  { keyword: "replica beach walk maison margiela", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Beach Walk EDT bestseller été niche", slug: null },
  { keyword: "replica jazz club maison margiela", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Jazz Club EDT bestseller homme niche", slug: null },
  { keyword: "replica by the fireplace maison margiela", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "By the Fireplace EDT hiver niche", slug: null },
  { keyword: "replica flower market maison margiela", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Flower Market EDT floral", slug: null },
  { keyword: "replica lazy sunday morning maison margiela", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Lazy Sunday Morning EDP", slug: null },

  // Mancera
  { keyword: "mancera roses vanille femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Roses Vanille EDP bestseller accessible", slug: null },
  { keyword: "mancera cedrat boise homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Cedrat Boisé EDP bestseller niche accessible", slug: null },
  { keyword: "mancera instant crush", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Instant Crush EDP mixte", slug: null },
  { keyword: "mancera wild cherry femme", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Wild Cherry EDP gourmand", slug: null },
  { keyword: "mancera patchouli intense", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Patchouli Intense EDP", slug: null },

  // MFK manquants
  { keyword: "baccarat rouge 540 extrait mfk", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Baccarat Rouge 540 Extrait version", slug: null },
  { keyword: "mfk aqua universalis", volume: null, kd: null, category: "parfums-femme", type: "product", status: "pending", note: "Aqua Universalis EDT niche", slug: null },
  { keyword: "mfk aqua vitae homme", volume: null, kd: null, category: "parfums-homme", type: "product", status: "pending", note: "Aqua Vitae EDT été niche", slug: null },
  { keyword: "mfk grand soir oriental", volume: null, kd: null, category: "parfums-orientaux", type: "product", status: "pending", note: "Grand Soir EDP ambre oriental niche", slug: null },
];

// Chargement du fichier existant
const existing = JSON.parse(readFileSync(KW_PATH, 'utf8'));

// Vérification doublons par keyword
const existingKeywords = new Set(existing.map(k => k.keyword.toLowerCase()));
const toAdd = newKeywords.filter(k => !existingKeywords.has(k.keyword.toLowerCase()));
const duplicates = newKeywords.filter(k => existingKeywords.has(k.keyword.toLowerCase()));

console.log(`\n📊 Keywords existants : ${existing.length}`);
console.log(`📥 Nouveaux à ajouter : ${toAdd.length}`);
if (duplicates.length > 0) {
  console.log(`⚠️  Doublons ignorés : ${duplicates.length}`);
  duplicates.forEach(d => console.log(`   - ${d.keyword}`));
}

// Ajout
const updated = [...existing, ...toAdd];
writeFileSync(KW_PATH, JSON.stringify(updated, null, 2), 'utf8');

console.log(`\n✅ keywords.json mis à jour : ${updated.length} entrées total`);
console.log(`   Pending : ${updated.filter(k => k.status === 'pending').length}`);
console.log(`   Done    : ${updated.filter(k => k.status === 'done').length}`);
console.log(`   Skip    : ${updated.filter(k => k.status === 'skip').length}`);
