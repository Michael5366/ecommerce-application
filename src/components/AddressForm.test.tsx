import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AddressForm from './AddressForm';

describe('AddressForm', () => {
  const mockAddress = {
    streetName: 'Main St',
    city: 'Madrid',
    postalCode: '12345',
    country: 'ES',
  };

  const mockErrors = {
    streetName: '',
    city: '',
    postalCode: '',
    country: '',
  };

  const mockOnChange = vi.fn();

  it('renders input fields with correct values', () => {
    render(
      <AddressForm
        type="shippingAddress"
        title="Shipping Address"
        address={mockAddress}
        errors={mockErrors}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByPlaceholderText('Street')).toHaveValue('Main St');
    expect(screen.getByPlaceholderText('City')).toHaveValue('Madrid');
    expect(screen.getByPlaceholderText('Postal Code')).toHaveValue('12345');
    expect(screen.getByDisplayValue('Spain')).toBeInTheDocument();
  });

  it('calls onChange when inputs are changed', () => {
    render(
      <AddressForm
        type="billingAddress"
        title="Billing Address"
        address={mockAddress}
        errors={mockErrors}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Street'), { target: { value: 'New St' } });
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'billingAddress');
  });

  it('displays error messages if present', () => {
    const errorMock = {
      streetName: 'Street is required',
      city: '',
      postalCode: 'Invalid postal code',
      country: '',
    };

    render(
      <AddressForm
        type="shippingAddress"
        title="Address"
        address={mockAddress}
        errors={errorMock}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Street is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid postal code')).toBeInTheDocument();
  });
});
