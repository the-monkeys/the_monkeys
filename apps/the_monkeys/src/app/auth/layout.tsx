import type { Metadata } from 'next';

import { BackgroundBanner } from '@/components/branding/BackgroundBanner';
import Container from '@/components/layout/Container';
import Logo from '@/components/logo';

const title = 'Authentication';
const description =
  'Welcome to Monkeys — a platform for curious minds to explore, share, and grow through writing and learning';

export const metadata: Metadata = {
  title,
  description,
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className='p-4 max-w-4xl min-h-[800px] space-y-2'>
      <div className='relative h-[120px] w-full flex items-center justify-center'>
        <div className='absolute top-0 left-0 h-full w-full -z-10 opacity-80'>
          <BackgroundBanner />
        </div>

        <div className='size-12 drop-shadow-sm'>
          <Logo />
        </div>
      </div>

      <div className='mx-auto max-w-lg flex-1 h-full w-full flex flex-col gap-4'>
        {children}
      </div>
    </Container>
  );
}
