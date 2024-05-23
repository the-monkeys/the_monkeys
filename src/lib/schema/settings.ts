import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  location: z.string().max(100),
  contactNumber: z
    .string()
    .regex(/^[0-9]+$/, 'Contact number must be digits only')
    .min(10)
    .max(15),
  bio: z.string().max(500),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
  twitterProfile: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
  github: z.string().url().optional(),
});

export const updateEmailSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
});
export const updateUsername = z.object({
  username: z.string().min(2).max(50),
});
