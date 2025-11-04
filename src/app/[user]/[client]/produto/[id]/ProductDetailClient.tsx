'use client';

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Share2, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import type { Product } from "@/app/types";
import { useCart } from "../../context/CartContext";

type ProductDetailClientProps = {
  product: Product;
  user: string;
  client: string;
};

export default function ProductDetailClient({ product, user, client }: ProductDetailClientProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const price = product.variacoes[0]?.valor || 0;
  const originalPrice = price * 1.2;
  const images = product.variacoes[0]?.imagem || [];

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      produto: product.produto,
      descricao: product.descricao,
      valor: price,
      imagem: images[0] || '',
      material: product.material,
    }, quantity);

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 pb-20 pt-12 md:pb-0 md:pt-24">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4 max-w-md mx-auto w-full">
            {/* Imagem Principal */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-[#d5d5d5]">
              <Image
                src={images[selectedImage] || images[0]}
                alt={product.descricao}
                fill
                className="object-contain p-8"
                unoptimized
              />
              
              {/* Badge de código */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-sm font-light">{product.produto}</span>
              </div>

              {/* Miniatura do produto no canto inferior direito */}
              {images[0] && (
                <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={images[0]}
                    alt={product.descricao}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-[#B28A24]'
                        : 'border-[#d5d5d5] hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.descricao} - ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            {/* Botão Voltar */}
            <button
              onClick={() => router.back()}
              className="inline-flex cursor-pointer bg-gray-100 items-center rounded-md py-2 px-3 gap-1.5 text-base text-gray-600 hover:text-black transition-colors font-light group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Voltar
            </button>

            {/* Título e Ações */}
            <div>
              <h1 className="text-2xl font-normal text-black mb-2">
                Colar {product.produto}
              </h1>
              <div className="inline-block bg-[#FFF3D3] px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-[#694A00] uppercase">
                  {product.material.replace(/^\d+\s*-\s*/, '')}
                </span>
              </div>
            </div>

            {/* Descrição completa */}
            <p className="text-base text-gray-600 leading-relaxed">
              {product.descricao}
            </p>

            {/* Controle de Quantidade e Ações */}
            <div className="flex items-center gap-4">
              {/* Contador */}
              <div className="flex items-center border border-[#d5d5d5] rounded-lg">
                <button
                  type="button"
                  onClick={() => handleQuantityChange('decrease')}
                  className="p-3 hover:bg-gray-50 cursor-pointer text-gray-400 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 text-gray-600 font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange('increase')}
                  className="p-3 hover:bg-gray-50 cursor-pointer text-gray-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preço */}
            <div className="py-6 pb-5 bg-gray-100 border border-[#d5d5d5] rounded-lg">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-lg text-gray-400 line-through font-light">
                  R$ {originalPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-4xl font-light text-[#A7801E]">
                  R$ {price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Botão Adicionar ao Carrinho */}
            <button 
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-4 cursor-pointer rounded-lg text-base flex items-center justify-center gap-2 transition-all ${
                isAdded 
                  ? 'bg-green-600 text-white' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  Adicionado ao carrinho!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar no carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

