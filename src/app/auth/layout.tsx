import type { Metadata } from 'next';

import { BackgroundBanner } from '@/components/branding/BackgroundBanner';

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
  return (
    <div className='relative py-16 sm:py-20 mb-10'>
      <div className='absolute top-0 left-0 w-full h-full -z-10'>
        <BackgroundBanner />
      </div>

      <div className='mx-auto max-w-lg px-4 sm:px-6 py-6 rounded-2xl shadow-sm bg-background-light dark:bg-background-dark space-y-10'>
        {children}
      </div>
    </div>
  );
}
