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
        title="Адрес доставки"
        address={mockAddress}
        errors={mockErrors}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByPlaceholderText('Улица')).toHaveValue('Main St');
    expect(screen.getByPlaceholderText('Город')).toHaveValue('Madrid');
    expect(screen.getByPlaceholderText('Почтовый индекс')).toHaveValue('12345');
    expect(screen.getByDisplayValue('Испания')).toBeInTheDocument();
  });

  it('calls onChange when inputs are changed', () => {
    render(
      <AddressForm
        type="billingAddress"
        title="Адрес для счета"
        address={mockAddress}
        errors={mockErrors}
        onChange={mockOnChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Улица'), { target: { value: 'New St' } });
    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), 'billingAddress');
  });

  it('displays error messages if present', () => {
    const errorMock = {
      streetName: 'Улица обязательна',
      city: '',
      postalCode: 'Неверный индекс',
      country: '',
    };

    render(
      <AddressForm
        type="shippingAddress"
        title="Адрес"
        address={mockAddress}
        errors={errorMock}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Улица обязательна')).toBeInTheDocument();
    expect(screen.getByText('Неверный индекс')).toBeInTheDocument();
  });
});