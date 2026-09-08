import type { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Snapshot Studio | Turn Research into Social Images',
  description:
    'Generate share-ready Instagram templates, quote cards, and X screenshots from your research and writing. Free in Monkeys Studio.',
  path: '/snapshot',
  keywords: [
    'snapshot studio',
    'research social images',
    'instagram templates',
    'twitter screenshot',
  ],
});

export default function SnapshotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
