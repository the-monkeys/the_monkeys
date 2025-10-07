import { z } from 'zod';

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().optional(),
  address: z.string().max(100).optional(),
  contact_number: z
    .string()
    .regex(/^[0-9]+$/, 'Contact number must be digits only')
    .min(10)
    .max(15)
    .optional(),
  bio: z.string().max(500).optional(),
  date_of_birth: z.string().optional(),
  twitter: z
    .string()
    .max(50)
    .refine((val) => !val || /^[a-zA-Z0-9-_.]+$/.test(val), {
      message: 'Please enter a valid username',
    })
    .optional(),
  linkedin: z
    .string()
    .max(50)
    .refine((val) => !val || /^[a-zA-Z0-9-_.]+$/.test(val), {
      message: 'Please enter a valid username',
    })
    .optional(),
  instagram: z
    .string()
    .max(50)
    .refine((val) => !val || /^[a-zA-Z0-9-_.]+$/.test(val), {
      message: 'Please enter a valid username',
    })
    .optional(),
  github: z
    .string()
    .max(50)
    .refine((val) => !val || /^[a-zA-Z0-9-_.]+$/.test(val), {
      message: 'Please enter a valid username',
    })
    .optional(),
});

export const updateProfileDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  location: z.string().max(100),
  bio: z.string().max(500),
});

export const updateEmailSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
});

export const updateUsername = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters long')
    .max(50, 'Username cannot exceed 50 characters')
    .regex(/^\S+$/, 'Username cannot contain spaces'),
});
