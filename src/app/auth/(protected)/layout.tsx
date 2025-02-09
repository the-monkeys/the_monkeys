import { Suspense } from 'react';

import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

import Protected from './protected';

const title = 'Authentication';
const description = 'We are The Monkeys! A blogging and educational platform.';

export const metadata: Metadata = {
  title,
  description,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <Protected />
      <Container className='mb-20'>{children}</Container>
    </Suspense>
  );
}
