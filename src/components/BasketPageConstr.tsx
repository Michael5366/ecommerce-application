import { useEffect, useState } from 'react';
import { getOrUpdateCustomerCart } from '../services/Basket/updateBasket';

export function BasketCompClient() {
  const [cart, setCart] = useState<any | null>(null);
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
      <ul>
        {cart.lineItems.map((item) => (
          <li key={item.id}>
            {item.name.en} — {item.quantity} шт.
          </li>
        ))}
      </ul>
    </div>
  );
}
