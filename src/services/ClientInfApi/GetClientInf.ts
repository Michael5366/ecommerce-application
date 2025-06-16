export type Address = {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
};

export type CustomerData = {
  id: string;
  version: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  addresses: Address[];
  billingAddressIds: string[];
  shippingAddressIds: string[];
  email: string;
};

export async function getCustomerData(): Promise<CustomerData> {
  const token = sessionStorage.getItem('auth_token');
  console.log('токен в запросе данных клиента', token);
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  if (!token) {
    throw new Error('Auth token was not found sessionStorage');
  }

  try {
    const response = await fetch(
      `https://api.europe-west1.gcp.commercetools.com/${projectKey}/me`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error wit getting customer: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
