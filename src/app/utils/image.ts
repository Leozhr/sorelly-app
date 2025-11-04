/**
 * Converte URLs de imagens externas HTTP para usar o proxy local HTTPS
 * Isso evita problemas de mixed content (HTTP em site HTTPS)
 */
export function ensureHttpImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.jpg';
  
  // Remove espaços em branco
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) return '/placeholder.jpg';
  
  // Se for uma URL do servidor de imagens, usar o proxy
  if (trimmedUrl.includes('portalvps250.indepinfo.com.br')) {
    // Remove https:// e usa http:// para garantir protocolo correto
    let imageUrl = trimmedUrl;
    if (imageUrl.startsWith('https://')) {
      imageUrl = imageUrl.replace('https://', 'http://');
    }
    
    // Retorna URL do proxy com a imagem original como parâmetro
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  }
  
  // Se for URL relativa ou de outro domínio, retorna como está
  return trimmedUrl;
}

