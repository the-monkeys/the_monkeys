'use client';

import HomeBanner from '@/components/branding/HomeBanner';
import FeaturesGrid from '@/components/branding/featuresGrid';
import Container from '@/components/layout/Container';

const LandingPage = () => {
  return (
    <Container className='min-h-screen px-5 py-4 pb-12'>
      <HomeBanner />

      <FeaturesGrid />
    </Container>
  );
};

export default LandingPage;
