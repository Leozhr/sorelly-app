'use client';

import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { ensureHttpImageUrl } from "@/app/utils/image";

type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: string;
  client?: string;
  userEmail?: string;
};

export default function CartSidebar({ isOpen, onClose, user: userProp, client: clientProp, userEmail: userEmailProp }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, getTotal, getTotalItems, clearCart, user: userContext, client: clientContext, userEmail: userEmailContext } = useCart();
  
  // Priorizar props sobre contexto
  const user = userProp || userContext;
  const client = clientProp || clientContext;
  const userEmail = userEmailProp || userEmailContext;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinalizarPedido = async () => {
    if (!user || !client) {
      setError('Informações de usuário ou cliente não disponíveis');
      return;
    }

    // Buscar sessionToken do localStorage
    const sessionToken = localStorage.getItem('sessionToken');
    
    // Verificar se tem token OU email
    if (!sessionToken && !userEmail) {
      setError('Token de sessão ou email não encontrado. Faça login novamente.');
      return;
    }

    // Converter client (ID da URL) para número
    const clientId = parseInt(client, 10);
    if (isNaN(clientId)) {
      setError('ID do cliente inválido');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let clientData = null;

      // Se houver token, buscar dados completos do cliente
      if (sessionToken) {
        const clientResponse = await fetch(`/api/clients/${clientId}`, {
          headers: {
            'Authorization': `Bearer ${sessionToken}`,
          },
        });

        if (!clientResponse.ok) {
          throw new Error('Erro ao buscar dados do cliente');
        }

        const responseData = await clientResponse.json();
        clientData = responseData.client;
      }

      // Enviar cada item do carrinho para a API
      const promises = cart.map(async (item) => {
        const cartPayload: any = {
          clientId: clientId,
          product: {
            produto: item.produto,
            descricao: item.descricao,
            material: item.material,
          },
          variation: {
            valor: item.valor,
            imagem: item.imagem,
          },
          quantity: item.quantidade,
          total: item.valor * item.quantidade,
        };

        // Se temos dados completos do cliente (com token), adicionar
        if (clientData) {
          cartPayload.client = {
            id: clientData.id,
            userId: clientData.userId,
            name: clientData.name,
            phone: clientData.phone,
          };
        }

        // Se não temos token, adicionar email para autenticação alternativa
        if (!sessionToken && userEmail) {
          cartPayload.email = userEmail;
          // Adicionar devmasterUserId (ID do usuário da URL)
          cartPayload.devmasterUserId = user;
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Adicionar Authorization header apenas se houver token
        if (sessionToken) {
          headers['Authorization'] = `Bearer ${sessionToken}`;
        }

        const response = await fetch('/api/carts', {
          method: 'POST',
          headers,
          body: JSON.stringify(cartPayload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao adicionar item ao carrinho');
        }

        return response.json();
      });

      await Promise.all(promises);

      // Limpar carrinho local após sucesso
      clearCart();
      alert('Pedido finalizado com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      setError(err instanceof Error ? err.message : 'Erro ao finalizar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                        src={ensureHttpImageUrl(item.imagem)}
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
                {/* Mensagem de Erro */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-light">Subtotal</span>
                  <span className="text-2xl font-light text-[#1EA777]">
                    R$ {getTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Botão Finalizar */}
                <button
                  className="w-full cursor-pointer bg-black text-white py-4 rounded-lg font-light text-base hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleFinalizarPedido}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Finalizar Pedido'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

