import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Panier",
  robots: { index: false, follow: false },
};

export default function PanierLayout({ children }: { children: React.ReactNode }) {
  return children;
}
