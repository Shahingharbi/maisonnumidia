import Link from "next/link";

interface ThreeColumnCard {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  bgColor: string;
}

interface ThreeColumnSectionProps {
  cards: [ThreeColumnCard, ThreeColumnCard, ThreeColumnCard];
}

export default function ThreeColumnSection({ cards }: ThreeColumnSectionProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#e5e5e5]">
      {cards.map((card, i) => (
        <Link
          key={i}
          href={card.ctaHref}
          className="group flex flex-col items-center justify-center text-center transition-transform duration-300"
          style={{
            backgroundColor: card.bgColor,
            minHeight: "clamp(280px, 30vw, 420px)",
            padding: "40px 24px",
          }}
        >
          <div className="transition-transform duration-300 group-hover:scale-[1.02] flex flex-col items-center">
            <h3
              style={{
                fontFamily: "var(--font-libre-bodoni), Georgia, serif",
                fontSize: "clamp(20px, 2vw, 24px)",
                fontWeight: 400,
                color: "#535359",
                lineHeight: 1.3,
              }}
            >
              {card.title}
            </h3>
            <p
              className="mx-auto"
              style={{
                fontSize: 13,
                color: "#535359",
                margin: "10px 0 20px",
                maxWidth: 250,
                lineHeight: 1.5,
                opacity: 0.7,
              }}
            >
              {card.subtitle}
            </p>
            <span className="cta-underline group-hover:opacity-70 transition-opacity">
              {card.cta}
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
