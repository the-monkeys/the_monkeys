import type { Metadata } from 'next';

import { noIndexPage } from '@/lib/seo';

export const metadata: Metadata = noIndexPage('Group members | Monkeys');

export default function GroupMembersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
