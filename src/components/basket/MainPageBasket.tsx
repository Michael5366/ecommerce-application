import { useEffect } from 'react';
import { CartResponse } from './BasketPageConstr';
import { getAnonymousToken } from '../../services/auth-registration';
import { getOrUpdateCustomerCart } from '../../services/Basket/updateBasket';
import styles from './MainPageBasket.module.css';
//import { addTestItemsToCart } from '../../services/Basket/temporalBasket';
//import { addTestItemsToAnonCart } from '../../services/Basket/testAnonAddProduct';
export function CreateCardEnter() {
  useEffect(() => {
    async function initialize() {
      let cartData: CartResponse | null = null;
      try {
        if (!sessionStorage.getItem('auth_token')) {
          await getAnonymousToken();
        }
        cartData = await getOrUpdateCustomerCart();
        console.log(cartData);
      } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
      } finally {
        if (cartData) {
          //addTestItemsToCart(cartData.id, cartData.version)
          //addTestItemsToAnonCart()
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
