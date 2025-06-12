//import { addTestItemsToCart } from './temporalBasket';

export async function getOrUpdateCustomerCart() {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const apiUrl = import.meta.env.VITE_CTP_API_URL;
  const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
  if (!token) throw new Error('Auth token not found in sessionStorage');

  const isAnonymous = !sessionStorage.getItem('auth_token');
  const endpoint = isAnonymous ? 'carts' : 'me/carts';

  let cartId = sessionStorage.getItem('cart_id');
  let cart = null;

  // Exist basket loading
  if (cartId) {
    const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}/${cartId}`, {
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
  if (!cart && !isAnonymous) {
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
        console.log('Found existing cart:', cart);
      }
    }
  }

  // creating new basket if there isn't existing basket
  if (!cart) {
    const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'USD',
        ...(isAnonymous && { anonymousId: sessionStorage.getItem('anonymousId') || generateAnonymousId()
          })
      }),
    });

    if (response.ok) {
      cart = await response.json();
      sessionStorage.setItem('cart_id', cart.id);
       if (isAnonymous && !sessionStorage.getItem('anonymousId')) {
        sessionStorage.setItem('anonymousId', cart.anonymousId);
      }
      console.log('The new basket was created:', cart);
    } else {
      const errorData = await response.json();
      console.error('Error with creating the new basket:', errorData);
      throw new Error('We cannot create new basket');
    }
  }

  // adding products for testing
  /*{
    
  try {
    const updatedCart = await addTestItemsToCart(cart.id, cart.version);
    console.log('Корзина после добавления товара:', updatedCart);
    return updatedCart;
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    
  }
    
  }*/
  return cart;
}

function generateAnonymousId() {
  return 'anon_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
