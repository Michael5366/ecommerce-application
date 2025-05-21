import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommerceToolsAuthError, loginUser, isAuthenticated, clearAuthData } from './authAPI';

vi.stubGlobal('sessionStorage', {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
});

vi.stubGlobal('fetch', vi.fn());

describe('authAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearAuthData();
  });

  describe('CommerceToolsAuthError', () => {
    it('should create error with default message', () => {
      const error = new CommerceToolsAuthError({});
      expect(error.message).toBe('Authentication failed');
    });
  });

  describe('loginUser', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'test_token',
            expires_in: 3600,
            customer: { email: 'test@example.com' },
          }),
      };
      vi.mocked(fetch).mockResolvedValue(mockResponse as Response);

      await loginUser('test@example.com', 'password');

      expect(fetch).toHaveBeenCalled();
      expect(sessionStorage.setItem).toHaveBeenCalled();
    });

    it('should throw error for invalid credentials', async () => {
      const errorResponse = {
        error: 'invalid_grant',
        error_description: 'Invalid credentials',
      };
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve(errorResponse),
      } as Response);

      await expect(loginUser('wrong@example.com', 'wrongpass')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not authenticated', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true when token is valid', () => {
      vi.mocked(sessionStorage.getItem)
        .mockReturnValueOnce('true')
        .mockReturnValueOnce((Date.now() + 3600000).toString());

      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('clearAuthData', () => {
    it('should clear all auth data', () => {
      clearAuthData();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('ct_auth_flag');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('ct_token_expiry');
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('ct_customer_email');
    });
  });
});
