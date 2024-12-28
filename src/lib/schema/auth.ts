import { z } from 'zod';

// New Password Criteria
const passwordCriteria = z
  .string({ required_error: 'Password is required' })
  .trim()
  .min(6, 'Password must be at least 6 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter');

const emailCriteria = z
  .string({ required_error: 'Email is required' })
  .trim()
  .min(1, 'Email is required')
  .email('Invalid email');

// Login Schema For Validation
export const loginSchema = z.object({
  email: emailCriteria,
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, 'Password is required'),
});

// Sign Up Schema For Validation
export const signupSchema = z.object({
  first_name: z
    .string({ required_error: 'First Name is required' })
    .trim()
    .min(1, 'First Name is required'),
  last_name: z
    .string({ required_error: 'Last Name is required' })
    .trim()
    .min(1, 'Last Name is required')
    .optional(),
  email: emailCriteria,
  password: passwordCriteria,
});

export const registerUserSchema = z
  .object({
    first_name: z
      .string({ required_error: 'First Name is required' })
      .min(1, 'First Name is required'),
    last_name: z
      .string({ required_error: 'Last Name is required' })
      .min(1, 'Last Name is required')
      .optional(),
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email'),
    password: passwordCriteria,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password does not match',
  });

// Forgot Passowrd Schema For Validation
export const forgotPasswordSchema = z.object({
  email: emailCriteria,
});

export const resetPasswordSchema = z
  .object({
    password: passwordCriteria,
    confirmPassword: passwordCriteria,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Update Password Schema For Validation
export const updatePasswordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'Current Password is required' })
      .trim()
      .min(1, 'Current Password is required'),
    password: passwordCriteria,
    confirmPassword: passwordCriteria,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.password !== data.currentPassword, {
    message: 'New password must be different from the current password',
    path: ['password'],
  });

// Registration Schema For Validation
export const registrationSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, 'First Name is required')
    .max(25, 'First Name Should not be more than 25 Characters')
    .refine(
      (value) => /^[a-zA-Z]+$/.test(value ?? ''),
      'First Name should contain only alphabets'
    ),
  last_name: z
    .string()
    .trim()
    .max(25, 'Last Name Should not be more than 25 Characters')
    .min(1, 'Last Name is required')
    .refine(
      (value) => /^[a-zA-Z]+$/.test(value ?? ''),
      'Last Name should contain only alphabets'
    ),
  email: emailCriteria,
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
});
