export async function addTestItemsToCart(cartId: string, version: number) {
  const token = sessionStorage.getItem('auth_token');
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const apiUrl = import.meta.env.VITE_CTP_API_URL;

  const response = await fetch(`${apiUrl}/${projectKey}/me/carts/${cartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version,
      actions: [
        {
          action: 'addLineItem',
          productId: 'c928a059-d25e-4c9b-91e6-efbcaa117e18',
          variantId: 1,
          quantity: 2,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error with adding product in the basket:', error);
    throw new Error(error.message || 'We cannot add the product');
  }

  const updatedCart = await response.json();
  return updatedCart;
}
