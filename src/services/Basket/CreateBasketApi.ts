export interface Cart {
  id: string;
  version: number;
  customerEmail?: string;
  lineItems: Array<{
    id: string;
    productId: string;
    name: { en: string; ru: string };
    variant: {
      id: number;
      images?: Array<{ url: string }>;
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
  }>;
  totalPrice: {
    centAmount: number;
    currencyCode: string;
  };
}

export async function createEmptyCart(token: string): Promise<Cart | null> {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  try {
    const response = await fetch(
      `https://api.europe-west1.gcp.commercetools.com/${projectKey}/me/carts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: 'US',
          currency: 'USD',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fo creating the basket:', error);
      return null;
    }

    const cartData: Cart = await response.json();
    sessionStorage.setItem('cart_id', cartData.id);
    if (cartData.customerEmail) {
      sessionStorage.setItem('customer_email', cartData.customerEmail);
    }

    return cartData;
  } catch (error) {
    console.error('Error fo creating the basket:', error);
    return null;
  }
}
