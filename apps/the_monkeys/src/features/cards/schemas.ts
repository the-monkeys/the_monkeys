import { z } from 'zod';

const socialLinkSchema = z.object({
  network: z.enum([
    'linkedin',
    'x',
    'github',
    'dribbble',
    'behance',
    'instagram',
    'facebook',
    'youtube',
    'medium',
    'monkeys',
    'website',
  ]),
  url: z.url(),
});

export const cardContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  jobTitle: z.string().max(80).optional(),
  department: z.string().max(60).optional(),
  company: z.string().max(80).optional(),
  email: z.email().max(120).optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  website: z.url().max(200).optional().or(z.literal('')),
  address: z.string().max(200).optional(),
});

export const cardInputSchema = z.object({
  contact: cardContactSchema,
  socialLinks: z.array(socialLinkSchema).max(8),
  avatarUrl: z.string().optional(),
  logoUrl: z.string().optional(),
});

export type CardContactParsed = z.infer<typeof cardContactSchema>;
export type CardInputParsed = z.infer<typeof cardInputSchema>;
