// services/auth.ts
import { Address } from '../types/form';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

// const clientId = 'your_client_id';
// const clientSecret = 'your_client_secret';
// const credentials = btoa(`${clientId}:${clientSecret}`);
// console.log('Base64 encoded credentials:', credentials);

interface ApiError {
  code: string;
  message: string;
  duplicateValue?: string;
  field?: string;
}
interface ApiErrorResponse {
  errors: ApiError[];
  message: string;
  statusCode: number;
}
interface ApiSuccessResponse {
  customer: string;
}

export const getAnonymousToken = async () => {
  const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  // console.log(clientId, clientSecret, projectKey);

  const response = await fetch(
    `https://auth.europe-west1.gcp.commercetools.com/oauth/${projectKey}/anonymous/token`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&scope=create_anonymous_token:${projectKey} manage_my_profile:${projectKey}`,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error('Failed to get anonymous token:', data);
    throw new Error(data.error_description || 'Anonymous token failed');
  }

  return data.access_token;
};

export type SignUpPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
};

export const signUpUser = async (token: string, payload: SignUpPayload) => {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  const {
    email,
    password,
    firstName,
    lastName,
    addresses,
    defaultShippingAddress,
    defaultBillingAddress,
  } = payload;

  const body: SignUpPayload = {
    email,
    password,
    firstName,
    lastName,
    addresses,
  };

  if (typeof defaultShippingAddress === 'number') {
    body.defaultShippingAddress = defaultShippingAddress;
  }

  if (typeof defaultBillingAddress === 'number') {
    body.defaultBillingAddress = defaultBillingAddress;
  }

  const response = await fetch(
    `https://api.europe-west1.gcp.commercetools.com/${projectKey}/me/signup`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json();
    const duplicateEmailError = error.errors.find(
      (err) => err.code === 'DuplicateField' && err.field === 'email'
    );
    if (duplicateEmailError) {
      // console.log('польхователь уже зарегистриравн! Показать окощко');
      throw new Error('DuplicateEmail');
    }
    Toastify({
      text: error.message || 'Ошибка при регистрации пользователя',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#FF6B6B',
        color: '#fff',
      },
    }).showToast();

    throw new Error(error.message || 'Ошибка при регистрации пользователя');
  }
  const successData: ApiSuccessResponse = await response.json();
  Toastify({
    text: 'Регистрация успешно завершена! Переходим на главную страницу!',
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: {
      background: '#42ff9e',
      color: '#fff',
    },
  }).showToast();
  // router.push('/');
  // console.log(successData);
  return successData;
};

export const getCustomerToken = async (email: string, password: string) => {
  const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  const res = await fetch(
    `https://auth.europe-west1.gcp.commercetools.com/oauth/${projectKey}/customers/token`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=password&username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&scope=manage_my_profile:${projectKey} manage_my_orders:${projectKey}`,
    }
  );

  const data = await res.json();

  if (!res.ok) throw new Error(data.error_description || 'Login failed');

  return data.access_token;
};
