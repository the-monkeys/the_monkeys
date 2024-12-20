import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

const title = 'Authentication';
const description = 'We are The Monkeys! A blogging and educational platform.';

export const metadata: Metadata = {
  title,
  description,
};

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Container className='mb-20 min-h-screen'>{children}</Container>;
};

export default AuthLayout;
