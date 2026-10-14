import type { Metadata } from 'next';

import { CARDS_SEO, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(CARDS_SEO);

export default function CardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
