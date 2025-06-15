import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createEmptyCart } from './CreateBasketApi';

const mockToken = 'mock-token';

describe('createEmptyCart', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    sessionStorage.clear();
  });

  it('creates a cart and stores data in sessionStorage', async () => {
    const mockCartResponse = {
      id: 'cart123',
      customerEmail: 'test@example.com',
    };

    // Мокаем fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCartResponse,
    });

    const result = await createEmptyCart(mockToken);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/me/carts'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer ${mockToken}`,
        }),
      })
    );

    expect(result).toEqual(mockCartResponse);
    expect(sessionStorage.getItem('cart_id')).toBe('cart123');
    expect(sessionStorage.getItem('customer_email')).toBe('test@example.com');
  });

  it('returns null and logs error on failed response', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = { message: 'Failed to create' };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => mockError,
    });

    const result = await createEmptyCart(mockToken);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Error fo creating the basket:', mockError);
  });
});
