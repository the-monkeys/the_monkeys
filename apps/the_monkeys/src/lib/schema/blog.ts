import { z } from 'zod';

export const blogDetailsSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Preview title is required' : undefined,
    })
    .min(1, 'Preview title is required'),
  subheading: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Preview subheading is required'
          : undefined,
    })
    .min(1, 'Preview subheading is required'),
});

export const getBlogsByTopicSchema = z.object({
  tags: z.array(z.string()),
});
