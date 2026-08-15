import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @atlas/types is shipped as raw TypeScript; let Next transpile it.
  transpilePackages: ["@atlas/types"],
};

export default nextConfig;
