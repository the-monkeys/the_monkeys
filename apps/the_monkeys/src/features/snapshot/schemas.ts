import { z } from 'zod';

export const snapshotAuthorSchema = z.object({
  username: z.string().min(1),
  displayName: z.string().min(1),
  avatarUrl: z.string().url().optional(),
});

export const snapshotInputSchema = z.object({
  source: z.enum(['blog', 'meta-blog', 'url', 'tweet', 'manual']),
  sourceId: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  title: z.string().min(1).max(240),
  category: z.string().max(48).optional(),
  description: z.string().max(1200).optional(),
  quote: z.string().max(280).optional(),
  heroImageUrl: z.string().url().optional(),
  backgroundImageUrl: z.string().optional(),
  backgroundOverlay: z.number().min(0).max(1).optional(),
  tags: z.array(z.string().min(1).max(40)).max(10).optional(),
  author: snapshotAuthorSchema.optional(),
  publishedAt: z.string().optional(),
  readingTimeMin: z.number().int().nonnegative().optional(),
});

export type SnapshotInputParsed = z.infer<typeof snapshotInputSchema>;
