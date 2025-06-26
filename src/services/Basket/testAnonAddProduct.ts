export async function addTestItemsToAnonCart() {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const apiUrl = import.meta.env.VITE_CTP_API_URL;
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('guestToken');
  const cartId = localStorage.getItem('anonymous_cart_id') || sessionStorage.getItem('cart_id');

  if (!cartId || !token) {
    return;
  }

  const cartResponse = await fetch(`${apiUrl}/${projectKey}/carts/${cartId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!cartResponse.ok) {
    return;
  }

  const cart = await cartResponse.json();

  const testProducts = [
    {
      productId: '30338e91-3371-4005-a3c9-086fb27a8e3d',
      variantId: 1,
      quantity: 2,
    },
    {
      productId: '3aa49981-0b9e-4db5-bdff-7f8736d28cd4',
      variantId: 1,
      quantity: 1,
    },
  ];

  const actions = testProducts.map((product) => ({
    action: 'addLineItem',
    productId: product.productId,
    variantId: product.variantId,
    quantity: product.quantity,
  }));

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
