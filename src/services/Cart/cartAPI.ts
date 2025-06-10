import { getAuthToken, CommerceToolsAuthError } from '../Auth/authAPI';
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
  const token = getAuthToken();
  if (token) return `Bearer ${token}`;

  const anonymousToken = await getAnonymousToken();
  return `Bearer ${anonymousToken}`;
};

export const getActiveCart = async (): Promise<Cart | null> => {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_URL}/${PROJECT_KEY}/me/active-cart`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      if (response.status === 403) {
        return null;
      }
      const error = await response.json();
      throw new CommerceToolsAuthError(error);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching active cart:', error);
    return null;
  }
};

export const createCart = async (currency = 'USD'): Promise<Cart> => {
  try {
    const authHeader = await getAuthHeader();

    const response = await fetch(`${API_URL}/${PROJECT_KEY}/me/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        currency,
        country: 'US',
        ...(!getAuthToken() && { anonymousId: generateAnonymousId() }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new CommerceToolsAuthError(error);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

const generateAnonymousId = (): string => {
  return 'anon_' + Math.random().toString(36).substring(2, 15);
};

export const addToCart = async (productId: string, variantId = 1, quantity = 1): Promise<Cart> => {
  try {
    const authHeader = await getAuthHeader();
    let cart = await getActiveCart();

    if (!cart) {
      cart = await createCart();
    }

    const response = await fetch(`${API_URL}/${PROJECT_KEY}/me/carts/${cart.id}`, {
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
      throw new CommerceToolsAuthError(error);
    }

    return response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
