import fs from 'fs';

const todo = JSON.parse(fs.readFileSync('./scripts/_catalog-audit/reecriture-todo.json', 'utf8')).slice(72, 84);

const forbidden = [
  'positionnement tarifaire',
  "pièce maîtresse d'une collection",
  "parfum d'appoint",
  'reste parfaitement lisible',
  'période de port privilégiée',
  'la construction olfactive révèle toute sa richesse',
  'fonctionne dans des contextes très variés',
  'sans jamais sembler décalé',
  'plaît naturellement à un public algérien',
  'il est grand temps de la découvrir',
  'une fragrance qui dure',
  'il est important de noter',
  'en conclusion',
  "n'hésitez pas",
  'pour conclure',
  'certificat de conformité',
  'nos entrepôts',
  'fournisseurs vérifiés',
  "coffret d'origine",
  'scellé',
  'dédouané',
  '2025',
  '---',
  '★',
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

let allOk = true;

for (const item of todo) {
  const p = './scripts/_catalog-audit/rewrites2/' + item.slug + '.json';
  if (!fs.existsSync(p)) {
    console.log('MISSING FILE', item.slug);
    allOk = false;
    continue;
  }
  let data;
  try {
    data = JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.log('JSON PARSE ERROR', item.slug, e.message);
    allOk = false;
    continue;
  }
  const desc = data.description;
  const short = data.shortDescription;
  const wc = (s) => s.trim().split(/\s+/).length;
  const descWords = wc(desc);
  const shortWords = wc(short);
  const paras = desc.split('\n\n');
  const nameCount = (desc.match(new RegExp(escapeRegex(item.name), 'g')) || []).length;

  const issues = [];
  if (descWords < 225 || descWords > 310) issues.push('descWords=' + descWords);
  if (shortWords < 25 || shortWords > 58) issues.push('shortWords=' + shortWords);
  if (paras.length < 3 || paras.length > 4) issues.push('paras=' + paras.length);
  if (nameCount > 3) issues.push('nameCount=' + nameCount);
  const lowerDesc = desc.toLowerCase();
  for (const f of forbidden) {
    if (lowerDesc.includes(f.toLowerCase())) issues.push('FORBIDDEN:' + f);
  }

  if (issues.length) {
    console.log(item.slug, issues.join(' | '));
    allOk = false;
  } else {
    console.log(item.slug, 'OK', 'descWords=' + descWords, 'shortWords=' + shortWords, 'paras=' + paras.length, 'nameCount=' + nameCount);
  }
}

console.log(allOk ? 'ALL OK' : 'ISSUES FOUND');
