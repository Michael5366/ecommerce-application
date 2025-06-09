
export async function createEmptyCart(token: string) {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

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
        currency: 'USD'
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error fo creating the basket:', errorData);
    return null;
  }

  const cartData = await response.json();
  console.log('The empty basket was creating:', cartData);

  sessionStorage.setItem('cart_id', cartData.id);
  if (cartData.customerEmail) {
    sessionStorage.setItem('customer_email', cartData.customerEmail);
  }

  return cartData;
}
