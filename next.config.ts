import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**", // Tüm resim yollarına izin ver
      },
    ],
  },
};

export default nextConfig;
