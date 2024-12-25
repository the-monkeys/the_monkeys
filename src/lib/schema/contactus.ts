import { z } from 'zod';

export const contactUsSchema = z.object({
  full_name: z
    .string({ required_error: 'Full name is required' })
    .min(3)
    .max(128)
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  message: z.string({ required_error: 'Message is required' }).trim(),
});
