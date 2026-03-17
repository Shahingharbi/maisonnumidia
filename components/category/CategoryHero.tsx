interface CategoryHeroProps {
  title: string;
  description: string;
  count?: number;
  brand?: string;
}

export default function CategoryHero({ title, description, count, brand }: CategoryHeroProps) {
  return (
    <div className="bg-white border-b border-gray-100 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {brand && (
          <p className="text-xs font-semibold tracking-[0.2em] text-[#C9A84C] uppercase mb-3">
            {brand}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-3 max-w-2xl">
          {title}
        </h1>
        <p className="text-gray-400 max-w-xl leading-relaxed text-sm sm:text-base">
          {description}
        </p>
        {count !== undefined && (
          <div className="mt-5 inline-flex items-center gap-2 text-sm text-gray-400">
            <span className="font-semibold text-[#111111]">{count}</span>
            parfum{count > 1 ? "s" : ""} disponibles
          </div>
        )}
      </div>
    </div>
  );
}
