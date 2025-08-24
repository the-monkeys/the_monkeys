import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Settings',
    description:
      'Manage your Monkeys account settings, preferences, and profile to personalize your creative publishing experience.',
  };
}

const SettingsPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 min-h-[800px] max-w-5xl md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Settings' className='self-start' />
        <PageSubheading
          subheading='Customize your experience and manage your account settings.'
          className='self-start'
        />
      </PageHeader>

      {children}
    </Container>
  );
};

export default SettingsPageLayout;
