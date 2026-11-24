#!/usr/bin/env node
// Génère un classeur .xlsx (à importer dans Google Sheets) pour compter un stock en dépôt-vente :
// onglet « Inventaire » (une ligne par parfum reçu), onglet « Catalogue site » (nos fiches, pour la
// liste déroulante et le prix du site) et onglet « Résumé » (ce qu'on doit au fournisseur).
//
//   node scripts/stock/inventaire-depot-vente.mjs <sortie.xlsx> ["Nom du fournisseur"]
//
// Aucune bibliothèque : le .xlsx est un zip (méthode « stockée », sans compression) de quelques XML.
// Les formules sont en syntaxe anglaise (virgules), comme le veut le format ; Google Sheets les
// convertit à l'import quelle que soit la langue du compte.
import fs from "fs";

const [sortie, fournisseur = "fournisseur"] = process.argv.slice(2);
if (!sortie) { console.error("usage : inventaire-depot-vente.mjs <sortie.xlsx> [fournisseur]"); process.exit(2); }

const cat = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const CONC = { EDP: "eau de parfum", EDT: "eau de toilette", Parfum: "parfum", "Extrait de Parfum": "extrait de parfum", Cologne: "eau de Cologne" };
const ml = (v) => Number(String(v || "").replace(/[^\d.]/g, "")) || "";

// Onglet Catalogue : un libellé unique par fiche, trié par marque puis nom
const lignesCat = cat.products
  .map((p) => {
    const nom = p.brand.toLowerCase() === p.name.toLowerCase() || p.name.toLowerCase().includes(p.brand.toLowerCase()) ? p.name : `${p.brand} ${p.name}`;
    return { libelle: `${nom}, ${CONC[p.concentration] || p.concentration}${p.volume ? ` ${ml(p.volume)} ml` : ""}`, marque: p.brand, ml: ml(p.volume), prix: p.price, lien: `https://maisonnumidia.store/parfums/${p.slug}`, stock: p.inStock ? "oui" : "rupture" };
  })
  .sort((a, b) => a.libelle.localeCompare(b.libelle, "fr"));
const vus = new Map();
for (const l of lignesCat) { const n = (vus.get(l.libelle) || 0) + 1; vus.set(l.libelle, n); if (n > 1) l.libelle += ` (${n})`; }
const NCAT = lignesCat.length + 1;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const col = (i) => { let s = ""; i++; while (i) { const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); } return s; };
const cell = (ref, v, style = 0) => {
  if (v === "" || v === null || v === undefined) return style ? `<c r="${ref}" s="${style}"/>` : "";
  if (typeof v === "object" && v.f) return `<c r="${ref}" s="${style}"><f>${esc(v.f)}</f></c>`;
  if (typeof v === "number") return `<c r="${ref}" s="${style}"><v>${v}</v></c>`;
  return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
};
const sheet = ({ rows, widths, freeze = true, validations = "" }) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
${freeze ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` : ""}
<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>
<sheetData>${rows.map((r, i) => `<row r="${i + 1}">${r.map(([v, s], j) => cell(`${col(j)}${i + 1}`, v, s)).join("")}</row>`).join("\n")}</sheetData>
${validations}
</worksheet>`;

// Styles : 0 normal, 1 en-tête (gras, fond or), 2 calculé (fond gris clair), 3 milliers « 9 200 », 4 calculé + milliers
const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0"/></numFmts>
<fonts count="2"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FF111111"/><name val="Arial"/></font></fonts>
<fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFC9A84C"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF3F1EA"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="5">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="3" borderId="0" xfId="0" applyFill="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="164" fontId="0" fillId="3" borderId="0" xfId="0" applyNumberFormat="1" applyFill="1"/>
</cellXfs></styleSheet>`;

// Onglet Inventaire
const N = 300; // lignes prêtes à remplir
const ENTETES = [
  ["N°", 5], ["Date d'arrivée", 11], ["Parfum (choisir dans la liste ; sinon l'écrire)", 46], ["Contenance réelle (ml)", 11],
  ["Quantité reçue", 10], [`Prix ${fournisseur} / flacon (DA)`, 13], ["Prix de vente boutique (DA)", 13],
  ["Marge / flacon (DA)", 11], ["Marge (%)", 8], ["Prix sur le site (DA)", 12], ["Contenance site (ml)", 11],
  ["Contrôle ml", 20], ["Écart boutique − site (DA)", 12], ["Vendus", 8], ["Reste en stock", 9],
  [`À payer à ${fournisseur} (DA)`, 13], ["Déjà payé (DA)", 12], ["Reste à payer (DA)", 12],
  ["État", 12], ["Code-barres / n° de lot", 18], ["Fiche sur le site", 40], ["Remarques", 30],
];
const C = Object.fromEntries(ENTETES.map(([, ], i) => [i, col(i)]));
const rows = [ENTETES.map(([t]) => [t, 1])];
const look = (r, k) => `IFERROR(VLOOKUP(C${r},Catalogue!$A$2:$F$${NCAT},${k},FALSE),"")`;
for (let r = 2; r <= N + 1; r++) {
  rows.push([
    [r - 1, 0], ["", 0], ["", 0], ["", 0], ["", 0], ["", 3], ["", 3],
    [{ f: `IF(OR(F${r}="",G${r}=""),"",G${r}-F${r})` }, 4],
    [{ f: `IF(OR(H${r}="",G${r}=0),"",ROUND(H${r}/G${r}*100,0))` }, 2],
    [{ f: look(r, 4) }, 4],
    [{ f: look(r, 3) }, 2],
    [{ f: `IF(OR(C${r}="",J${r}=""),IF(C${r}="","","pas sur le site"),IF(D${r}="","ml à saisir",IF(D${r}=K${r},"ok, même ml","ATTENTION ml différent")))` }, 2],
    [{ f: `IF(OR(G${r}="",J${r}=""),"",G${r}-J${r})` }, 4],
    ["", 0],
    [{ f: `IF(E${r}="","",E${r}-N(N${r}))` }, 2],
    [{ f: `IF(OR(F${r}="",N${r}=""),"",N${r}*F${r})` }, 4],
    ["", 3],
    [{ f: `IF(P${r}="","",P${r}-N(Q${r}))` }, 4],
    ["", 0], ["", 0],
    [{ f: look(r, 5) }, 2],
    ["", 0],
  ]);
}
const validations = `<dataValidations count="2">
<dataValidation type="list" allowBlank="1" showErrorMessage="0" sqref="C2:C${N + 1}"><formula1>Catalogue!$A$2:$A$${NCAT}</formula1></dataValidation>
<dataValidation type="list" allowBlank="1" showErrorMessage="0" sqref="S2:S${N + 1}"><formula1>"Scellé,Testeur,Sans boîte,Coffret,Abîmé"</formula1></dataValidation>
</dataValidations>`;
const inventaire = sheet({ rows, widths: ENTETES.map(([, w]) => w), validations });

// Onglet Catalogue site
const catalogue = sheet({
  rows: [[["Parfum (libellé du site)", 1], ["Marque", 1], ["Contenance (ml)", 1], ["Prix site (DA)", 1], ["Fiche", 1], ["En stock sur le site", 1]],
    ...lignesCat.map((l) => [[l.libelle, 0], [l.marque, 0], [l.ml, 0], [l.prix, 3], [l.lien, 0], [l.stock, 0]])],
  widths: [52, 20, 12, 12, 60, 12],
});

// Onglet Résumé
const R = `2:$${col(0)}$${N + 1}`.replace(/^/, ""); // non utilisé, lisibilité
const plage = (c) => `Inventaire!${c}2:${c}${N + 1}`;
const resume = sheet({
  rows: [
    [["Indicateur", 1], ["Valeur", 1], ["Comment c'est calculé", 1]],
    [["Références saisies", 0], [{ f: `COUNTA(${plage("C")})` }, 3], ["lignes avec un parfum", 0]],
    [["Flacons reçus", 0], [{ f: `SUM(${plage("E")})` }, 3], ["somme des quantités reçues", 0]],
    [[`Valeur au prix ${fournisseur} (DA)`, 0], [{ f: `SUMPRODUCT(N(+${plage("E")}),N(+${plage("F")}))` }, 3], ["quantité × prix fournisseur : ce qu'on lui devrait si tout se vend", 0]],
    [["Chiffre d'affaires possible (DA)", 0], [{ f: `SUMPRODUCT(N(+${plage("E")}),N(+${plage("G")}))` }, 3], ["quantité × prix de vente boutique", 0]],
    [["Marge possible (DA)", 0], [{ f: "B5-B4" }, 3], ["si tout se vend au prix boutique", 0]],
    [["Flacons vendus", 0], [{ f: `SUM(${plage("N")})` }, 3], ["", 0]],
    [["Flacons restants", 0], [{ f: "B3-B7" }, 3], ["", 0]],
    [[`Dû à ${fournisseur} sur les ventes (DA)`, 0], [{ f: `SUM(${plage("P")})` }, 3], ["vendus × prix fournisseur", 0]],
    [["Déjà payé (DA)", 0], [{ f: `SUM(${plage("Q")})` }, 3], ["", 0]],
    [["Reste à payer (DA)", 0], [{ f: "B9-B10" }, 3], ["", 0]],
    [["Parfums absents du site", 0], [{ f: `COUNTIF(${plage("L")},"pas sur le site")` }, 3], ["à ajouter au site ?", 0]],
    [["Contenances différentes du site", 0], [{ f: `COUNTIF(${plage("L")},"ATTENTION ml différent")` }, 3], ["le prix du site ne vaut pas pour ce flacon", 0]],
  ],
  widths: [36, 16, 60], freeze: false,
});

// Classeur
const feuilles = [["Inventaire", inventaire], ["Résumé", resume], ["Catalogue", catalogue]];
const fichiers = {
  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${feuilles.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`,
  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${feuilles.map(([n], i) => `<sheet name="${n}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>`,
  "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${feuilles.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${feuilles.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  "xl/styles.xml": styles,
  ...Object.fromEntries(feuilles.map(([, x], i) => [`xl/worksheets/sheet${i + 1}.xml`, x])),
};

// Zip « stocké » (sans compression), avec CRC32
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const parts = [], centrale = [];
let offset = 0;
for (const [nom, contenu] of Object.entries(fichiers)) {
  const data = Buffer.from(contenu, "utf8"), n = Buffer.from(nom, "utf8"), crc = crc32(data);
  const loc = Buffer.alloc(30); loc.writeUInt32LE(0x04034b50, 0); loc.writeUInt16LE(20, 4); loc.writeUInt16LE(0x0800, 6); loc.writeUInt16LE(0, 8);
  loc.writeUInt32LE(0, 10); loc.writeUInt32LE(crc, 14); loc.writeUInt32LE(data.length, 18); loc.writeUInt32LE(data.length, 22); loc.writeUInt16LE(n.length, 26); loc.writeUInt16LE(0, 28);
  parts.push(loc, n, data);
  const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(0x0800, 8); cen.writeUInt16LE(0, 10);
  cen.writeUInt32LE(0, 12); cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(data.length, 20); cen.writeUInt32LE(data.length, 24); cen.writeUInt16LE(n.length, 28);
  cen.writeUInt32LE(offset, 42); centrale.push(cen, n);
  offset += 30 + n.length + data.length;
}
const cd = Buffer.concat(centrale);
const fin = Buffer.alloc(22); fin.writeUInt32LE(0x06054b50, 0); fin.writeUInt16LE(Object.keys(fichiers).length, 8); fin.writeUInt16LE(Object.keys(fichiers).length, 10);
fin.writeUInt32LE(cd.length, 12); fin.writeUInt32LE(offset, 16);
fs.writeFileSync(sortie, Buffer.concat([...parts, cd, fin]));
console.log(`${sortie} : ${N} lignes à remplir, ${lignesCat.length} parfums dans le catalogue`);
