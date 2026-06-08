#!/usr/bin/env node
// TEMP diagnostic — query GSC URL Inspection API for REAL index status of a sample of URLs.
import fs from "fs";
import crypto from "crypto";

const CREDS = JSON.parse(fs.readFileSync("./.credentials/google-indexing.json", "utf8"));
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const INSPECT_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

function b64url(i){return Buffer.from(i).toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");}
async function token(){
  const now=Math.floor(Date.now()/1000);
  const claim={iss:CREDS.client_email,scope:SCOPE,aud:TOKEN_URL,exp:now+3600,iat:now};
  const si=`${b64url(JSON.stringify({alg:"RS256",typ:"JWT"}))}.${b64url(JSON.stringify(claim))}`;
  const sig=crypto.createSign("RSA-SHA256").update(si).sign(CREDS.private_key).toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
  const r=await fetch(TOKEN_URL,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:`${si}.${sig}`})});
  if(!r.ok) throw new Error(`token ${r.status} ${await r.text()}`);
  return (await r.json()).access_token;
}
async function inspect(tok, siteUrl, url){
  const r=await fetch(INSPECT_URL,{method:"POST",headers:{Authorization:`Bearer ${tok}`,"Content-Type":"application/json"},body:JSON.stringify({inspectionUrl:url,siteUrl})});
  const t=await r.text();
  return {status:r.status, json:(()=>{try{return JSON.parse(t)}catch{return {raw:t}}})()};
}

function bucket(u){
  if(/\/parfums\/[^/]+$/.test(u)) return "produit";
  if(/\/(parfums-homme|parfums-femme|parfums-orientaux)\/[^/]+$/.test(u)) return "filtre-cat";
  if(/\/marques\/[^/]+$/.test(u)) return "marque";
  if(/\/blog\/[^/]+$/.test(u)) return "blog";
  return "core";
}
function sample(arr,n){ if(arr.length<=n) return arr; const step=arr.length/n; const out=[]; for(let i=0;i<n;i++) out.push(arr[Math.floor(i*step)]); return out; }

const log=JSON.parse(fs.readFileSync("./data/indexing-log.json","utf8"));
const urls=Object.keys(log.submitted||{});
const byBucket={core:[],blog:[],marque:[],"filtre-cat":[],produit:[]};
urls.forEach(u=>byBucket[bucket(u)].push(u));
const plan=[...sample(byBucket.core,8),...sample(byBucket.blog,6),...sample(byBucket.marque,12),...sample(byBucket["filtre-cat"],12),...sample(byBucket.produit,16)];

console.log("Sous-population soumise:", Object.fromEntries(Object.entries(byBucket).map(([k,v])=>[k,v.length])));
console.log("Echantillon a inspecter:", plan.length, "URLs\n");

const tok=await token();
// Liste des proprietes accessibles par ce compte de service
const sitesRes=await fetch("https://searchconsole.googleapis.com/webmasters/v3/sites",{headers:{Authorization:`Bearer ${tok}`}});
const sitesJson=await sitesRes.json().catch(()=>({}));
const entries=sitesJson.siteEntry||[];
console.log("Proprietes accessibles par le compte de service ("+entries.length+"):");
entries.forEach(e=>console.log("   -", e.siteUrl, "["+e.permissionLevel+"]"));
console.log("");
const candidates=entries.filter(e=>/maisonnumidia/.test(e.siteUrl)).map(e=>e.siteUrl);
const tryList = candidates.length?candidates:["sc-domain:maisonnumidia.store","https://maisonnumidia.store/"];
let siteUrl=null, probe=null;
for(const s of tryList){
  probe=await inspect(tok, s, "https://maisonnumidia.store/");
  if(probe.status===200){ siteUrl=s; break; }
  console.log(`  essai ${s} -> ${probe.status} ${JSON.stringify(probe.json?.error?.message||"").slice(0,80)}`);
}
if(!siteUrl){
  console.log("\nECHEC: le compte de service n'a acces a aucune propriete GSC maisonnumidia.");
  console.log("=> Ajoute "+CREDS.client_email+" comme utilisateur dans Search Console.");
  process.exit(2);
}
console.log("Property GSC utilisee:", siteUrl, "\n");

const tally={};
const byType={};
const notIndexed=[];
const all=[...plan];
if(!all.includes("https://maisonnumidia.store/")) all.unshift("https://maisonnumidia.store/");
for(let i=0;i<all.length;i++){
  const u=all[i];
  let res=await inspect(tok, siteUrl, u);
  const st=res.json?.inspectionResult?.indexStatusResult?.coverageState || `HTTP_${res.status}`;
  const verdict=res.json?.inspectionResult?.indexStatusResult?.verdict || "";
  tally[st]=(tally[st]||0)+1;
  const b=bucket(u); byType[b]=byType[b]||{}; byType[b][st]=(byType[b][st]||0)+1;
  if(!/indexed/i.test(st) || /not indexed/i.test(st)) notIndexed.push([b,st,u]);
  process.stdout.write(`[${i+1}/${all.length}] ${b.padEnd(10)} ${st}\n`);
  await new Promise(r=>setTimeout(r,200));
}

console.log("\n===== RESULTAT GLOBAL (coverageState) =====");
Object.entries(tally).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(`  ${v}\t${k}`));
console.log("\n===== PAR TYPE DE PAGE =====");
Object.entries(byType).forEach(([t,m])=>{console.log(`  ${t}:`); Object.entries(m).forEach(([k,v])=>console.log(`     ${v}\t${k}`));});
console.log("\n===== EXEMPLES NON-INDEXES =====");
notIndexed.slice(0,15).forEach(([b,st,u])=>console.log(`  [${b}] ${st} — ${u}`));
