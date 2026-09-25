import fs from 'fs';

const todo = JSON.parse(fs.readFileSync('./scripts/_catalog-audit/reecriture-todo.json', 'utf8')).slice(252, 264);

const forbiddenPhrases = [
  'positionnement tarifaire',
  "pièce maîtresse d'une collection",
  "piece maitresse d'une collection",
  "parfum d'appoint",
  'reste parfaitement lisible',
  'période de port privilégiée',
  'periode de port privilegiee',
  "la construction olfactive révèle toute sa richesse",
  'fonctionne dans des contextes très variés',
  'sans jamais sembler décalé',
  'plaît naturellement à un public algérien',
  'il est grand temps de la découvrir',
  'une fragrance qui dure',
  'il est important de noter',
  'en conclusion',
  "n'hésitez pas",
  'pour conclure',
  '---',
  '★',
  '/5',
  'certificat de conformité',
  'nos entrepôts',
  'fournisseurs vérifiés',
  "coffret d'origine",
  'scellé',
  'dédouané',
  '2025',
];

const hourRegex = /\b\d+\s*(heures?|h)\b/i;
const priceRegex = /\b\d[\d\s.,]*\s*(da|dzd|dinars?)\b/i;

let totalErrors = 0;

for (const item of todo) {
  const file = `./scripts/_catalog-audit/rewrites2/${item.slug}.json`;
  if (!fs.existsSync(file)) {
    console.log(`MISSING: ${item.slug}`);
    totalErrors++;
    continue;
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.log(`❌ ${item.slug}: JSON parse error: ${e.message}`);
    totalErrors++;
    continue;
  }

  const errs = [];

  const shortWords = data.shortDescription.trim().split(/\s+/).length;
  if (shortWords < 25 || shortWords > 55) errs.push(`shortDescription word count ${shortWords} (target 30-50)`);

  const paragraphs = data.description.split('\n\n');
  if (paragraphs.length < 3 || paragraphs.length > 4) errs.push(`paragraph count ${paragraphs.length} (target 3-4)`);

  const descWords = data.description.trim().split(/\s+/).length;
  if (descWords < 225 || descWords > 305) errs.push(`description word count ${descWords} (target 230-300)`);

  // name occurrence count
  const name = item.name;
  const nameRegex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const nameCount = (data.description.match(nameRegex) || []).length;
  if (nameCount > 3) errs.push(`name "${name}" appears ${nameCount} times in description (max 3)`);

  // forbidden phrases
  const lowerDesc = (data.shortDescription + ' ' + data.description).toLowerCase();
  for (const phrase of forbiddenPhrases) {
    if (lowerDesc.includes(phrase.toLowerCase())) errs.push(`forbidden phrase found: "${phrase}"`);
  }

  if (hourRegex.test(data.description) || hourRegex.test(data.shortDescription)) errs.push('numeric hour duration found');
  if (priceRegex.test(data.description) || priceRegex.test(data.shortDescription)) errs.push('price in digits found');

  // notes citation check
  const allowedNotes = [
    ...(item.notes.top || []),
    ...(item.notes.heart || []),
    ...(item.notes.base || []),
  ].map(n => n.toLowerCase());
  // generic words allowed regardless
  const genericAllowed = ['agrumes', 'agrume', 'boisé', 'boisée', 'boise', 'poudre', 'poudré', 'poudrée', 'aquatique', 'gourmand', 'gourmande', 'épice', 'epice', 'épicé', 'epicee', 'épicée'];

  // simplistic check: look for common perfume note words not in allowed list
  const commonNoteWords = ['vanille', 'ambre', 'musc', 'patchouli', 'jasmin', 'rose', 'oud', 'santal', 'cèdre', 'cedre', 'vétiver', 'vetiver', 'bergamote', 'citron', 'orange', 'lavande', 'menthe', 'safran', 'cardamome', 'poivre', 'tonka', 'cacao', 'iris', 'néroli', 'neroli', 'tubéreuse', 'tubereuse', 'pivoine', 'muguet', 'géranium', 'geranium', 'coriandre', 'muscade', 'girofle', 'noisette', 'cashmere', 'sauge', 'romarin', 'camomille', 'oliban', 'encens', 'paprika', 'marjolaine', 'mandarine', 'réglisse', 'reglisse', 'cappuccino', 'cyprès', 'cypres', 'sapin', 'ambrofix', 'labdanum', 'lys', 'poire', 'ambrette'];

  for (const w of commonNoteWords) {
    if (lowerDesc.includes(w)) {
      const isAllowed = allowedNotes.some(n => n.includes(w) || w.includes(n.split(' ')[0]));
      if (!isAllowed) {
        errs.push(`possible note not in source: "${w}"`);
      }
    }
  }

  if (errs.length) {
    console.log(`❌ ${item.slug}:`);
    errs.forEach(e => console.log('   - ' + e));
    totalErrors += errs.length;
  } else {
    console.log(`✅ ${item.slug} (short:${shortWords}w desc:${descWords}w para:${paragraphs.length} name:${nameCount}x)`);
  }
}

console.log(totalErrors ? `\n⚠️ ${totalErrors} problèmes` : '\n✅ 0 erreur');
