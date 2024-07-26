import HomeBanner from '@/components/branding/HomeBanner';
import FeaturesGrid from '@/components/branding/featuresGrid';
import Container from '@/components/layout/Container';

const LandingPage = () => {
  return (
    <Container className='relative min-h-screen px-5 py-4 pb-12'>
      <HomeBanner />

      <h2 className='my-16 sm:my-20 px-4 font-playfair_Display text-3xl md:text-5xl text-secondary-darkGrey dark:text-secondary-white text-center'>
        <span className='text-primary-monkeyOrange italic'>Create</span> content
        <br />
        that makes a{' '}
        <span className='text-primary-monkeyOrange italic'>difference</span>.
      </h2>

      <FeaturesGrid />

      <p className='my-16 sm:my-20 px-4 font-playfair_Display font-medium text-2xl sm:text-3xl text-center'>
        Coming Soon !!
        <br />
        Get Ready to Discover, Write & Inspire
      </p>
    </Container>
  );
};

export default LandingPage;
