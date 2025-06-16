import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCardBasket } from './createCard';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockItem = {
  id: 'item123',
  name: { en: 'Test Product', ru: 'Тестовый продукт' },
  productSlug: { en: 'test-product', ru: 'тест-продукт' },
  variant: {
    id: 1,
    images: [{ url: 'https://example.com/image.jpg' }],
    sku: 'SKU123',
  },
  price: {
    value: { centAmount: 1999, currencyCode: 'USD' },
    discounted: {
      value: { centAmount: 1499, currencyCode: 'USD' },
    },
  },
  quantity: 2,
  totalPrice: { centAmount: 2998 },
};

describe('ProductCardBusket', () => {
  it('renders product data and handles events', () => {
    const onRemove = vi.fn();
    const onQuantityChange = vi.fn();

    render(
      <BrowserRouter>
        <ProductCardBasket
          item={mockItem}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/SKU: SKU123/)).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$14.99 each')).toBeInTheDocument();
    expect(screen.getByText('$29.98 total')).toBeInTheDocument();

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');

    fireEvent.change(select, { target: { value: '3' } });
    expect(onQuantityChange).toHaveBeenCalledWith('item123', 3);

    const deleteButton = screen.getByRole('button', { name: 'Remove from cart' });
    fireEvent.click(deleteButton);
    expect(onRemove).toHaveBeenCalledWith('item123');
  });
});
