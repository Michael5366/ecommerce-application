import { z } from 'zod';

const postalCodeRegex = {
  US: /^\d{5}(-\d{4})?$/,
  FR: /^\d{5}$/,
  ES: /^\d{5}$/,
};

const addressSchema = z.object({
  streetName: z.string().min(1, 'Введите улицу'),
  city: z
    .string()
    .min(1, 'Введите город')
    .regex(/^[А-Яа-яЁёA-Za-z\s\-]+$/, 'Город не должен содержать цифры или спецсимволы'),
  postalCode: z
    .string()
    .min(1, 'Введите индекс'),
  country: z
    .string()
    .min(1, 'Выберите страну')
    .refine((val) => ['US', 'FR', 'ES'].includes(val), {
      message: 'Недопустимая страна',
    }),
  defaultShippingAddress: z.boolean().optional(),
  defaultBillingAddress: z.boolean().optional(),
}).superRefine((data, ctx) => {
  const pattern = postalCodeRegex[data.country as keyof typeof postalCodeRegex];

  if (pattern && !pattern.test(data.postalCode)) {
    ctx.addIssue({code: z.ZodIssueCode.custom,
      path: ['postalCode'],
      message:
        data.country === 'US'
          ? 'Индекс должен быть в формате 12345 или 12345-6789'
          : 'Индекс должен состоять из 5 цифр',
    });
  }
});

export const registrationSchema = z.object({
  username: z
    .string()
    .min(1, 'Введите имя пользователя')
    .regex(/^[А-Яа-яЁёA-Za-z]+$/, 'Имя должно содержать только буквы'),

  surname: z
    .string()
    .min(1, 'Введите фамилию')
    .regex(/^[А-Яа-яЁёA-Za-z]+$/, 'Фамилия должна содержать только буквы'),

  email: z
    .string()
    .email('Введите корректный email'),

  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'Пароль должен быть не менее 8 символов и содержать заглавную букву, строчную и цифру'
    ),

  birthday: z
    .string()
    .refine((val) => {
      const birthDate = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      return age > 14 || (age === 14 && month >= 0);
    }, {
      message: 'Пользователю должно быть больше 14 лет',
    }),

  shippingAddress: addressSchema,
  billingAddress: addressSchema,
});