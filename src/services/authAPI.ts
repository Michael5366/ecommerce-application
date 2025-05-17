const CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;

interface CommerceToolsErrorResponse {
  statusCode?: number;
  message?: string;
  error?: string;
  error_description?: string;
  errors?: Array<{
    code: string;
    message: string;
    detailedErrorMessage?: string;
  }>;
}

export class CommerceToolsAuthError extends Error {
  public code: string;
  public statusCode?: number;
  public field?: string;
  public details?: string;

  constructor(errorResponse: CommerceToolsErrorResponse) {
    super(
      errorResponse.error_description ||
        errorResponse.message ||
        errorResponse.error ||
        'Authentication failed'
    );
    this.name = 'CommerceToolsAuthError';
    this.code = errorResponse.error || errorResponse.errors?.[0]?.code || 'unknown_error';
    this.statusCode = errorResponse.statusCode;
    this.details = errorResponse.errors?.[0]?.detailedErrorMessage;

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

interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  addresses?: Address[];
  shippingAddressIds?: string[];
  billingAddressIds?: string[];
}

interface Address {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}

interface LoginResponse {
  customer: Customer;
}

const fetchAuthTokens = async (email: string, password: string): Promise<AuthResponse> => {
  const scopes = [
    `manage_customers:${PROJECT_KEY}`,
    `manage_my_profile:${PROJECT_KEY}`,
    `view_published_products:${PROJECT_KEY}`,
  ].join(' ');

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
      scope: scopes,
    }),
  });

  if (!response.ok) {
    const error: CommerceToolsErrorResponse = await response.json();
    throw new CommerceToolsAuthError(error);
  }

  return (await response.json()) as AuthResponse;
};

const fetchCustomerData = async (
  accessToken: string,
  email: string,
  password: string
): Promise<Customer> => {
  const response = await fetch(`${API_URL}/${PROJECT_KEY}/login`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
      password: password.trim(),
    }),
  });

  if (!response.ok) {
    const error: CommerceToolsErrorResponse = await response.json();
    throw new CommerceToolsAuthError(error);
  }

  const data = (await response.json()) as LoginResponse;
  return data.customer;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ auth: AuthResponse; customer: Customer }> => {
  try {
    const authData = await fetchAuthTokens(email, password);
    const customer = await fetchCustomerData(authData.access_token, email, password);

    return { auth: authData, customer };
  } catch (err) {
    if (err instanceof CommerceToolsAuthError) {
      throw err;
    }
    throw new CommerceToolsAuthError({
      error: 'network_error',
      message: 'Network error occurred. Please try again.',
    });
  }
};

export const storeAuthData = (authData: AuthResponse, customer: Customer): void => {
  try {
    const expiresAt = Date.now() + authData.expires_in * 1000;

    localStorage.setItem('access_token', authData.access_token);
    if (authData.refresh_token) {
      localStorage.setItem('refresh_token', authData.refresh_token);
    }
    localStorage.setItem('token_expires_in', expiresAt.toString());
    localStorage.setItem('customer', JSON.stringify(customer));
  } catch (error) {
    console.error('Failed to store auth data:', error);
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('access_token');
    const expiresIn = localStorage.getItem('token_expires_in');

    if (!token || !expiresIn) {
      return false;
    }

    const expirationTime = parseInt(expiresIn, 10);
    return Date.now() < expirationTime;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
};
