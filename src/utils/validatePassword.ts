import { z } from 'zod';
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        'The password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.'
      ),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'The new password must not match the current one.',
    path: ['newPassword'],
  });
