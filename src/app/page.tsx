import Link from 'next/link';

import HomeBanner from '@/components/branding/HomeBanner';
import { LinksSection } from '@/components/branding/LinksSection';
import FeaturesGrid from '@/components/branding/featuresGrid';
import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <Container className='min-h-screen space-y-8 sm:space-y-10 pb-12'>
      <HomeBanner />

      <h2 className='mx-auto w-fit pt-8 px-4 font-dm_sans text-lg sm:text-xl md:text-2xl text-center leading-7'>
        With Monkeys,{' '}
        <span className='px-1 bg-foreground-light dark:bg-foreground-dark'>
          create content
        </span>{' '}
        that truly makes a difference.
      </h2>

      <LinksSection />

      <h2 className='mx-auto w-full sm:w-4/5 pt-[150px] sm:pt[200px] px-4 font-arvo text-2xl sm:text-3xl md:text-4xl text-center'>
        We are built to empower creativity, collaboration, and meaningful
        storytelling.
      </h2>

      <div className='bg-gradient-to-t from-brand-orange from-[25%] px-4 py-[80px]'>
        <FeaturesGrid />
      </div>

      <div className='py-[40px] sm:py-[80px] px-4 flex flex-col items-center gap-4'>
        <p className='mt-6 font-dm_sans font-light text-base sm:text-lg md:text-xl text-center opacity-80'>
          Start your blogging journey today—collaborate, create, and share
          without limits!
        </p>

        <Button size='lg' className='group px-6 rounded-full shadow-md' asChild>
          <Link href='/create' title='Create'>
            <div>
              <Icon
                name='RiPencil'
                className='mr-2 group-hover:animate-icon-shake'
              />
            </div>
            <p className='font-dm_sans'>Start Writing</p>
          </Link>
        </Button>
      </div>

      <ContributeAndSponsorCard className='mx-auto max-w-xl' />
    </Container>
  );
};

export default LandingPage;
