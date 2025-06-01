import { z } from 'zod';

const postalCodeRegex = {
  US: /^\d{5}(-\d{4})?$/,
  FR: /^\d{5}$/,
  ES: /^\d{5}$/,
};

export const addressSchema = z
  .object({
    streetName: z.string().trim().min(1, 'Enter the street'),
    city: z
      .string()
      .trim()
      .min(1, 'Enter the city')
      .regex(/^[А-Яа-яЁёA-Za-z\s\-]+$/, 'The city must not contain numbers or special characters.'),
    postalCode: z.string().trim().min(1, 'Enter the index'),
    country: z
      .string()
      .trim()
      .min(1, 'Select a country')
      .refine((val) => ['US', 'FR', 'ES'].includes(val), {
        message: 'An unacceptable country',
      }),
    defaultShippingAddress: z.boolean().optional(),
    defaultBillingAddress: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const pattern = postalCodeRegex[data.country as keyof typeof postalCodeRegex];

    if (pattern && !pattern.test(data.postalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['postalCode'],
        message:
          data.country === 'US'
            ? 'The index should be in the format 12345 or 12345-6789.'
            : 'The index must consist of 5 digits.',
      });
    }
  });

export const registrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Enter the first name')
    .regex(/^[А-Яа-яЁёA-Za-z]+$/, 'The name must contain only letters.'),

  surname: z
    .string()
    .trim()
    .min(1, 'Enter the last name')
    .regex(/^[А-Яа-яЁёA-Za-z]+$/, 'The last name must contain only letters.'),

  email: z.string().trim().email('Enter the correct email address'),

  password: z
    .string()
    .trim()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      'The password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.'
    ),

  birthday: z.string().refine(
    (val) => {
      const birthDate = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      return age > 14 || (age === 14 && month >= 0);
    },
    {
      message: 'The user must be over 14 years old',
    }
  ),

  shippingAddress: addressSchema,
  billingAddress: addressSchema,
});
