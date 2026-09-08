import type { Metadata } from 'next';

import { noIndexPage } from '@/lib/seo';

export const metadata: Metadata = noIndexPage('Manage event');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
