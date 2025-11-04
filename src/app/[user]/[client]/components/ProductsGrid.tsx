'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/app/types";
import { ensureHttpImageUrl } from "@/app/utils/image";

type ProductsGridProps = {
  products: Product[];
  user: string;
  client: string;
  searchQuery?: string;
};

export default function ProductsGrid({ products, user, client, searchQuery = "" }: ProductsGridProps) {
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.descricao.toLowerCase().includes(query) ||
      product.produto.toLowerCase().includes(query) ||
      product.material.toLowerCase().includes(query) ||
      product.categoria.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-light text-black mb-2">
          {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto encontrado'}
        </h3>
        <p className="text-gray-500 font-light">
          {searchQuery ? `Nenhum resultado para "${searchQuery}"` : 'Não há produtos disponíveis no momento.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid bg-[#fdfdfd] rounded-t-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {filteredProducts.map((product) => {
        const firstVariation = product.variacoes[0];
        const firstImage = ensureHttpImageUrl(firstVariation?.imagem?.[0]);
        const price = firstVariation?.valor || 0;
        const isAvailable = product.disponivel;
        
        return (
          <Link
            key={product.produto}
            href={`/${user}/${client}/produto/${product.produto}`}
            className={`group bg-white rounded-lg overflow-hidden border border-[#d5d5d5] hover:border-[#B28A24]/50 transition-all duration-300 block ${
              !isAvailable ? 'opacity-40' : ''
            }`}
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <Image
                src={firstImage}
                alt={product.descricao}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
              
              {/* Mais vendido badge */}
              {firstVariation?.mais_vendido === 'S' && isAvailable && (
                <div className="absolute top-3 right-3">
                  <div className="bg-[#B28A24] text-white px-3 py-1 rounded-full text-xs font-light tracking-wide">
                    DESTAQUE
                  </div>
                </div>
              )}

              {/* Código do produto */}
              <div className="absolute bottom-3 left-3">
                <span className="text-xs font-light text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                  {product.produto}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5 text-center border-t border-[#d5d5d5]">
              {/* Descrição */}
              <h3 className="text-base font-normal text-black line-clamp-2 mb-3 min-h-10 leading-relaxed">
                {product.descricao}
              </h3>

              {/* Material */}
              <div className="mb-3 bg-[#FFF3D3] max-w-fit mx-auto px-3 rounded-full">
                <span className="text-xs font-light tracking-wider text-[#694A00] uppercase">
                  {product.material.replace(/^\d+\s*-\s*/, '')}
                </span>
              </div>

              {/* Preço */}
              <div className="mb-2">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-sm font-light text-gray-400 line-through">
                    R$ {(price * 1.2).toFixed(2).replace('.', ',')}
                  </p>
                  <p className="text-xl font-light text-[#A7801E]">
                    R$ {price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* Status de disponibilidade */}
              {!isAvailable && (
                <div className="mt-3 pt-3 border-t border-[#d5d5d5]">
                  <span className="text-xs text-gray-400 font-light">
                    Indisponível
                  </span>
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

