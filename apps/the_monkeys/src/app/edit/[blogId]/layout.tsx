import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { noIndexRobots } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Edit Post',
  robots: noIndexRobots,
};

const EditPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Container className='px-4 pb-12 max-w-5xl'>{children}</Container>;
};

export default EditPageLayout;
