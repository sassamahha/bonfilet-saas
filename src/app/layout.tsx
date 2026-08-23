// src/app/layout.tsx — Root layout
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { inter, notoSansJp, notoSerifJp } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Bonfilet — Custom team bands, shipped worldwide",
  description: "Design your own Bonfilet with text and colors. Duties prepaid, delivered by FedEx.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={[inter.variable, notoSansJp.variable, notoSerifJp.variable].join(" ")}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
