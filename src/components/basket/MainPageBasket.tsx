import { useEffect } from 'react';
import { getAnonymousToken } from '../../services/auth-registration';
import styles from './MainPageBasket.module.css';
import handleError from '../../utils/errorHandler';

export function CreateCardEnter() {
  useEffect(() => {
    async function initialize() {
      try {
        if (!sessionStorage.getItem('auth_token')) {
          await getAnonymousToken();
        }
      } catch (error) {
        handleError('Error loading cart: ', error);
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
