import HomeBanner from '@/components/branding/HomeBanner';
import FeaturesGrid from '@/components/branding/featuresGrid';
import Container from '@/components/layout/Container';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

const LandingPage = () => {
  return (
    <Container className='min-h-screen px-5 py-4 pb-12'>
      <div className='flex justify-center sm:justify-end'>
        <LinksRedirectArrow
          link='/news'
          title='News by Monkeys'
          position='Right'
          className='text-sm'
        />
      </div>

      <HomeBanner />

      <FeaturesGrid />
    </Container>
  );
};

export default LandingPage;
