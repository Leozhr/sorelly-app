import { CartProvider } from "./context/CartContext";

export default function UserClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}

