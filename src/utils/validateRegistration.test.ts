import { describe, it, expect } from 'vitest';
import { registrationSchema } from './validateRegistration';
import { ZodError } from 'zod';

describe('registrationSchema', () => {
  it('should return errors for invalid data', () => {
    const invalidData = {
      username: '',
      surname: '',
      email: 'invalid-email',
      password: '123',
      birthday: '2015-01-01',
      shippingAddress: {
        streetName: '',
        city: '123',
        postalCode: 'abc',
        country: 'XX',
      },
      billingAddress: {
        streetName: '',
        city: '',
        postalCode: '',
        country: '',
      },
    };

    try {
      registrationSchema.parse(invalidData);
    } catch (e) {
      if (e instanceof ZodError) {
        const messages = e.errors.map((err) => err.message);

        expect(messages).toContain('Enter the first name');
        expect(messages).toContain('Enter the last name');
        expect(messages).toContain('Enter the correct email address');
        expect(messages).toContain(
          'The password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.'
        );
        expect(messages).toContain('The user must be over 14 years old');
        expect(messages).toContain('Enter the street');
        expect(messages).toContain('The city must not contain numbers or special characters.');
        expect(messages).toContain('An unacceptable country');
        expect(messages).toContain('Select a country');
      } else {
        throw e;
      }
    }
  });
});
