import Image from "next/image";

const categoryImages: Record<string, string> = {
  "Parfums Homme en Algérie":
    "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1400&q=80",
  "Parfums Femme en Algérie":
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=80",
  "Parfums Orientaux en Algérie":
    "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=1400&q=80",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1400&q=80";

interface CategoryHeroProps {
  title: string;
  description: string;
  count?: number;
  brand?: string;
}

export default function CategoryHero({ title, description, count, brand }: CategoryHeroProps) {
  const imageUrl = categoryImages[title] ?? fallbackImage;

  return (
    <div className="relative min-h-[280px] sm:min-h-[340px] flex items-end overflow-hidden">
      {/* Background image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-10 pt-20 w-full">
        {brand && (
          <p className="text-xs font-medium tracking-[1.5px] text-[#C9A84C] uppercase mb-3">
            {brand}
          </p>
        )}
        <h1
          className="text-3xl sm:text-4xl text-white mb-3 max-w-2xl"
          style={{ fontFamily: "var(--font-libre-bodoni), Georgia, serif", fontWeight: 400 }}
        >
          {title}
        </h1>
        <p className="text-white/60 max-w-xl leading-relaxed text-sm sm:text-base">
          {description}
        </p>
        {count !== undefined && (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/50">
            <span className="font-medium text-white">{count}</span>
            parfum{count > 1 ? "s" : ""} disponibles
          </div>
        )}
      </div>
    </div>
  );
}
