import { createContext, useContext, useState } from 'react';

type CartContextType = {
  itemCount: number;
  setItemCount: (count: number) => void;
};

const CartContext = createContext<CartContextType>({
  itemCount: 0,
  setItemCount: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [itemCount, setItemCount] = useState(0);

  return (
    <CartContext.Provider value={{ itemCount, setItemCount }}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
