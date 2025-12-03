import { z } from 'zod';

export const contactFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company_size: z.string().optional(),
  company_name: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().optional(),
});

export type contactFormSchema = z.infer<typeof contactFormSchema>;
