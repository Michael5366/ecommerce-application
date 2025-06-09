import { useEffect, useState } from 'react';
import { getOrUpdateCustomerCart } from '../services/Basket/updateBasket';

export interface CartResponse {
  count: number;
  limit: number;
  offset: number;
  results: Cart[];
  total: number;
}
export interface Cart {
  type: string;
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
}

export function BasketCompClient() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getOrUpdateCustomerCart();
        setCart(cartData);
      } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  if (loading) return <div>Загрузка корзины...</div>;

  if (!cart) return <div>Корзина не найдена</div>;

  return (
    <div>
      <h2>Ваша корзина</h2>
    </div>
  );
}
