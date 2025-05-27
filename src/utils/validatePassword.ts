import { z } from 'zod';
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Введите текущий пароль'),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        'Пароль должен быть не менее 8 символов и содержать заглавную букву, строчную и цифру'
      ),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Новый пароль не должен совпадать с текущим',
    path: ['newPassword'],
  });
