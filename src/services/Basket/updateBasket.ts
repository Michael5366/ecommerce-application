//import { addTestItemsToCart } from './temporalBasket';

export async function getOrUpdateCustomerCart() {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const apiUrl = import.meta.env.VITE_CTP_API_URL;
  const token = sessionStorage.getItem('auth_token');
  if (!token) throw new Error('Auth token not found in sessionStorage');

  let cartId = sessionStorage.getItem('cart_id');
  let cart = null;

  // Exist basket loading
  if (cartId) {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      cart = await response.json();
      console.log('We have the basket from cart_id:', cart);
    } else {
      console.warn('We coundnt get the basket grom cart_id. Deleting.');
      sessionStorage.removeItem('cart_id');
      cartId = null;
    }
  }

  // find existing basket
  if (!cart) {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        cart = data.results[0];
        sessionStorage.setItem('cart_id', cart.id);
        console.log('Найдена существующая корзина:', cart);
      }
    }
  }

  // creating new basket if there isn't existing basket
  if (!cart) {
    const response = await fetch(`${apiUrl}/${projectKey}/me/carts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'USD',
      }),
    });

    if (response.ok) {
      cart = await response.json();
      sessionStorage.setItem('cart_id', cart.id);
      console.log('The new basket was created:', cart);
    } else {
      const errorData = await response.json();
      console.error('Error with creating the new basket:', errorData);
      throw new Error('We cannot create new basket');
    }
  }

  // adding products for testing
  {
    /*
  try {
    const updatedCart = await addTestItemsToCart(cart.id, cart.version);
    console.log('Корзина после добавления товара:', updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    
  }
    */
  }
  return cart;
}
