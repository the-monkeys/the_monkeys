import { z } from 'zod';

export const blogDetailsSchema = z.object({
  title: z
    .string({ required_error: 'Preview title is required' })
    .min(1, 'Preview title is required'),
  subheading: z
    .string({ required_error: 'Preview subheading is required' })
    .min(1, 'Preview subheading is required'),
});
