import { describe, it, expect } from 'vitest';
import { loginValidation } from './loginValidation';

describe('loginValidation', () => {
  describe('email validation', () => {
    it('validates correct email format', async () => {
      await expect(
        loginValidation.validateAt('email', { email: 'valid@example.com' })
      ).resolves.toBe('valid@example.com');
    });

    it('rejects invalid email formats with correct message', async () => {
      await expect(loginValidation.validateAt('email', { email: 'invalid' })).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('requires email', async () => {
      await expect(loginValidation.validateAt('email', { email: '' })).rejects.toThrow(
        'Email is required'
      );
    });

    it('rejects emails with whitespace', async () => {
      await expect(
        loginValidation.validateAt('email', { email: ' test@example.com ' })
      ).rejects.toThrow('Email must not contain spaces');
    });
  });

  describe('password validation', () => {
    it('validates correct password', async () => {
      await expect(
        loginValidation.validateAt('password', { password: 'ValidPass123!' })
      ).resolves.toBe('ValidPass123!');
    });

    it('requires password', async () => {
      await expect(loginValidation.validateAt('password', { password: '' })).rejects.toThrow(
        'Password is required'
      );
    });

    it('rejects short passwords', async () => {
      await expect(loginValidation.validateAt('password', { password: 'short' })).rejects.toThrow(
        'Password must be at least 8 characters'
      );
    });

    it('rejects passwords without uppercase letters', async () => {
      await expect(
        loginValidation.validateAt('password', { password: 'invalidpass1!' })
      ).rejects.toThrow('Password must contain at least one uppercase letter');
    });

    it('rejects passwords without lowercase letters', async () => {
      await expect(
        loginValidation.validateAt('password', { password: 'INVALIDPASS1!' })
      ).rejects.toThrow('Password must contain at least one lowercase letter');
    });

    it('rejects passwords without digits', async () => {
      await expect(
        loginValidation.validateAt('password', { password: 'InvalidPass!' })
      ).rejects.toThrow('Password must contain at least one digit');
    });

    it('rejects passwords without special characters', async () => {
      await expect(
        loginValidation.validateAt('password', { password: 'InvalidPass1' })
      ).rejects.toThrow('Password must contain at least one special character');
    });

    it('rejects passwords with whitespace', async () => {
      await expect(
        loginValidation.validateAt('password', { password: ' InvalidPass1! ' })
      ).rejects.toThrow('Password must not contain spaces');
    });
  });

  describe('full form validation', () => {
    it('validates correct email and password together', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'ValidPass123!',
      };
      await expect(loginValidation.validate(validData)).resolves.toEqual(validData);
    });

    it('rejects invalid complete form', async () => {
      const invalidData = {
        email: 'invalid',
        password: 'short',
      };
      await expect(loginValidation.validate(invalidData)).rejects.toThrow();
    });
  });
});
