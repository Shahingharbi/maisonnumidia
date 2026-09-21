#!/usr/bin/env node
// Avancement de l'audit + régénération de todo.json (fiches restantes).
// Usage : node scripts/_catalog-audit/progress.mjs
import fs from "fs";
const RES = "./scripts/_catalog-audit/results";
const { products } = JSON.parse(fs.readFileSync("./data/products.json", "utf8"));
const files = fs.readdirSync(RES).filter((f) => f.endsWith(".json"));
const done = new Set(), broken = [];
for (const f of files) {
  try { JSON.parse(fs.readFileSync(`${RES}/${f}`, "utf8")); done.add(f.replace(".json", "")); }
  catch { broken.push(f); }
}
const todo = products.map((p) => p.slug).filter((s) => !done.has(s));
fs.writeFileSync("./scripts/_catalog-audit/todo.json", JSON.stringify(todo, null, 1));
const pct = Math.round((done.size / products.length) * 100);
console.log(`Audit : ${done.size}/${products.length} fiches (${pct}%) | restantes ${todo.length} | fichiers illisibles ${broken.length}`);
if (broken.length) console.log("  à refaire :", broken.join(", "));
console.log(`Reprendre : Workflow scriptPath=scripts/_catalog-audit/workflow-audit.js args={"total": ${todo.length}, "per": 12, "concurrency": 3}`);
