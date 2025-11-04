import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração removida pois as imagens externas agora passam pelo proxy local
  // Isso resolve problemas de mixed content (HTTP em site HTTPS)
};

export default nextConfig;
