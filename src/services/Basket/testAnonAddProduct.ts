export async function addTestItemsToAnonCart() {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const apiUrl = import.meta.env.VITE_CTP_API_URL;
  const token = sessionStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
  const cartId = sessionStorage.getItem('cart_id');

  if (!cartId || !token) {
    return;
  }

  // The carrent cart
  const cartResponse = await fetch(`${apiUrl}/${projectKey}/carts/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!cartResponse.ok) {
    return;
  }

  const cart = await cartResponse.json();

  // Add testing cards
  const testProducts = [
    {
      productId: '30338e91-3371-4005-a3c9-086fb27a8e3d', //product ID
      variantId: 1,
      quantity: 2,
    },
    {
      productId: '3aa49981-0b9e-4db5-bdff-7f8736d28cd4', //product ID
      variantId: 1,
      quantity: 1,
    },
  ];

  // Actions
  const actions = testProducts.map((product) => ({
    action: 'addLineItem',
    productId: product.productId,
    variantId: product.variantId,
    quantity: product.quantity,
  }));

  // Api
  const response = await fetch(`${apiUrl}/${projectKey}/carts/${cartId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: cart.version,
      actions: actions,
    }),
  });

  if (response.ok) {
    const updatedCart = await response.json();
    return updatedCart;
  } else {
    const error = await response.json();
    throw error;
  }
}
