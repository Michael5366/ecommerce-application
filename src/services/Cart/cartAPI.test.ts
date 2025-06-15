import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getActiveCart,
  createCart,
  addToCart,
  isProductInCart,
  getLineItemId,
  Cart,
} from './cartAPI';

vi.mock('../Auth/authAPI', () => ({
  CommerceToolsAuthError: class MockCommerceToolsAuthError extends Error {
    constructor(error: { message: string }) {
      super(error.message);
    }
  },
}));

vi.mock('../Catalog/catalogAPI', () => ({
  getAnonymousToken: vi.fn(() => Promise.resolve('mocked_anonymous_token')),
}));

const mockSessionStorage = {
  getItem: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
};

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};

const mockFetch = vi.fn();

beforeEach(() => {
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true,
  });

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  Object.defineProperty(window, 'fetch', {
    value: mockFetch,
    writable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('cartAPI', () => {
  const mockCart: Cart = {
    id: 'cart_123',
    version: 1,
    lineItems: [
      {
        id: 'line_item_1',
        productId: 'prod_123',
        name: 'Test Product',
        quantity: 1,
        price: {
          value: {
            centAmount: 1000,
            currencyCode: 'USD',
          },
        },
      },
    ],
  };

  describe('getActiveCart', () => {
    it('should return active cart for authenticated user', async () => {
      mockSessionStorage.getItem.mockReturnValue('auth_token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockCart),
      });

      const result = await getActiveCart();
      expect(result).toEqual(mockCart);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/me/active-cart'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer auth_token' },
        })
      );
    });

    it('should return saved anonymous cart if exists', async () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      mockLocalStorage.getItem.mockReturnValueOnce('anonymous_cart_id');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCart),
      });

      const result = await getActiveCart();
      expect(result).toEqual(mockCart);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('anonymous_cart_id');
    });

    it('should create new cart if no active cart found', async () => {
      mockSessionStorage.getItem.mockReturnValue('auth_token');
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCart),
        });

      const result = await getActiveCart();
      expect(result).toEqual(mockCart);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle 403 error by removing auth token', async () => {
      mockSessionStorage.getItem.mockReturnValue('auth_token');
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      const result = await getActiveCart();
      expect(result).toBeNull();
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('createCart', () => {
    it('should create authenticated cart', async () => {
      mockSessionStorage.getItem.mockReturnValue('auth_token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCart),
      });

      const result = await createCart();
      expect(result).toEqual(mockCart);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/me/carts'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer auth_token',
          },
        })
      );
    });

    it('should create anonymous cart and save id', async () => {
      mockSessionStorage.getItem.mockReturnValue(null);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCart),
      });

      const result = await createCart();
      expect(result).toEqual(mockCart);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('anonymous_cart_id', mockCart.id);
    });
  });

  describe('addToCart', () => {
    it('should add item to existing cart', async () => {
      mockSessionStorage.getItem.mockReturnValue('auth_token');
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCart),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockCart, version: 2 }),
        });

      const result = await addToCart('prod_123');
      expect(result.version).toBe(2);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should create new cart if none exists', async () => {
      mockSessionStorage.getItem.mockReturnValue('auth_token');
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockCart),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ ...mockCart, version: 1 }),
        });

      const result = await addToCart('prod_123');
      expect(result.version).toBe(1);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });
  });

  describe('isProductInCart', () => {
    it('should return true if product is in cart', () => {
      const result = isProductInCart(mockCart, 'prod_123');
      expect(result).toBe(true);
    });

    it('should return false if product is not in cart', () => {
      const result = isProductInCart(mockCart, 'prod_456');
      expect(result).toBe(false);
    });

    it('should return false if cart is null', () => {
      const result = isProductInCart(null, 'prod_123');
      expect(result).toBe(false);
    });
  });

  describe('getLineItemId', () => {
    it('should return line item id if product is in cart', () => {
      const result = getLineItemId(mockCart, 'prod_123');
      expect(result).toBe('line_item_1');
    });

    it('should return undefined if product is not in cart', () => {
      const result = getLineItemId(mockCart, 'prod_456');
      expect(result).toBeUndefined();
    });

    it('should return undefined if cart is null', () => {
      const result = getLineItemId(null, 'prod_123');
      expect(result).toBeUndefined();
    });
  });
});
