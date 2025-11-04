'use client';

import { useState, useEffect } from "react";
import type { Product, User } from "@/app/types";
import Header from "./Header";
import ProductsGrid from "./ProductsGrid";
import { useCart } from "../context/CartContext";

type PageClientProps = {
  products: Product[];
  userData: User;
  user: string;
  client: string;
};

export default function PageClient({ products, userData, user, client }: PageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { setUserAndClient } = useCart();

  useEffect(() => {
    setUserAndClient(user, client, userData?.email);
  }, [user, client, userData?.email, setUserAndClient]);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        userData={userData} 
        client={client}
        user={user}
        onSearch={setSearchQuery}
      />

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductsGrid 
          products={products}
          user={user}
          client={client}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
}

