import { useEffect } from "react";
import { CartResponse } from "./BasketPageConstr";
import { getAnonymousToken } from "../../services/auth-registration";
import { getOrUpdateCustomerCart } from "../../services/Basket/updateBasket";
export function CreateCardEnter(){
    useEffect(() => {
        async function initialize() {
          let cartData: CartResponse | null = null;
          try {
            if (!sessionStorage.getItem('auth_token')) {
              await getAnonymousToken();
            }
            cartData = await getOrUpdateCustomerCart();
          } catch (error) {
            console.error('Ошибка при загрузке корзины:', error);
          } finally {
            if (cartData) {
              //addTestItemsToCart(cartData.id, cartData.version);
            }
          }
        }
    
        initialize();
      }, []);
      return(
        <div>
        <h3>Promo-codes</h3>
        <p>Scopes</p>
        <p>RS</p>
        </div>
      )
}