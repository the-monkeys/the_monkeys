import { normalizeSeoText } from '@/lib/seo';
import type { MetaBlog } from '@/services/blog/blogTypes';

const developerTopics = new Set([
  'programming',
  'computer programming',
  'software development',
  'software engineering',
  'web development',
  'backend development',
  'frontend development',
  'javascript',
  'typescript',
  'python',
  'go',
  'golang',
  'react',
  'reactjs',
  'next.js',
  'nextjs',
  'node.js',
  'nodejs',
  'databases',
  'database',
  'sql',
  'postgresql',
  'redis',
  'docker',
  'kubernetes',
  'devops',
  'software testing',
  'data structures',
  'algorithms',
]);

// Specific technology names also recover relevant posts with broad legacy tags.
// Avoid ambiguous words such as "go" and "react" in unstructured headlines.
const developerTitle =
  /\b(?:python|javascript|typescript|golang|postgresql|kubernetes|next\.?js|node\.?js|database indexes|unit testing)\b/i;

/** Only call with the public catalog, never an account or group feed. */
export function selectDeveloperLearningPosts(
  posts: readonly (MetaBlog & { is_draft?: boolean; visibility?: string })[]
): MetaBlog[] {
  const selected: MetaBlog[] = [];
  const seen = new Set<string>();

  for (const post of posts) {
    if (
      !post ||
      (post.audience !== undefined && post.audience !== 'public') ||
      post.group_slug ||
      post.is_draft ||
      (post.visibility !== undefined && post.visibility !== 'public') ||
      typeof post.blog_id !== 'string' ||
      !post.blog_id.trim() ||
      typeof post.title !== 'string'
    ) {
      continue;
    }

    const title = normalizeSeoText(post.title, post.title.length);
    const matchesTag =
      Array.isArray(post.tags) &&
      post.tags.some(
        (tag) =>
          typeof tag === 'string' &&
          developerTopics.has(tag.trim().toLowerCase())
      );
    if (
      !title ||
      (!matchesTag && !developerTitle.test(title)) ||
      seen.has(post.blog_id)
    ) {
      continue;
    }

    seen.add(post.blog_id);
    selected.push(post);
    if (selected.length === 12) break;
  }

  return selected;
}
