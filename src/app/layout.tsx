// src/app/layout.tsx — Root layout
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { inter, notoSansJp, notoSerifJp, kosugiMaru, zenMaruGothic, mPlus1p } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Bonfilet — Custom team bands, shipped worldwide",
  description: "Reversible fabric bands for teams, clubs and events. Design with text and colors; thin enough to ship flat at a flat rate.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={[inter.variable, notoSansJp.variable, notoSerifJp.variable, kosugiMaru.variable, zenMaruGothic.variable, mPlus1p.variable].join(" ")}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
