'use client';

import { useState } from "react";
import type { Product, User } from "@/app/types";
import Header from "./Header";
import ProductsGrid from "./ProductsGrid";

type PageClientProps = {
  products: Product[];
  userData: User;
  user: string;
  client: string;
};

export default function PageClient({ products, userData, user, client }: PageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header 
        userData={userData} 
        client={client} 
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

