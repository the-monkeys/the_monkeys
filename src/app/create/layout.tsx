import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

const title = 'Create / Monkeys';
const description = 'We are The Monkeys! A blogging and educational platform.';

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className='pt-4 mb-20 min-h-screen sm:w-4/5 mx-auto w-full'>
      {children}
    </Container>
  );
}
