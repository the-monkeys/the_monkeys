import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { Separator } from '@/components/ui/separator';

import ProfileSection from './components/ProfileSection';

const title = 'Profile';
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
    <Container className='grid grid-cols-3 gap-6 px-5 py-4 pb-12'>
      <div className='col-span-3 md:col-span-1'>
        <ProfileSection />
      </div>

      <div className='col-span-3 md:col-span-2'>{children}</div>
    </Container>
  );
}
