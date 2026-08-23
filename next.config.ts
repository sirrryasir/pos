import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['cosmetics-lil-owners-statutes.trycloudflare.com', 'enactable-unstoried-lizbeth.ngrok-free.app'],
  experimental: {
    serverActions: {
      allowedOrigins: ['cosmetics-lil-owners-statutes.trycloudflare.com', 'enactable-unstoried-lizbeth.ngrok-free.app']
    }
  }
};

export default nextConfig;
