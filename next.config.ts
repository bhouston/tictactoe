import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable image optimization in production to reduce container size
  // Use an external image optimization service in production if needed
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;