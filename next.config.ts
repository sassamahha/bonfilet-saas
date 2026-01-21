import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時にESLintエラーを無視
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
