import { getCustomerData } from '../ClientInfApi/GetClientInf';



export async function getOrUpdateCustomerCart() {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const token = sessionStorage.getItem('auth_token');
  if (!token) throw new Error('Auth token not found in sessionStorage');

  let customerId = sessionStorage.getItem('customer_id');
  console.log('Token в getOrUpdateCustomerCart:', token);

  if (!customerId) {
    const customerData = await getCustomerData();
    customerId = customerData.id;
    sessionStorage.setItem('customer_id', customerId);
  }

  const response = await fetch(
    `https://api.europe-west1.gcp.commercetools.com/${projectKey}/carts?where=customerId="${customerId}"`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Ошибка получения корзины:', errorData);
    return null;
  }

  const cartsData = await response.json();
  console.log(cartsData);
  return cartsData.results && cartsData.results.length > 0 ? cartsData.results[0] : null;
}
