import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      { source: "/music", destination: "/", permanent: true },
      { source: "/music/:path*", destination: "/", permanent: true },
      { source: "/melody", destination: "/", permanent: true },
      { source: "/melody/:path*", destination: "/", permanent: true },
      { source: "/company", destination: "/empire", permanent: true },
      { source: "/company/:path*", destination: "/empire", permanent: true },
      { source: "/shop", destination: "/empire", permanent: true },
      { source: "/shop/:path*", destination: "/empire", permanent: true },
      { source: "/state", destination: "/empire", permanent: true },
      { source: "/state/:path*", destination: "/empire", permanent: true },
    ];
  },
  experimental: {
    // Persistent Turbopack cache under `.next/dev` was getting deleted mid-run
    // (EMFILE + multiple `next dev`), which restart-looped the server.
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;
