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
      birthday: '2015-01-01', // младше 14 лет
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

        expect(messages).toContain('Введите имя пользователя');
        expect(messages).toContain('Введите фамилию');
        expect(messages).toContain('Введите корректный email');
        expect(messages).toContain(
          'Пароль должен быть не менее 8 символов и содержать заглавную букву, строчную и цифру'
        );
        expect(messages).toContain('Пользователю должно быть больше 14 лет');
        expect(messages).toContain('Введите улицу');
        expect(messages).toContain('Город не должен содержать цифры или спецсимволы');
        expect(messages).toContain('Недопустимая страна');
        expect(messages).toContain('Выберите страну');
      } else {
        throw e;
      }
    }
  });
});
