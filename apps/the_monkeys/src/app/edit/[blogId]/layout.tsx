import type { Metadata } from 'next';

import Container from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'Editing',
};

const EditPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Container className='px-4 pb-12'>{children}</Container>;
};

export default EditPageLayout;
