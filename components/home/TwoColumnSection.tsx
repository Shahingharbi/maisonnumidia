import Link from "next/link";

interface TwoColumnPanel {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  bgColor: string;
}

interface TwoColumnSectionProps {
  panels: [TwoColumnPanel, TwoColumnPanel];
}

export default function TwoColumnSection({ panels }: TwoColumnSectionProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {panels.map((panel, i) => (
        <Link
          key={i}
          href={panel.ctaHref}
          className="group relative flex flex-col items-center justify-center text-center transition-colors duration-300"
          style={{
            backgroundColor: panel.bgColor,
            minHeight: "clamp(300px, 35vw, 500px)",
            padding: "40px 24px",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-libre-bodoni), Georgia, serif",
              fontSize: "clamp(22px, 2.5vw, 28px)",
              fontWeight: 400,
              color: "#535359",
              lineHeight: 1.3,
            }}
          >
            {panel.title}
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "#535359",
              margin: "12px 0 24px",
              opacity: 0.7,
              maxWidth: 320,
            }}
          >
            {panel.subtitle}
          </p>
          <span className="cta-underline group-hover:opacity-70 transition-opacity">
            {panel.cta}
          </span>
        </Link>
      ))}
    </section>
  );
}
