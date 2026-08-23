import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// next dev でも D1/R2 のローカルバインディングを使えるようにする
initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
};

export default nextConfig;
