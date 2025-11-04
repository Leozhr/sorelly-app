/**
 * Garante que a URL da imagem use HTTP ao invés de HTTPS
 * pois o servidor de imagens não suporta SSL
 */
export function ensureHttpImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.jpg';
  
  // Remove espaços em branco
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) return '/placeholder.jpg';
  
  // Se a URL já começa com https:// para o servidor de imagens, substitui por http://
  if (trimmedUrl.startsWith('https://portalvps250.indepinfo.com.br')) {
    return trimmedUrl.replace('https://', 'http://');
  }
  
  // Se a URL é relativa ou já está correta, retorna como está
  return trimmedUrl;
}

