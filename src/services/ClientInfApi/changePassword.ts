import Toastify from 'toastify-js';
import { CustomerData } from './GetClientInf';

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  version: number;
  id: string;
}

export async function changeUserPassword({
  currentPassword,
  newPassword,
  id,
  version,
}: ChangePasswordInput): Promise<CustomerData> {
  const token = sessionStorage.getItem('auth_token');
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

  if (!token) {
    throw new Error('Auth token was not found in sessionStorage');
  }

  const body = {
    id,
    version,
    currentPassword,
    newPassword,
  };
  console.log('Request body to server:', JSON.stringify(body, null, 2));
  try {
    const response = await fetch(
      `https://api.europe-west1.gcp.commercetools.com/${projectKey}/me/password`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          version,
          currentPassword,
          newPassword,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Change password failed:', errorData);
      throw new Error(`Failed to change password: ${response.status}`);
    }
    const data = await response.json();
    console.log('Server response after password change:', data);
    Toastify({
      text: 'You are automatically logged in with a new password.',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#42ff9e',
        color: '#fff',
      },
    }).showToast();
    return data;
  } catch (error) {
    console.error('Error changing password:', error);
    Toastify({
      text: 'The information has not been updated',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#FF6B6B',
        color: '#fff',
      },
    }).showToast();
    throw error;
  }
}
