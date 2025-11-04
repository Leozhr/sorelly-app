import { getProductsById, getUser } from "@/app/services/devmaster";
import type { Product, User } from "@/app/types";
import ProductDetailClient from "./ProductDetailClient";
import Header from "../../components/Header";

type ProductDetailProps = {
  params: Promise<{
    user: string;
    client: string;
    id: string;
  }>;
};

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { user, client, id } = await params;
  
  const product = await getProductsById(user, id) as Product;
  const userData = await getUser({ user_id: user }) as User;

  return (
    <>
      <Header userData={userData} client={client} user={user} />
      <ProductDetailClient product={product} user={user} client={client} />
    </>
  );
}

