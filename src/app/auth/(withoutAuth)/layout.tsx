import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Container from '@/components/layout/Container';

const title = 'Authentication';
const description = 'We are The Monkeys! A blogging and educational platform.';

export const metadata: Metadata = {
  title,
  description,
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  if (cookieStore.get('mat')) {
    redirect('/');
  }

  return <Container className='mb-20'>{children}</Container>;
}
