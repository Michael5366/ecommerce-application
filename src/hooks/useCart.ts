import { useState, useEffect, useCallback } from 'react';
import {
  getActiveCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  isProductInCart,
  getLineItemId,
} from '../services/Cart/cartAPI';
import { Cart } from '../services/Cart/cartAPI.types';

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
      console.debug('Error fetching cart:', error);
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
      console.debug('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(
    async (productId: string) => {
      try {
        setIsLoading(true);
        if (!cart) throw new Error('Cart not found');

        const lineItemId = getLineItemId(cart, productId);
        if (!lineItemId) throw new Error('Product not in cart');

        const updatedCart = await apiRemoveFromCart(lineItemId);
        setCart(updatedCart);
        const items = updatedCart.lineItems.map((item) => item.productId);
        setCartItems(items);
        return updatedCart;
      } catch (error) {
        console.debug('Error removing from cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const productInCart = useCallback(
    (productId?: string) => {
      if (!productId) return false;
      return isProductInCart(cart, productId);
    },
    [cart]
  );

  return {
    cart,
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    productInCart,
    refreshCart: fetchCart,
  };
};
