import { useEffect, useState } from 'react';
import { getOrUpdateCustomerCart } from '../../services/Basket/updateBasket';
import { ProductCardBasket } from './createCard';
import { useTranslation } from 'react-i18next';
import { getAnonymousToken } from '../../services/auth-registration';
import styles from './cardsStiles.module.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

import { useCartContext } from '../../hooks/CartContext';

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
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const { setItemCount } = useCartContext();

  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const apiUrl = import.meta.env.VITE_CTP_API_URL;
  const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
  const isAnonymous = !sessionStorage.getItem('auth_token');
  const endpoint = isAnonymous ? 'carts' : 'me/carts';

  useEffect(() => {
    async function initialize() {
      let cartData: CartResponse | null = null;
      try {
        if (!sessionStorage.getItem('auth_token')) {
          await getAnonymousToken();
        }
        cartData = await getOrUpdateCustomerCart();
        setCart(cartData);
        const totalQuantity = cartData.lineItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setItemCount(totalQuantity);
      } catch {
        setError(t('Failed to load cart'));
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    try {
      if (!cart) return;

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
        const totalQuantity = updatedCart.lineItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setItemCount(totalQuantity);
      } else {
        throw new Error('Failed to remove item');
      }
    } catch {
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
        const totalQuantity = updatedCart.lineItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setItemCount(totalQuantity);
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch {
      setError(t('Failed to update quantity'));
    }
  };

  const handleApplyPromoCode = async () => {
    try {
      if (!cart || !promoCode.trim()) return;

      setPromoError(null);
      setPromoSuccess(null);

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
        const totalQuantity = updatedCart.lineItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setItemCount(totalQuantity);
        setPromoSuccess(t('Promo code applied successfully'));
        setPromoCode('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply promo code');
      }
    } catch {
      setPromoError(t('Invalid or expired promo code'));
    }
  };

  const handleRemovePromoCode = async (discountCodeId: string) => {
    try {
      if (!cart) return;

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
        const totalQuantity = updatedCart.lineItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setItemCount(totalQuantity);
        setPromoSuccess(t('Promo code removed successfully'));
      } else {
        throw new Error('Failed to remove promo code');
      }
    } catch {
      setPromoError(t('Failed to remove promo code'));
    }
  };

  const showClearCartConfirmation = () => {
    setShowClearCartModal(true);
  };

  const confirmClearCart = async () => {
    setShowClearCartModal(false);
    await handleClearCart();
  };

  const handleClearCart = async () => {
    try {
      if (!cart || cart.lineItems.length === 0) return;

      const actions: CartAction[] = cart.lineItems.map((item) => ({
        action: 'removeLineItem',
        lineItemId: item.id,
      }));

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
        const totalQuantity = updatedCart.lineItems.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        console.log('totalQuantity:', totalQuantity);
        setItemCount(totalQuantity);
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch {
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

      {cart.lineItems && cart.lineItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.lineItems.map((item) => (
              <ProductCardBasket
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
          {cart.lineItems && cart.lineItems.length > 0 && (
            <button onClick={showClearCartConfirmation} className={styles.clearCartButton}>
              {t('Clear Cart')}
            </button>
          )}

          {showClearCartModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>{t('Clear cart')}</h3>
                <p>{t('Are you sure you want to remove all items from your cart?')}</p>
                <div className={styles.modalButtons}>
                  <button
                    onClick={() => setShowClearCartModal(false)}
                    className={styles.cancelButton}
                  >
                    {t('Cancel')}
                  </button>
                  <button onClick={confirmClearCart} className={styles.confirmButton}>
                    {t('Clear cart')}
                  </button>
                </div>
              </div>
            </div>
          )}
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
