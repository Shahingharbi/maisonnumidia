import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export const runtime = "nodejs";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = normalize(searchParams.get("q") ?? "");

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const terms = q.split(" ").filter((t) => t.length >= 2);
  if (terms.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const all = getAllProducts();

  const scored = all
    .map((p) => {
      const haystackName = normalize(p.name);
      const haystackBrand = normalize(p.brand);
      const haystackSlug = p.slug.replace(/-/g, " ");
      const haystackAll = `${haystackName} ${haystackBrand} ${haystackSlug}`;

      let score = 0;
      for (const t of terms) {
        if (haystackAll.includes(t)) score += 1;
        if (haystackName.startsWith(t)) score += 3;
        if (haystackBrand.startsWith(t)) score += 2;
        if (haystackName.includes(t)) score += 2;
      }

      const allMatch = terms.every((t) => haystackAll.includes(t));
      if (!allMatch) score = 0;

      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ p }) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      price: p.price,
      image: p.image,
      category: p.category,
    }));

  return NextResponse.json({ results: scored });
}
