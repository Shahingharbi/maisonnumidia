#!/usr/bin/env node
// Classeur simple pour un stock en dépôt-vente : UNE LIGNE PAR FLACON, une case « Vendu » à cocher,
// et la part du fournisseur et notre bénéfice qui s'affichent tout seuls. Totaux en haut.
//
//   node scripts/stock/stock-simple.mjs <flacons.json> <sortie.xlsx> ["Prénom du fournisseur"]
//
// flacons.json : [{ "parfum": "...", "ml": 100, "qte": 2, "prixSite": 16500, "remarque": "..." }]
// (une entrée par référence ; la quantité est dépliée en autant de lignes).
// Les cases à cocher s'ajoutent dans Google Sheets après import (Insertion > Case à cocher sur F4:F400) :
// le format .xlsx n'en a pas.
import fs from "fs";

const [entree, sortie, fournisseur = "fournisseur"] = process.argv.slice(2);
if (!entree || !sortie) { console.error("usage : stock-simple.mjs <flacons.json> <sortie.xlsx> [fournisseur]"); process.exit(2); }
const refs = JSON.parse(fs.readFileSync(entree, "utf8"));
const flacons = refs.flatMap((r) => Array.from({ length: r.qte || 1 }, () => r));

const LIGNES = 400; // lignes prêtes (formules) ; on en ajoute en bas au fil des arrivages
const DEBUT = 4; // première ligne de flacon
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cell = (ref, v, s = 0) => {
  if (v === "" || v === undefined || v === null) return s ? `<c r="${ref}" s="${s}"/>` : "";
  if (typeof v === "object") return `<c r="${ref}" s="${s}"><f>${esc(v.f)}</f></c>`;
  if (typeof v === "number") return `<c r="${ref}" s="${s}"><v>${v}</v></c>`;
  return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
};
const L = "ABCDEFGHI".split("");
const fin = DEBUT + LIGNES - 1;
const rows = [];
// Ligne 1 : totaux ; ligne 3 : en-têtes
rows.push([
  ["Flacons", 5], [{ f: `COUNTA(A${DEBUT}:A${fin})` }, 6], ["Vendus", 5], [{ f: `COUNTIF(F${DEBUT}:F${fin},TRUE)` }, 6],
  [`À donner à ${fournisseur}`, 5], [{ f: `SUM(G${DEBUT}:G${fin})` }, 6], ["Notre bénéfice", 5], [{ f: `SUM(H${DEBUT}:H${fin})` }, 6], ["", 0],
]);
rows.push([]);
rows.push([["Parfum", 1], ["ml", 1], [`Prix ${fournisseur} (DA)`, 1], ["Prix de vente (DA)", 1], ["Prix sur le site (DA)", 1], ["Vendu", 1], [`Pour ${fournisseur} (DA)`, 1], ["Notre bénéfice (DA)", 1], ["Remarques", 1]]);
for (let i = 0; i < LIGNES; i++) {
  const r = DEBUT + i, f = flacons[i] || {};
  rows.push([
    [f.parfum || "", 0], [f.ml || "", 0], ["", 3], ["", 3], [f.prixSite || "", 3], ["", 0],
    [{ f: `IF(F${r}=TRUE,C${r},"")` }, 4], [{ f: `IF(F${r}=TRUE,D${r}-C${r},"")` }, 4], [f.remarque || "", 0],
  ]);
}
const largeurs = [52, 7, 14, 14, 14, 8, 14, 16, 58];
const feuille = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols>${largeurs.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>
<sheetData>${rows.map((r, i) => `<row r="${i + 1}"${i === 0 ? ' ht="22" customHeight="1"' : ""}>${r.map(([v, s], j) => cell(`${L[j]}${i + 1}`, v, s)).join("")}</row>`).join("\n")}</sheetData>
</worksheet>`;
// Styles : 0 normal, 1 en-tête or, 2 libre, 3 milliers, 4 calculé gris + milliers, 5 total libellé gras, 6 total valeur gras + milliers
const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0"/></numFmts>
<fonts count="3"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FF111111"/><name val="Arial"/></font><font><b/><sz val="13"/><color rgb="FF111111"/><name val="Arial"/></font></fonts>
<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFC9A84C"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFF3F1EA"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFAF3DC"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment wrapText="1" vertical="center"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="164" fontId="0" fillId="3" borderId="0" xfId="0" applyNumberFormat="1" applyFill="1"/>
<xf numFmtId="0" fontId="1" fillId="4" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
<xf numFmtId="164" fontId="2" fillId="4" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
</cellXfs></styleSheet>`;
const fichiers = {
  "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
  "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Stock" sheetId="1" r:id="rId1"/></sheets></workbook>`,
  "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
  "xl/styles.xml": styles,
  "xl/worksheets/sheet1.xml": feuille,
};
// Zip « stocké » avec CRC32
const T = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = (b) => { let c = 0xffffffff; for (const x of b) c = T[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const parts = [], cen = [];
let off = 0;
for (const [nom, txt] of Object.entries(fichiers)) {
  const d = Buffer.from(txt, "utf8"), n = Buffer.from(nom, "utf8"), c = crc32(d);
  const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt32LE(c, 14); h.writeUInt32LE(d.length, 18); h.writeUInt32LE(d.length, 22); h.writeUInt16LE(n.length, 26);
  parts.push(h, n, d);
  const e = Buffer.alloc(46); e.writeUInt32LE(0x02014b50, 0); e.writeUInt16LE(20, 4); e.writeUInt16LE(20, 6); e.writeUInt16LE(0x0800, 8); e.writeUInt32LE(c, 16); e.writeUInt32LE(d.length, 20); e.writeUInt32LE(d.length, 24); e.writeUInt16LE(n.length, 28); e.writeUInt32LE(off, 42);
  cen.push(e, n);
  off += 30 + n.length + d.length;
}
const cd = Buffer.concat(cen), z = Buffer.alloc(22);
z.writeUInt32LE(0x06054b50, 0); z.writeUInt16LE(Object.keys(fichiers).length, 8); z.writeUInt16LE(Object.keys(fichiers).length, 10); z.writeUInt32LE(cd.length, 12); z.writeUInt32LE(off, 16);
fs.writeFileSync(sortie, Buffer.concat([...parts, cd, z]));
console.log(`${sortie} : ${refs.length} références, ${flacons.length} flacons, ${LIGNES} lignes prêtes`);
