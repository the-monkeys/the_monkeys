import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Editing Blog',
};

const EditPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='min-h-screen px-4 py-2 pb-[500px]'>
      {children}
    </Container>
  );
};

export default EditPageLayout;
