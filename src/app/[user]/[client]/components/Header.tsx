'use client';

import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import type { User } from "@/app/types";
import { useCart } from "../context/CartContext";
import CartSidebar from "./CartSidebar";
import Image from "next/image";

type HeaderProps = {
  userData: User | null;
  client: string;
  onSearch?: (query: string) => void;
};

export default function Header({ userData, client, onSearch }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems } = useCart();

  return (
    <>
      <header className="bg-black text-white sticky top-0 z-10 border-b border-[#B28A24]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-between sm:justify-start">
              <div>
                <h1 className="text-base sm:text-xl font-light tracking-wider text-white flex items-center gap-2">
                  <Image src="/verification.svg" alt="Verificação" width={20} height={20} className="sm:w-[26px] sm:h-[26px]" />
                  <span className="truncate max-w-[180px] sm:max-w-none">
                    {userData?.nome_fantasia || userData?.nome || 'SORELLY'}
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-light truncate max-w-[180px] sm:max-w-none">
                  Cliente: {client}
                </p>
              </div>
              
              {/* Botão do carrinho visível apenas no mobile */}
              <button 
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative bg-[#262626] p-2 cursor-pointer hover:bg-white/10 rounded-lg transition-colors sm:hidden"
                aria-label="Carrinho de compras"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#A7801E] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Campo de Busca */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  placeholder="Buscar produtos..."
                  className="bg-[#262626] text-white placeholder-[#939393] pl-9 sm:pl-10 pr-4 py-2 min-h-10 rounded-lg text-sm focus:outline-none w-full sm:w-64"
                />
              </div>
              
              {/* Botão do carrinho visível apenas no desktop */}
              <button 
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="hidden sm:block relative bg-[#262626] p-2 cursor-pointer hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Carrinho de compras"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#A7801E] text-white text-sm font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

