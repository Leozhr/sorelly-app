import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('URL da imagem não fornecida', { status: 400 });
    }

    // Decodificar a URL
    const decodedUrl = decodeURIComponent(imageUrl);

    // Validar que a URL é do domínio permitido
    if (!decodedUrl.startsWith('http://portalvps250.indepinfo.com.br:28578/imagens/produtos/')) {
      return new NextResponse('Domínio não autorizado', { status: 403 });
    }

    // Fazer fetch da imagem
    const imageResponse = await fetch(decodedUrl, {
      cache: 'force-cache',
    });

    if (!imageResponse.ok) {
      return new NextResponse('Erro ao buscar imagem', { status: imageResponse.status });
    }

    // Obter o tipo de conteúdo e os bytes da imagem
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await imageResponse.arrayBuffer();

    // Retornar a imagem com headers apropriados
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Erro no proxy de imagem:', error);
    return new NextResponse('Erro ao processar imagem', { status: 500 });
  }
}

