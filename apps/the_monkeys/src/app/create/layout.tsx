import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Create Post',
};

const CreatePageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Container className='px-4 pb-12 max-w-5xl'>{children}</Container>;
};

export default CreatePageLayout;
