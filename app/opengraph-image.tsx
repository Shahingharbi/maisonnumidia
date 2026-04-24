import { ImageResponse } from "next/og";

export const alt = "Maison Numidia — Parfums originaux en Algérie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0a0a0a 100%)",
          color: "white",
          fontFamily: "serif",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 80,
            fontSize: 20,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C9A84C",
          }}
        >
          Maison Numidia
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 86,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: -1,
              marginBottom: 28,
              display: "flex",
            }}
          >
            Parfum Original
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 300,
              color: "#C9A84C",
              fontStyle: "italic",
              marginBottom: 40,
              display: "flex",
            }}
          >
            en Algérie
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#b8b8b8",
              maxWidth: 820,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Dior · Chanel · Lattafa · Al Haramain — 100% authentique, livraison Yalidine 58 wilayas, paiement à la réception
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#7a7a7a",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span>maisonnumidia.store</span>
          <span>Blida · Algérie</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
