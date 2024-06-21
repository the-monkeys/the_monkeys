'use client';

import HomeBanner from '@/components/branding/HomeBanner';
import Grid from '@/components/branding/featuresGrid/Grid';
import Container from '@/components/layout/Container';

const LandingPage = () => {
  return (
    <Container className='min-h-screen px-5 py-4 pb-12 space-y-4'>
      <HomeBanner />

      <Grid />
    </Container>
  );
};

export default LandingPage;
