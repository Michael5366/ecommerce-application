const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;

export const loginUser = async (email: string, password: string) => {
  const authHeader = `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`;
  const body = new URLSearchParams();

  body.append('grant_type', 'password');
  body.append('username', email.trim());
  body.append('password', password.trim());
  body.append('scope', `manage_my_orders:${PROJECT_KEY} view_published_products:${PROJECT_KEY}`);

  const response = await fetch('https://auth.europe-west1.gcp.commercetools.com/oauth/token', {
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
