import { z } from 'zod';

export const contactFormSchema = z.object({
  'first-name': z.string().min(1, 'First name is required'),
  'last-name': z.string().min(1, 'Last name is required'),
  'company-name': z.string().optional(),
  message: z.string().optional(),

  email: z.string().email('Invalid email address'),

  'company-size': z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),

  'captcha-field': z.string(),
  'captcha-field-value': z.string().min(1, 'Captcha answer is required'),
});

export type ContactFormInputs = z.infer<typeof contactFormSchema>;
