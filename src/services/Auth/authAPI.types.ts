export interface CommerceToolsErrorResponse {
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

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  addresses?: Address[];
  shippingAddressIds?: string[];
  billingAddressIds?: string[];
}

export interface Address {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface LoginResponse {
  customer: Customer;
}
