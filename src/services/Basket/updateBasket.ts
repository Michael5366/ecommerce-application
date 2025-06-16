export interface Money {
  centAmount: number;
  currencyCode: string;
}

export interface Image {
  url: string;
}

export interface ProductVariant {
  id: number;
  images?: Image[];
  sku?: string;
}

export interface LineItemPrice {
  value: Money;
  discounted?: {
    value: Money;
  };
}

export interface LineItem {
  id: string;
  name: {
    en: string;
    ru: string;
  };
  productSlug: {
    en: string;
    ru: string;
  };
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
    discounted?: {
      value: {
        centAmount: number;
        currencyCode: string;
      };
    };
  };
  quantity: number;
  totalPrice: {
    centAmount: number;
  };
}

export interface Cart {
  type: string;
  id: string;
  version: number;
  customerEmail?: string;
  anonymousId?: string;
  lineItems: LineItem[];
  totalPrice: Money;
  createdAt?: string;
  lastModifiedAt?: string;
}
export async function getOrUpdateCustomerCart(): Promise<Cart> {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const apiUrl = import.meta.env.VITE_CTP_API_URL;
  const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
  if (!token) throw new Error('Auth token not found in sessionStorage');

  const isAnonymous = !sessionStorage.getItem('auth_token');
  const endpoint = isAnonymous ? 'carts' : 'me/carts';

  let cartId = isAnonymous
    ? localStorage.getItem('anonymous_cart_id')
    : sessionStorage.getItem('cart_id');
  let cart: Cart | null = null;

  try {
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
        if (isAnonymous) {
          localStorage.removeItem('anonymous_cart_id');
        } else {
          sessionStorage.removeItem('cart_id');
        }
        cartId = null;
      }
    }

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
          if (cart) {
            sessionStorage.setItem('cart_id', cart.id);
          }
          console.log('Found existing cart:', cart);
        }
      }
    }

    if (!cart) {
      const anonymousId = isAnonymous
        ? localStorage.getItem('anonymous_id') || generateAnonymousId()
        : undefined;

      const response = await fetch(`${apiUrl}/${projectKey}/${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currency: 'USD',
          ...(isAnonymous && { anonymousId }),
        }),
      });

      if (response.ok) {
        cart = await response.json();

        if (isAnonymous) {
          if (cart) {
            localStorage.setItem('anonymous_cart_id', cart.id);
          }
          if (!localStorage.getItem('anonymous_id') && cart) {
            localStorage.setItem('anonymous_id', cart.anonymousId!);
          }
        } else {
          if (cart) {
            sessionStorage.setItem('cart_id', cart.id);
          }
        }
        console.log('Created new cart:', cart);
      } else {
        await response.json();
        throw new Error('Cannot create cart');
      }
    }
    if (!cart) {
      throw new Error('Failed to get or create cart');
    }
    return cart;
  } catch (error) {
    console.error('Error in getOrUpdateCustomerCart:', error);
    if (error instanceof Error) {
      throw new Error(`Cart operation failed: ${error.message}`);
    }
    throw new Error('Unknown error during cart operation');
  }
}

function generateAnonymousId() {
  const newId = 'anon_' + Math.random().toString(36).substring(2, 15);
  localStorage.setItem('anonymous_id', newId);
  return newId;
}
