import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'portalvps250.indepinfo.com.br',
        port: '28578',
        pathname: '/imagens/produtos/**',
      },
    ],
  },
};

export default nextConfig;
