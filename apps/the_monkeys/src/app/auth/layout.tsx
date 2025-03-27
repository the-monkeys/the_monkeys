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
    <div className='min-h-screen'>
      <div className='relative py-16 sm:py-20 mb-10 space-y-3'>
        <div className='absolute top-0 left-0 w-full h-full -z-10'>
          <BackgroundBanner />
        </div>

        <div className='mx-auto max-w-lg px-4 sm:px-6 py-6 rounded-2xl shadow-2xl shadow-brand-orange/25 bg-background-light dark:bg-background-dark space-y-8'>
          {children}
        </div>
      </div>
    </div>
  );
}
