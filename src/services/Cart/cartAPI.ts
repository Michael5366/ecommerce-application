import { CommerceToolsAuthError } from '../Auth/authAPI';
import { getAnonymousToken } from '../Catalog/catalogAPI';

const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const API_URL = import.meta.env.VITE_CTP_API_URL;

export interface Cart {
  id: string;
  version: number;
  lineItems: LineItem[];
}

export interface LineItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: {
    value: {
      centAmount: number;
      currencyCode: string;
    };
  };
}

const getAuthHeader = async (): Promise<string> => {
  const token = sessionStorage.getItem('auth_token');
  if (token) return `Bearer ${token}`;

  const anonymousToken = await getAnonymousToken();
  return `Bearer ${anonymousToken}`;
};

const isAnonymous = (): boolean => !sessionStorage.getItem('auth_token');

export const getActiveCart = async (): Promise<Cart | null> => {
  try {
    const authHeader = await getAuthHeader();
    const anonymous = isAnonymous();

    if (anonymous) {
      const savedCartId = localStorage.getItem('anonymous_cart_id');
      if (savedCartId) {
        const savedCartResponse = await fetch(`${API_URL}/${PROJECT_KEY}/carts/${savedCartId}`, {
          headers: { Authorization: authHeader },
        });
        if (savedCartResponse.ok) return savedCartResponse.json();
      }
    }

    const activeCartResponse = await fetch(`${API_URL}/${PROJECT_KEY}/me/active-cart`, {
      headers: { Authorization: authHeader },
    });

    if (activeCartResponse.ok) {
      return activeCartResponse.json();
    }

    if (activeCartResponse.status === 404) {
      return createCart();
    }

    if (activeCartResponse.status === 403) {
      sessionStorage.removeItem('auth_token');
      return null;
    }

    if (!activeCartResponse.ok) {
      const error = await activeCartResponse.json();
      throw new CommerceToolsAuthError(error);
    }

    return null;
  } catch (error) {
    console.error('Error fetching active cart:', error);
    return null;
  }
};

export const createCart = async (currency = 'USD'): Promise<Cart> => {
  try {
    const authHeader = await getAuthHeader();
    const anonymous = isAnonymous();
    const endpoint = anonymous ? 'carts' : 'me/carts';

    const response = await fetch(`${API_URL}/${PROJECT_KEY}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        currency,
        country: 'US',
        ...(anonymous && { anonymousId: generateAnonymousId() }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new CommerceToolsAuthError(error);
    }

    const cart = await response.json();

    if (anonymous && cart.id) {
      localStorage.setItem('anonymous_cart_id', cart.id);
    }

    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

const generateAnonymousId = (): string => {
  const storedId = localStorage.getItem('anonymous_id');
  if (storedId) return storedId;

  const newId = 'anon_' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('anonymous_id', newId);
  return newId;
};

export const addToCart = async (productId: string, variantId = 1, quantity = 1): Promise<Cart> => {
  try {
    const authHeader = await getAuthHeader();
    const anonymous = isAnonymous();
    const endpoint = anonymous ? 'carts' : 'me/carts';

    let cart = await getActiveCart();

    if (!cart) {
      cart = await createCart();
    }

    const response = await fetch(`${API_URL}/${PROJECT_KEY}/${endpoint}/${cart.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        version: cart.version,
        actions: [
          {
            action: 'addLineItem',
            productId,
            variantId,
            quantity,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('auth_token');
        return addToCart(productId, variantId, quantity);
      }
      throw new CommerceToolsAuthError(error);
    }

    return response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
