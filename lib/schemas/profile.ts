import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(5, 'Full name must be at least 5 characters')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
  imageUrl: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});
