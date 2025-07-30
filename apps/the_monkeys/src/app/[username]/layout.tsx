import { Metadata } from 'next';

import Container from '@/components/layout/Container';

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
    <Container className='px-4 py-6 min-h-[800px] space-y-10'>
      {children}
    </Container>
  );
};

export default ProfilePageLayout;
