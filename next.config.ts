import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   serverComponentsExternalPackages: ["typeorm"],
  // },
  serverExternalPackages: ["typeorm"],
};

export default nextConfig;
