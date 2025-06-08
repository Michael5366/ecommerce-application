import { CommerceToolsErrorResponse, AuthResponse, Customer, LoginResponse } from './authAPI.types';

const CLIENT_ID = import.meta.env.VITE_CTP_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CTP_CLIENT_SECRET;
const PROJECT_KEY = import.meta.env.VITE_CTP_PROJECT_KEY;
const AUTH_URL = import.meta.env.VITE_CTP_AUTH_URL;
const API_URL = import.meta.env.VITE_CTP_API_URL;

const AUTH_FLAG_KEY = 'ct_auth_flag';
const TOKEN_EXPIRY_KEY = 'ct_token_expiry';
const CUSTOMER_EMAIL_KEY = 'ct_customer_email';

let authToken: string | null = null;
let tokenExpiry: number | null = null;
let customerEmail: string | null = null;

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

const fetchAuthTokens = async (email: string, password: string): Promise<AuthResponse> => {
  const scopes = [
    `manage_customers:${PROJECT_KEY}`,
    `manage_my_profile:${PROJECT_KEY}`,
    `view_published_products:${PROJECT_KEY}`,
    `view_products:${PROJECT_KEY}`,
    `view_categories:${PROJECT_KEY}`,
    `manage_my_orders:${PROJECT_KEY}`,
    `view_orders:${PROJECT_KEY}`

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

    authToken = authData.access_token;
    tokenExpiry = Date.now() + authData.expires_in * 1000;
    customerEmail = customer.email;

    sessionStorage.setItem(AUTH_FLAG_KEY, 'true');
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, tokenExpiry.toString());
    sessionStorage.setItem(CUSTOMER_EMAIL_KEY, customer.email);

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

export const getAuthToken = (): string | null => {
  return authToken;
};

export const getCustomerEmail = (): string | null => {
  return customerEmail || sessionStorage.getItem(CUSTOMER_EMAIL_KEY);
};

export const clearAuthData = (): void => {
  authToken = null;
  tokenExpiry = null;
  customerEmail = null;
  sessionStorage.removeItem(AUTH_FLAG_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(CUSTOMER_EMAIL_KEY);
};

export const isAuthenticated = (): boolean => {
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return true;
  }

  const storedFlag = sessionStorage.getItem(AUTH_FLAG_KEY);
  const storedExpiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

  if (storedFlag === 'true' && storedExpiry) {
    const expiryTime = parseInt(storedExpiry, 10);
    if (Date.now() < expiryTime) {
      return true;
    }
    clearAuthData();
  }

  return false;
};

export const initializeAuth = (): void => {
  const storedExpiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
  const storedEmail = sessionStorage.getItem(CUSTOMER_EMAIL_KEY);

  if (storedExpiry) {
    tokenExpiry = parseInt(storedExpiry, 10);
  }
  if (storedEmail) {
    customerEmail = storedEmail;
  }
};
