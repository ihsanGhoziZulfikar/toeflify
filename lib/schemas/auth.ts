import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    fullName: z
      .string()
      .min(5, { message: 'Full name must be at least 5 characters long' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: `The passwords didn't match`,
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});
