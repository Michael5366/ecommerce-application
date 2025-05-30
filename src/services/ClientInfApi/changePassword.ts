import Toastify from 'toastify-js';

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
}: ChangePasswordInput): Promise<void> {
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

    Toastify({
      text: 'Password changed successfully',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      style: {
        background: '#42ff9e',
        color: '#fff',
      },
    }).showToast();
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
