export async function addTestItemsToCart(cartId: string, version: number) {
  const token = sessionStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Доступ только для зарегистрированных пользователей');
  }
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
          productId: '63ca3350-d7d9-4682-a447-05db59ae2739',
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
