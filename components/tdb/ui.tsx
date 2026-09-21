"use client";

// Briques visuelles communes au tableau de bord.
// Charte du site : noir #111111, or #C9A84C, fond #FAFAF8, coins rounded-lg maximum.

import type { ReactNode } from "react";
import { COULEUR_STATUT } from "@/lib/tdb/constantes";
import type { Statut } from "@/lib/tdb/types";

export const BORDURE = "border border-[#E9E9E4]";

export function Carte({
  children,
  className = "",
  titre,
  action,
}: {
  children: ReactNode;
  className?: string;
  titre?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`bg-white ${BORDURE} rounded-lg ${className}`}>
      {(titre || action) && (
        <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-[#E9E9E4]">
          {titre && (
            <h2 className="text-[13px] font-semibold tracking-[0.12em] uppercase text-[#111111]">
              {titre}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Tuile({
  label,
  valeur,
  sous,
  ton = "or",
}: {
  label: string;
  valeur: string;
  sous?: string;
  ton?: "or" | "neutre" | "alerte" | "vert";
}) {
  const tons = {
    or: "bg-[#F6EFDD] text-[#8B6914]",
    neutre: "bg-[#F2F2EF] text-[#4A4A4A]",
    alerte: "bg-[#FBE7E5] text-[#B3261E]",
    vert: "bg-[#E4F4EA] text-[#1E7A45]",
  }[ton];
  return (
    <div className={`${tons} rounded-lg px-4 py-4 flex flex-col justify-between min-h-[104px]`}>
      <p className="text-[10px] font-semibold tracking-[0.14em] uppercase opacity-80">
        {label}
      </p>
      <p className="text-[22px] sm:text-[26px] leading-tight font-semibold text-[#111111] mt-2 tabular-nums">
        {valeur}
      </p>
      {sous && <p className="text-[11px] opacity-70 mt-1">{sous}</p>}
    </div>
  );
}

export function Pastille({ statut }: { statut: Statut }) {
  const [bg, fg] = COULEUR_STATUT[statut] ?? ["#EFEFEC", "#6B6B6B"];
  return (
    <span
      className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: bg, color: fg }}
    >
      {statut}
    </span>
  );
}

export function Etiquette({
  children,
  ton = "info",
}: {
  children: ReactNode;
  ton?: "info" | "risque" | "ok";
}) {
  const tons = {
    info: "bg-[#F6EFDD] text-[#8B6914]",
    risque: "bg-[#FBE7E5] text-[#B3261E]",
    ok: "bg-[#E4F4EA] text-[#1E7A45]",
  }[ton];
  return (
    <span className={`${tons} inline-block px-2 py-[3px] rounded text-[11px] font-semibold`}>
      {children}
    </span>
  );
}

export function Bouton({
  children,
  onClick,
  type = "button",
  variante = "principal",
  taille = "normal",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variante?: "principal" | "secondaire" | "discret" | "danger";
  taille?: "normal" | "petit";
  disabled?: boolean;
  className?: string;
}) {
  const variantes = {
    principal: "bg-[#111111] text-white hover:bg-[#2C2C2C] border border-[#111111]",
    secondaire:
      "bg-white text-[#111111] border border-[#D9D9D2] hover:border-[#C9A84C] hover:text-[#8B6914]",
    discret: "bg-transparent text-[#6B6B6B] hover:text-[#111111] border border-transparent",
    danger: "bg-white text-[#B3261E] border border-[#E8C9C6] hover:bg-[#FBE7E5]",
  }[variante];
  const tailles = taille === "petit" ? "px-2.5 py-1.5 text-[12px]" : "px-4 py-2.5 text-[13px]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantes} ${tailles} rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

const CHAMP_BASE =
  "w-full border border-[#DCDCD5] rounded-lg px-3 py-2 text-[13px] text-[#111111] bg-white " +
  "focus:outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 transition";

export function Champ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  aide,
  inputMode,
  calcule,
}: {
  label: string;
  value: string | number;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  aide?: string;
  inputMode?: "numeric" | "tel" | "text";
  calcule?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-[#6B6B6B] mb-1">{label}</span>
      <input
        type={type}
        value={value === null || value === undefined ? "" : value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        readOnly={calcule}
        className={`${CHAMP_BASE} ${calcule ? "bg-[#F1F6F2] text-[#1E7A45] font-semibold" : ""}`}
      />
      {aide && <span className="block text-[10px] text-[#9A9A94] mt-1">{aide}</span>}
    </label>
  );
}

export function Liste({
  label,
  value,
  onChange,
  options,
  vide = "—",
  aide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  vide?: string;
  aide?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-[#6B6B6B] mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={CHAMP_BASE}
      >
        <option value="">{vide}</option>
        {options.filter(Boolean).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {aide && <span className="block text-[10px] text-[#9A9A94] mt-1">{aide}</span>}
    </label>
  );
}

export function ZoneTexte({
  label,
  value,
  onChange,
  lignes = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  lignes?: number;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-[#6B6B6B] mb-1">{label}</span>
      <textarea
        value={value}
        rows={lignes}
        onChange={(e) => onChange(e.target.value)}
        className={`${CHAMP_BASE} resize-y`}
      />
    </label>
  );
}

export function Vide({ texte }: { texte: string }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-[13px] text-[#9A9A94]">{texte}</p>
    </div>
  );
}

export function TitreBloc({ children, aide }: { children: ReactNode; aide?: string }) {
  return (
    <div className="mb-3">
      <h2 className="font-[family-name:var(--font-libre-bodoni)] text-[19px] text-[#111111]">
        {children}
      </h2>
      {aide && <p className="text-[12px] text-[#8A8A84] mt-0.5">{aide}</p>}
    </div>
  );
}

// ───────────────────────────────────────────────────────── graphiques SVG

export function GrapheBarres({
  data,
  hauteur = 190,
  couleur = "#C9A84C",
  format,
}: {
  data: { label: string; valeur: number; couleur?: string }[];
  hauteur?: number;
  couleur?: string;
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.valeur));
  const l = 100 / Math.max(1, data.length);
  const utile = hauteur - 34;
  if (!data.some((d) => d.valeur > 0)) return <Vide texte="Pas encore de données" />;
  return (
    <div className="px-4 pb-4 pt-2">
      <svg viewBox={`0 0 100 ${hauteur}`} className="w-full" style={{ height: hauteur }}
           preserveAspectRatio="none" role="img">
        {data.map((d, i) => {
          const h = (d.valeur / max) * utile;
          return (
            <g key={d.label}>
              <rect
                x={i * l + l * 0.18}
                y={utile - h + 12}
                width={l * 0.64}
                height={Math.max(h, d.valeur > 0 ? 1.5 : 0)}
                fill={d.couleur ?? couleur}
                rx="0.6"
              />
            </g>
          );
        })}
      </svg>
      <div className="flex mt-1">
        {data.map((d) => (
          <div key={d.label} style={{ width: `${l}%` }} className="text-center">
            <p className="text-[11px] font-semibold text-[#111111] tabular-nums leading-none">
              {format ? format(d.valeur) : d.valeur}
            </p>
            <p className="text-[9px] text-[#8A8A84] leading-tight mt-0.5 break-words">
              {d.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GrapheLignes({
  labels,
  series,
  format,
}: {
  labels: string[];
  series: { nom: string; couleur: string; points: number[] }[];
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...series.flatMap((s) => s.points));
  const n = Math.max(2, labels.length);
  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => 100 - (v / max) * 90 - 5;
  if (!series.some((s) => s.points.some((p) => p > 0)))
    return <Vide texte="Pas encore de données" />;
  return (
    <div className="px-4 pb-4 pt-3">
      <div className="flex gap-4 mb-2">
        {series.map((s) => (
          <span key={s.nom} className="flex items-center gap-1.5 text-[11px] text-[#6B6B6B]">
            <span className="w-3 h-[2px] inline-block" style={{ backgroundColor: s.couleur }} />
            {s.nom}
          </span>
        ))}
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-[180px]" preserveAspectRatio="none" role="img">
        {[0, 25, 50, 75, 100].map((p) => (
          <line key={p} x1="0" x2="100" y1={y((max * p) / 100)} y2={y((max * p) / 100)}
                stroke="#EDEDE7" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
        ))}
        {series.map((s) => (
          <polyline
            key={s.nom}
            fill="none"
            stroke={s.couleur}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            points={s.points.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
          />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {labels.map((l, i) => (
          <span key={l} className="text-[9px] text-[#8A8A84]" style={{ flex: 1, textAlign: "center" }}>
            {i % 2 === 0 ? l : ""}
          </span>
        ))}
      </div>
      <p className="text-[10px] text-[#9A9A94] mt-2">
        Maximum du graphique : {format ? format(max) : max}
      </p>
    </div>
  );
}

export function GrapheAnneau({
  data,
}: {
  data: { label: string; valeur: number; couleur: string }[];
}) {
  const total = data.reduce((t, d) => t + d.valeur, 0);
  if (!total) return <Vide texte="Pas encore de données" />;
  const r = 15.9155;
  let offset = 0;
  return (
    <div className="px-4 pb-4 pt-3 flex flex-col sm:flex-row items-center gap-5">
      <svg viewBox="0 0 42 42" className="w-[132px] h-[132px] shrink-0" role="img">
        <circle cx="21" cy="21" r={r} fill="transparent" stroke="#F0F0EA" strokeWidth="6" />
        {data.map((d) => {
          const part = (d.valeur / total) * 100;
          const el = (
            <circle
              key={d.label}
              cx="21"
              cy="21"
              r={r}
              fill="transparent"
              stroke={d.couleur}
              strokeWidth="6"
              strokeDasharray={`${part} ${100 - part}`}
              strokeDashoffset={`${25 - offset}`}
            />
          );
          offset += part;
          return el;
        })}
      </svg>
      <ul className="flex-1 w-full space-y-1.5">
        {data
          .filter((d) => d.valeur > 0)
          .sort((a, b) => b.valeur - a.valeur)
          .map((d) => (
            <li key={d.label} className="flex items-center gap-2 text-[12px]">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: d.couleur }} />
              <span className="flex-1 text-[#4A4A4A] truncate">{d.label}</span>
              <span className="font-semibold text-[#111111] tabular-nums">{d.valeur}</span>
              <span className="text-[#9A9A94] tabular-nums w-11 text-right">
                {Math.round((d.valeur / total) * 100)} %
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export const PALETTE = [
  "#C9A84C", "#1F4E79", "#1E7A45", "#B3261E", "#8B6914",
  "#6B6B6B", "#9A5B00", "#4A6FA5",
];
