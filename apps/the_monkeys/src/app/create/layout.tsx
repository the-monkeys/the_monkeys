import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Creating',
};

const CreatePageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Container className='px-4 pb-12'>{children}</Container>;
};

export default CreatePageLayout;
