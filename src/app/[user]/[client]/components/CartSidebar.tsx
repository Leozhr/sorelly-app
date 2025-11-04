'use client';

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart } from "../context/CartContext";

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, getTotal, getTotalItems, clearCart } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-[#B28A24]/20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#A7801E]" />
              <h2 className="text-lg font-light">Carrinho</h2>
              <span className="bg-[#B28A24] text-white text-xs font-medium px-2 py-1 rounded-full">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-normal text-gray-900 mb-2">
                  Carrinho vazio
                </h3>
                <p className="text-sm text-gray-500 font-light">
                  Adicione produtos para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.produto}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-[#d5d5d5]"
                  >
                    {/* Imagem */}
                    <div className="relative w-20 h-20 shrink-0 bg-white rounded-lg overflow-hidden border border-[#d5d5d5]">
                      <Image
                        src={item.imagem}
                        alt={item.descricao}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-normal text-black line-clamp-2 mb-1">
                        {item.descricao}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Cód: {item.produto}
                      </p>
                      <p className="text-base font-normal text-[#A7801E]">
                        R$ {item.valor.toFixed(2).replace('.', ',')}
                      </p>

                      {/* Controles */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center border h-9 border-[#d5d5d5] rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.produto, item.quantidade - 1)}
                            className="p-2 hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm text-gray-600 font-medium">{item.quantidade}</span>
                          <button
                            onClick={() => updateQuantity(item.produto, item.quantidade + 1)}
                            className="p-2 hover:bg-gray-100 text-gray-500 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.produto)}
                          className="p-2 text-red-500 bg-red-100 h-9 w-9 flex items-center justify-center cursor-pointer rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Limpar carrinho */}
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="w-full cursor-pointer py-2 text-sm underline text-red-500 hover:text-red-700 font-light transition-colors"
                  >
                    Limpar carrinho
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer - Total e Finalizar */}
          {cart.length > 0 && (
            <div className="border-t border-[#d5d5d5] p-6 bg-white">
              <div className="space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-light">Subtotal</span>
                  <span className="text-2xl font-light text-[#1EA777]">
                    R$ {getTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Botão Finalizar */}
                <button
                  className="w-full cursor-pointer bg-black text-white py-4 rounded-lg font-light text-base hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    alert('Funcionalidade de finalização em desenvolvimento!');
                  }}
                >
                  Finalizar Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

