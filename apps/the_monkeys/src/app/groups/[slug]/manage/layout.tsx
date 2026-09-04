import type { Metadata } from 'next';

import { noIndexPage } from '@/lib/seo';

export const metadata: Metadata = noIndexPage('Manage group');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
