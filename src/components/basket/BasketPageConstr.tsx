import { useEffect, useState } from 'react';
import { getOrUpdateCustomerCart } from '../../services/Basket/updateBasket';
import { ProductCardBusket } from './createCard';
import { useTranslation } from 'react-i18next';
import { getAnonymousToken } from '../../services/auth-registration';

export interface CartResponse {
  type: string;
  id: string;
  version: number;
  lineItems: Array<{
    id: string;
    name: { en: string; ru: string };
    productSlug: { en: string; ru: string };
    variant: {
      id: number;
      images?: Array<{ url: string }>;
      sku: string;
    };
    price: {
      value: {
        centAmount: number;
        currencyCode: string;
      };
    };
    quantity: number;
    totalPrice: {
      centAmount: number;
    };
  }>;
  totalPrice: {
    centAmount: number;
    currencyCode: string;
  };
}

export function BasketCompClient() {
  const { t } = useTranslation();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function initialize() {
    try {
      // Получаем токен, если пользователь не авторизован
      if (!sessionStorage.getItem('auth_token')) {
        await getAnonymousToken();
      }
      const cartData = await getOrUpdateCustomerCart();
      setCart(cartData);
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      setError(t('Failed to load cart'));
    } finally {
      setLoading(false);
    }
  }

  initialize();
}, []);

  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getOrUpdateCustomerCart();
        setCart(cartData);
      } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
        setError(t('Failed to load cart'));
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    try {
      if (!cart) return;
      
      const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
      const apiUrl = import.meta.env.VITE_CTP_API_URL;
      const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
      const isAnonymous = !sessionStorage.getItem('auth_token');
      const endpoint = isAnonymous ? 'carts' : 'me/carts';
      
      const response = await fetch(
        `${apiUrl}/${projectKey}/${endpoint}/${cart.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: cart.version,
            actions: [
              {
                action: 'removeLineItem',
                lineItemId: itemId,
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setError(t('Failed to remove item'));
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      if (!cart) return;

      const lineItem = cart.lineItems.find(item => item.id === itemId);
      if (!lineItem) return;

      if (newQuantity <= 0) {
        handleRemoveItem(itemId);
        return;
      }

      const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
      const apiUrl = import.meta.env.VITE_CTP_API_URL;
      const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
      const isAnonymous = !sessionStorage.getItem('auth_token');
      const endpoint = isAnonymous ? 'carts' : 'me/carts';
      
      const response = await fetch(
        `${apiUrl}/${projectKey}/${endpoint}/${cart.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: cart.version,
            actions: [
              {
                action: 'changeLineItemQuantity',
                lineItemId: itemId,
                quantity: newQuantity,
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(t('Failed to update quantity'));
    }
  };

  if (loading) return <div>{t('Loading cart...')}</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cart) return <div>{t('Cart not found')}</div>;

  return (
    <div className="basket-container">
      <h2>{t('Your cart')}</h2>
      
      {cart.lineItems && cart.lineItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.lineItems.map((item) => (
              <ProductCardBusket
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>
              {t('Total')}: ${(cart.totalPrice.centAmount / 100).toFixed(2)}
            </h3>
            <button className="checkout-button">
              {t('Proceed to Checkout')}
            </button>
          </div>
        </>
      ) : (
        <div className="empty-cart-message">
          <p>{t('Your cart is empty')}</p>
        </div>
      )}
    </div>
  );
}