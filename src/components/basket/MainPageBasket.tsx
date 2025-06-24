import { useEffect } from 'react';
import { CartResponse } from './BasketPageConstr';
import { getAnonymousToken } from '../../services/auth-registration';
import { getOrUpdateCustomerCart } from '../../services/Basket/updateBasket';
import styles from './MainPageBasket.module.css';
import handleError from '../../utils/errorHandler';

export function CreateCardEnter() {
  useEffect(() => {
    async function initialize() {
      let cartData: CartResponse | null = null;
      try {
        if (!sessionStorage.getItem('auth_token')) {
          await getAnonymousToken();
        }
        cartData = await getOrUpdateCustomerCart();
      } catch (error) {
        handleError('Error loading cart: ', error);
      } finally {
        if (cartData) {
        }
      }
    }

    initialize();
  }, []);
  return (
    <div className={styles.blockPromo}>
      <h2 className={styles.promocodeTitle}>Promo-codes</h2>
      <p className={styles.promocode}>Scopes</p>
      <p className={styles.promocode}>RS</p>
    </div>
  );
}
