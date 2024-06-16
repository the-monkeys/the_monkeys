'use client';

import { useRouter } from 'next/navigation';

import HomeBanner from '@/components/branding/HomeBanner';
import BentoGrid from '@/components/branding/grid';
import MobileGrid from '@/components/branding/grid/MobileGrid';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';

const LandingPage = () => {
  const router = useRouter();

  return (
    <Container className='mb-8 min-h-screen flex flex-col'>
      <HomeBanner>
        <p className='font-playfair_Display font-semibold text-5xl sm:text-7xl md:text-8xl text-primary-monkeyBlack dark:text-primary-monkeyWhite'>
          Create. Collaborate.
        </p>

        <p className='mt-4 sm:mt-8 md:w-4/5 font-josefin_Sans text-base sm:text-lg md:text-xl text-center text-secondary-darkGrey dark:text-secondary-white'>
          A platform for writing and creative collaboration, empowering
          individuals to expand their influence and showcase talents.
        </p>

        <button
          className='mt-4 group px-5 py-2 flex items-center bg-primary-monkeyOrange text-primary-monkeyWhite rounded-full'
          onClick={() => {
            router.push('api/auth/signin');
          }}
        >
          <p className='mx-1 font-josefin_Sans'>Join Monkeys</p>

          <Icon
            name='RiArrowRight'
            size={16}
            className='mx-1 transition-all group-hover:ml-2 group-hover:mr-0'
          />
        </button>
      </HomeBanner>

      <BentoGrid />

      <MobileGrid />
    </Container>
  );
};

export default LandingPage;
