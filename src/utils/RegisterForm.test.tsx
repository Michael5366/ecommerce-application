import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import RegisterForm from '../components/RegisterForm';

vi.mock('../context/context.tsx', () => ({
  useAuth: () => ({
    token: null,
    setToken: vi.fn(),
  }),
}));

vi.mock('../services/auth-registration', () => ({
  getAnonymousToken: vi.fn(() => Promise.resolve('anon-token')),
  signUpUser: vi.fn(() => Promise.resolve()),
  getCustomerToken: vi.fn(() => Promise.resolve('customer-token')),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form inputs', () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Use the same address for billing/i)).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText('The name must contain only letters.')).toBeInTheDocument();
      expect(screen.getByText('The last name must contain only letters.')).toBeInTheDocument();
      expect(screen.getByText('Enter the correct email address')).toBeInTheDocument();
      expect(
        screen.getByText(
          'The password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.'
        )
      ).toBeInTheDocument();
    });
  });
});
