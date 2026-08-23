// src/app/layout.tsx — Root layout
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { inter, notoSansJp, notoSerifJp } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Bonfilet — Bands for your fans, thin enough to mail",
  description: "Reversible fabric bands teams and creators hand out to fans. Design with text and colors; ships flat at a flat rate.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={[inter.variable, notoSansJp.variable, notoSerifJp.variable].join(" ")}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
