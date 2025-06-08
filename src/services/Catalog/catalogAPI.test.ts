import { renderHook } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { useApi } from './catalogAPI';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

interface MockResponse extends Response {
  json: () => Promise<{ access_token?: string; products?: unknown[]; user?: { id: string } }>;
}

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('useApi', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    sessionStorage.clear();
  });

  describe('makeApiRequest', () => {
    it('should make request with anonymous token for non-auth endpoints', async () => {
      const mockResponse = { products: [] };
      const mockToken = 'anonymous-token-123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ access_token: mockToken }),
      } as MockResponse);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as unknown as MockResponse);

      const { result } = renderHook(() => useApi());
      const response = await result.current.makeApiRequest<{ products: unknown[] }>('products');

      expect(response).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/products'),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should redirect to login for auth-required endpoints without token', async () => {
      const { result } = renderHook(() => useApi());

      await expect(result.current.makeApiRequest('me', {}, true)).rejects.toThrow(
        'Authorization required'
      );

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should use stored token for auth-required endpoints', async () => {
      const mockToken = 'user-token-123';
      const mockResponse = { user: { id: '123' } };
      sessionStorage.setItem('auth_token', mockToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as MockResponse);

      const { result } = renderHook(() => useApi());
      const response = await result.current.makeApiRequest<{ user: { id: string } }>(
        'me',
        {},
        true
      );

      expect(response).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/me'),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
            'Content-Type': 'application/json',
          },
        })
      );
    });

    it('should handle 401 error and redirect to login', async () => {
      const mockToken = 'expired-token-123';
      sessionStorage.setItem('auth_token', mockToken);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response);

      const { result } = renderHook(() => useApi());

      await expect(result.current.makeApiRequest('me', {}, true)).rejects.toThrow(
        'Session expired'
      );

      expect(sessionStorage.getItem('auth_token')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
