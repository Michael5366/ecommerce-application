const CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;

export const loginUser = async (email: string, password: string) => {
  const authHeader = `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`;
  const body = new URLSearchParams();

  body.append('grant_type', 'password');
  body.append('username', email.trim());
  body.append('password', password.trim());
  body.append('scope', `manage_my_profile:${PROJECT_KEY}`);

  const response = await fetch(`${AUTH_URL}/oauth/${PROJECT_KEY}/customers/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    },
    body,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error_description || 'Login failed');
  }

  return response.json();
};
