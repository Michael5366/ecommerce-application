import { UpdateCustomerBody } from "../../types/personalInformation";

export async function updateCustomer(data: UpdateCustomerBody) {
  const token = sessionStorage.getItem('auth_token');
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  if (!token) {
    throw new Error('Auth token not found');
  }

  const response = await fetch(
    `https://api.europe-west1.gcp.commercetools.com/${projectKey}/me`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Error updating customer: ${response.status}`);
  }

  return await response.json();
}
