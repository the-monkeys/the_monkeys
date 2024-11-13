import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

const title = 'Create';
const description = 'We are The Monkeys! A blogging and educational platform.';

export const metadata: Metadata = {
  title,
  description,
};

export default function CreatePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className='min-h-screen px-5 py-4 pb-12'>{children}</Container>
  );
}
