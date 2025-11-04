import { getProducts, getUser } from "@/app/services/devmaster";
import type { UserClientProps, Product, User } from "@/app/types";
import PageClient from "./components/PageClient";

export default async function Page({ params }: UserClientProps) {
  const { user, client } = await params;
  
  const products = await getProducts({ user_id: user }) as Product[];
  const userData = await getUser({ user_id: user }) as User;

  return (
    <PageClient 
      products={products}
      userData={userData}
      user={user}
      client={client}
    />
  );
}
