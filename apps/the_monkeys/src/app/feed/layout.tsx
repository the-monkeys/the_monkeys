import type { ReactNode } from 'react';

import type { Metadata } from 'next';

import { noIndexPage } from '@/lib/seo';

export const metadata: Metadata = noIndexPage('Your following feed | Monkeys');

export default function FollowingFeedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className='min-w-0'>{children}</div>;
}
