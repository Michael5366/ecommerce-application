import { useState, useEffect, useCallback } from 'react';
import { getActiveCart, addToCart as apiAddToCart, Cart } from '../services/Cart/cartAPI';

const CART_ITEMS_KEY = 'cart_items';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<string[]>(() => {
    const saved = localStorage.getItem(CART_ITEMS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_ITEMS_KEY && e.newValue) {
        setCartItems(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const activeCart = await getActiveCart();
      setCart(activeCart);
      const items = activeCart?.lineItems.map((item) => item.productId) || [];
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId: string) => {
    try {
      setIsLoading(true);
      const updatedCart = await apiAddToCart(productId);
      setCart(updatedCart);
      const items = updatedCart.lineItems.map((item) => item.productId);
      setCartItems(items);
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cart,
    cartItems,
    isLoading,
    addToCart,
    refreshCart: fetchCart,
  };
};
