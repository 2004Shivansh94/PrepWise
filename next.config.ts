import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In Next.js 15, serverExternalPackages is recommended for native Node modules,
  // but let's configure webpack to ignore pdf-parse test directory parsing that causes ENOENT
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  serverExternalPackages: ["pdf-parse"],
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "ik.imagekit.io",
  //       port: "",
  //     },
  //   ],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
