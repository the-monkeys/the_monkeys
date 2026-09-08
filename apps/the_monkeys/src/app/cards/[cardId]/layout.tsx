import type { Metadata } from 'next';

import { noIndexPage } from '@/lib/seo';

export const metadata: Metadata = noIndexPage('Edit card');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
