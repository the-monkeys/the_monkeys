import Link from 'next/link';

import HomeBanner from '@/components/branding/HomeBanner';
import FeaturesGrid from '@/components/branding/featuresGrid';
import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

const LandingPage = () => {
  return (
    <Container className='relative min-h-screen px-5 py-4 pb-12'>
      <HomeBanner />

      <div className='mt-10 md:mt-16 mb-4 flex justify-center sm:justify-end'>
        <LinksRedirectArrow link='/news' position='Right'>
          <p className='font-josefin_Sans font-semibold'>
            <span className='text-primary-monkeyOrange'>News</span> by Monkeys
          </p>
        </LinksRedirectArrow>
      </div>

      <FeaturesGrid />
    </Container>
  );
};

export default LandingPage;
