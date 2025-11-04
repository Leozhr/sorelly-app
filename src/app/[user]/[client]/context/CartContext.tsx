'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  produto: string;
  descricao: string;
  valor: number;
  quantidade: number;
  imagem: string;
  material: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantidade'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  isLoaded: boolean;
  user: string | null;
  client: string | null;
  userEmail: string | null;
  setUserAndClient: (user: string, client: string, email?: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
  user?: string;
  client?: string;
};

export function CartProvider({ children, user: initialUser, client: initialClient }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<string | null>(initialUser || null);
  const [client, setClient] = useState<string | null>(initialClient || null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantidade'>, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.produto === item.produto);
      
      if (existingItem) {
        // Se já existe, aumenta a quantidade
        return prevCart.map(i =>
          i.produto === item.produto
            ? { ...i, quantidade: i.quantidade + quantity }
            : i
        );
      }
      
      // Se não existe, adiciona novo item
      return [...prevCart, { ...item, quantidade: quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.produto !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.produto === productId
          ? { ...item, quantidade: quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.valor * item.quantidade), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantidade, 0);
  };

  const setUserAndClient = (newUser: string, newClient: string, email?: string) => {
    setUser(newUser);
    setClient(newClient);
    if (email) {
      setUserEmail(email);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalItems,
        isLoaded,
        user,
        client,
        userEmail,
        setUserAndClient,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}

