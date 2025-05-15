const CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;

interface CommerceToolsErrorResponse {
  error: string;
  error_description?: string;
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

export class CommerceToolsAuthError extends Error {
  public code: string;
  public field?: string;

  constructor(errorResponse: CommerceToolsErrorResponse) {
    super(errorResponse.error_description || errorResponse.error);
    this.name = 'CommerceToolsAuthError';
    this.code = errorResponse.error;

    if (this.code === 'invalid_grant') {
      if (this.message.toLowerCase().includes('email')) {
        this.field = 'email';
      } else if (this.message.toLowerCase().includes('password')) {
        this.field = 'password';
      }
    }
  }
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_URL}/oauth/${PROJECT_KEY}/customers/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: email.trim(),
        password: password.trim(),
        scope: `manage_my_profile:${PROJECT_KEY}`,
      }),
    });

    if (!response.ok) {
      const error: CommerceToolsErrorResponse = await response.json();
      throw new CommerceToolsAuthError(error);
    }

    return (await response.json()) as AuthResponse;
  } catch (err) {
    if (err instanceof CommerceToolsAuthError) {
      throw err;
    }
    throw new Error('Network error occurred. Please try again.');
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  const expiresIn = localStorage.getItem('token_expires_in');

  if (!token || !expiresIn) {
    return false;
  }

  const expirationTime = parseInt(expiresIn, 10);
  return Date.now() < expirationTime;
};
