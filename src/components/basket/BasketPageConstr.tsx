import { useEffect, useState } from 'react';
import { getOrUpdateCustomerCart } from '../../services/Basket/updateBasket';
import { ProductCardBusket } from './createCard';
import { useTranslation } from 'react-i18next';
import { getAnonymousToken } from '../../services/auth-registration';
import styles from './cardsStiles.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { addTestItemsToAnonCart } from '../../services/Basket/testAnonAddProduct';

type CartAction =
  | { action: 'removeDiscountCode'; discountCode: { typeId: 'discount-code'; id: string } }
  | { action: string; lineItemId: string };

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
  discountCodes?: Array<{
    discountCode: {
      typeId: string;
      id: string;
      obj?: {
        code: string;
      };
    };
    state: string;
  }>;
  discountOnTotalPrice?: {
    discountedAmount: {
      centAmount: number;
      currencyCode: string;
    };
  };
}

export function BasketCompClient() {
  const { t } = useTranslation();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
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
        addTestItemsToAnonCart();
      }
    }

    initialize();
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    try {
      if (!cart) return;

      const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
      const apiUrl = import.meta.env.VITE_CTP_API_URL;
      const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
      const isAnonymous = !sessionStorage.getItem('auth_token');
      const endpoint = isAnonymous ? 'carts' : 'me/carts';

      const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}/${cart.id}`, {
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
      });

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

      const lineItem = cart.lineItems.find((item) => item.id === itemId);
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

      const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}/${cart.id}`, {
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
      });

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

  const handleApplyPromoCode = async () => {
    try {
      if (!cart || !promoCode.trim()) return;

      setPromoError(null);
      setPromoSuccess(null);

      const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
      const apiUrl = import.meta.env.VITE_CTP_API_URL;
      const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
      const isAnonymous = !sessionStorage.getItem('auth_token');
      const endpoint = isAnonymous ? 'carts' : 'me/carts';

      const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}/${cart.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: cart.version,
          actions: [
            {
              action: 'addDiscountCode',
              code: promoCode,
            },
          ],
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
        setPromoSuccess(t('Promo code applied successfully'));
        setPromoCode('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply promo code');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setPromoError(t('Invalid or expired promo code'));
    }
  };

  const handleRemovePromoCode = async (discountCodeId: string) => {
    try {
      if (!cart) return;

      const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
      const apiUrl = import.meta.env.VITE_CTP_API_URL;
      const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
      const isAnonymous = !sessionStorage.getItem('auth_token');
      const endpoint = isAnonymous ? 'carts' : 'me/carts';

      const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}/${cart.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: cart.version,
          actions: [
            {
              action: 'removeDiscountCode',
              discountCode: {
                typeId: 'discount-code',
                id: discountCodeId,
              },
            },
          ],
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
        setPromoSuccess(t('Promo code removed successfully'));
      } else {
        throw new Error('Failed to remove promo code');
      }
    } catch (error) {
      console.error('Error removing promo code:', error);
      setPromoError(t('Failed to remove promo code'));
    }
  };

  const handleClearCart = async () => {
    try {
      if (!cart || cart.lineItems.length === 0) return;

      const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
      const apiUrl = import.meta.env.VITE_CTP_API_URL;
      const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
      const isAnonymous = !sessionStorage.getItem('auth_token');
      const endpoint = isAnonymous ? 'carts' : 'me/carts';

      // Create actions to remove all line items
      const actions: CartAction[] = cart.lineItems.map((item) => ({
        action: 'removeLineItem',
        lineItemId: item.id,
      }));

      // If there are discount codes, remove them as well
      if (cart.discountCodes && cart.discountCodes.length > 0) {
        cart.discountCodes.forEach((discountCode) => {
          actions.push({
            action: 'removeDiscountCode',
            discountCode: {
              typeId: 'discount-code',
              id: discountCode.discountCode.id,
            },
          });
        });
      }

      const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}/${cart.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: cart.version,
          actions,
        }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(t('Failed to clear cart'));
    }
  };

  if (loading) return <div>{t('Loading cart...')}</div>;
  if (error) return <div className="error">{error}</div>;
  if (!cart) return <div>{t('Cart not found')}</div>;

  interface DiscountCode {
    obj?: {
      code: string;
    };
    discountCode: {
      id: string;
    };
  }

  const getPromoCodeDisplay = (discountCode: DiscountCode): string => {
    return discountCode.obj?.code || discountCode.discountCode.id;
  };

  return (
    <div className="basket-container">
      <h2>{t('Your cart')}</h2>

      <div className={styles.promoCodeSection}>
        <div className={styles.promoCodeInput}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder={t('Enter promo code')}
            className={styles.promoInput}
          />
          <button
            onClick={handleApplyPromoCode}
            className={styles.applyPromoButton}
            disabled={!promoCode.trim()}
          >
            {t('Apply')}
          </button>
        </div>
        {promoError && <div className={styles.promoError}>{promoError}</div>}
        {promoSuccess && <div className={styles.promoSuccess}>{promoSuccess}</div>}

        {/* Display applied promo codes */}

        {cart.discountCodes && cart.discountCodes.length > 0 && (
          <div className={styles.appliedPromoCodes}>
            <h4>{t('Applied Promo Codes')}:</h4>
            <ul>
              {cart.discountCodes.map((discountCode) => (
                <li key={discountCode.discountCode.id} className={styles.appliedPromoItem}>
                  <div>Number of promocode {getPromoCodeDisplay(discountCode)}</div>
                  <button
                    onClick={() => handleRemovePromoCode(discountCode.discountCode.id)}
                    className={styles.removePromoButton}
                    title={t('Remove promo code')}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {cart.lineItems && cart.lineItems.length > 0 && (
        <button onClick={handleClearCart} className={styles.clearCartButton}>
          {t('Clear Cart')}
        </button>
      )}
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
            {cart.discountOnTotalPrice && (
              <>
                <div className={styles.discountAmount}>
                  Price without promocode: $
                  {(
                    (cart.totalPrice.centAmount +
                      cart.discountOnTotalPrice.discountedAmount.centAmount) /
                    100
                  ).toFixed(2)}
                </div>
                <div className={styles.discountAmount}>
                  Your discount from promocode: -$
                  {(cart.discountOnTotalPrice.discountedAmount.centAmount / 100).toFixed(2)}
                </div>
              </>
            )}
            <button className="checkout-button">{t('Proceed to Checkout')}</button>
          </div>
        </>
      ) : (
        <div className={styles.stylesEmptyCartMessage}>
          <p>{t('Your cart is empty')}</p>
          <Link to="/catalog" className={styles.link}>
           {t('Go to the catalog page!')}
          </Link>
        </div>
      )}
    </div>
  );
}
