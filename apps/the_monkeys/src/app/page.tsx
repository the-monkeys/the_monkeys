import Link from 'next/link';

import HomeBanner from '@/components/branding/HomeBanner';
import { LinksSection } from '@/components/branding/LinksSection';
import FeaturesGrid from '@/components/branding/featuresGrid';
import { ContributeAndSponsorCard } from '@/components/branding/sponsor/ContributeAndSponsorCard';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { CREATE_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';

const LandingPage = () => {
  return (
    <div className='min-h-screen space-y-8 pb-10'>
      <Container className='space-y-8'>
        <HomeBanner />

        <h2 className='mx-auto w-fit pt-8 px-4 font-dm_sans text-lg sm:text-xl md:text-2xl text-center leading-7'>
          With Monkeys, create content that truly makes a difference.
        </h2>

        <LinksSection />

        <h2 className='mx-auto w-full sm:w-4/5 pt-[100px] px-4 font-dm_sans font-medium text-2xl sm:text-3xl leading-normal text-center'>
          We are built to empower creativity, collaboration, and meaningful
          storytelling.
        </h2>
      </Container>

      <div className='bg-gradient-to-t from-brand-orange/80 from-[25%] via-brand-orange/20 to-transparent px-4 py-[80px]'>
        <Container>
          <FeaturesGrid />
        </Container>
      </div>

      <Container>
        <div className='py-[40px] sm:py-[80px] px-4 flex flex-col items-center gap-4'>
          <p className='mt-6 text-base sm:text-lg md:text-xl text-center opacity-80'>
            Start your journey today—collaborate, create, and share without
            limits!
          </p>

          <Button
            size='lg'
            variant='brand'
            className='group px-6 rounded-full hover:text-text-dark hover:bg-opacity-100 shadow-md'
            title='Create Post'
            asChild
          >
            <Link href={`${CREATE_ROUTE}`}>
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
      </Container>
    </div>
  );
};

export default LandingPage;
