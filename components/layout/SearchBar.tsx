"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/products";

interface SearchResult {
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: "parfums-homme" | "parfums-femme" | "parfums-orientaux";
}

export default function SearchBar({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setTouched(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data: { results: SearchResult[] }) => {
          setResults(data.results ?? []);
          setLoading(false);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setLoading(false);
        });
    }, 180);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setTouched(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Rechercher un parfum"
        className={`flex items-center justify-center p-2 text-[#535359] hover:opacity-70 transition-opacity ${className}`}
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-200 ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={close}
        />

        <div className="relative bg-white w-full max-h-[92vh] overflow-y-auto shadow-xl">
          <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-6 lg:py-10">
            <div className="flex items-center gap-4 border-b border-[#e5e5e5] pb-4">
              <Search size={20} strokeWidth={1.5} className="text-[#535359] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un parfum, une marque…"
                className="flex-1 bg-transparent text-base lg:text-lg text-[#111] placeholder:text-[#9a9a9a] focus:outline-none"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Fermer la recherche"
                className="p-1 text-[#535359] hover:text-[#111] transition-colors"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6">
              {query.trim().length < 2 && !touched && (
                <div className="py-10 text-center">
                  <p className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-4">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { label: "Dior Sauvage", href: "/parfums/dior-sauvage" },
                      { label: "Chanel N°5", href: "/parfums-femme/chanel" },
                      { label: "Lattafa", href: "/parfums-orientaux/lattafa" },
                      { label: "Bleu de Chanel", href: "/parfums-homme/chanel" },
                      { label: "Parfums orientaux", href: "/parfums-orientaux" },
                    ].map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={close}
                        className="text-xs tracking-wide text-[#535359] border border-[#e5e5e5] px-4 py-2 hover:border-[#AC9270] hover:text-[#AC9270] transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {query.trim().length >= 2 && loading && results.length === 0 && (
                <div className="py-10 text-center text-sm text-[#9a9a9a]">
                  Recherche en cours…
                </div>
              )}

              {query.trim().length >= 2 && !loading && results.length === 0 && (
                <div className="py-10 text-center">
                  <p className="text-sm text-[#535359] mb-1">
                    Aucun résultat pour «&nbsp;{query.trim()}&nbsp;»
                  </p>
                  <p className="text-xs text-[#9a9a9a]">
                    Essayez un nom de parfum ou une marque
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <>
                  <p className="text-xs uppercase tracking-wider text-[#9a9a9a] mb-3">
                    {results.length} résultat{results.length > 1 ? "s" : ""}
                  </p>
                  <ul className="divide-y divide-[#f0f0f0] border-t border-[#f0f0f0]">
                    {results.map((r) => (
                      <li key={r.slug}>
                        <Link
                          href={`/parfums/${r.slug}`}
                          onClick={close}
                          className="flex items-center gap-4 py-3 hover:bg-[#faf8f5] transition-colors -mx-2 px-2"
                        >
                          <div className="relative w-14 h-14 shrink-0 bg-white border border-[#f0f0f0]">
                            <Image
                              src={r.image}
                              alt={r.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] uppercase tracking-wider text-[#9a9a9a]">
                              {r.brand}
                            </p>
                            <p className="text-sm text-[#111] truncate">
                              {r.name}
                            </p>
                          </div>
                          <div className="shrink-0 text-sm font-medium text-[#111]">
                            {formatPrice(r.price)}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
