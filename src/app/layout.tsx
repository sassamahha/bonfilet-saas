// src/app/layout.tsx
// Root layout - provides html/body for all routes
import type { ReactNode } from "react";
import "./globals.css";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Default to English, but lang will be set dynamically by [lang]/layout if needed
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
