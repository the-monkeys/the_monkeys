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
    <div className='min-h-[800px] space-y-[130px]'>
      <div className='px-4 py-6 sm:py-8 bg-brand-orange'>
        <Container className='px-4 sm:px-6 py-4 -mb-[100px] max-w-7xl bg-background-light dark:bg-background-dark shadow-sm border-b-1 border-brand-orange'>
          <ProfileSection />
        </Container>
      </div>

      <Container className='px-4'>{children}</Container>
    </div>
  );
};

export default ProfilePageLayout;
