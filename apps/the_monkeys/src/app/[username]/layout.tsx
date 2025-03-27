import { Metadata } from 'next';

import Container from '@/components/layout/Container';

import { ProfileSection } from './components/profile/ProfileSection';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `@${username}`,
  };
}

const ProfilePageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='grid grid-cols-3 gap-8 md:gap-6 px-4 py-4 pb-12'>
      <div className='col-span-3 md:col-span-1'>
        <ProfileSection />
      </div>

      <div className='col-span-3 md:col-span-2'>{children}</div>
    </Container>
  );
};

export default ProfilePageLayout;
