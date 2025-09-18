import Link from 'next/link';

import { BackgroundWaves } from '@/components/branding/BackgroundWaves';
import FeaturesGrid from '@/components/branding/featuresGrid';
import MembersGrid from '@/components/branding/membersGrid';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { CREATE_ROUTE, FEED_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';

const AboutPage = () => {
  return (
    <>
      <Container className='max-w-4xl space-y-10'>
        <div className='relative py-12 flex flex-col items-center gap-2'>
          <h4 className='p-2 font-dm_sans font-medium text-4xl md:text-5xl text-center animate-appear-up'>
            Inspire
            <span className='text-brand-orange'>.</span> Inform
            <span className='text-brand-orange'>.</span> Innovate
            <span className='text-brand-orange'>.</span>
          </h4>

          <p className='pt-3 text-sm md:text-base text-center tracking-tight'>
            Monkeys is a platform for writers, creators, and thinkers to share
            stories that inspire, inform, and spark innovation — a space to
            collaborate, learn, and make an impact through meaningful
            storytelling.
          </p>

          <div className='p-6 flex flex-col sm:flex-row justify-center items-center gap-4'>
            <Button
              variant='brand'
              size='lg'
              className='group rounded-full hover:!bg-background-light dark:hover:!bg-background-dark'
              asChild
            >
              <Link href={CREATE_ROUTE}>
                <Icon
                  name='RiPencil'
                  className='mr-[6px] group-hover:animate-icon-shake opacity-90'
                />{' '}
                Start Writing
              </Link>
            </Button>

            <Button
              size='lg'
              className='group rounded-full hover:!bg-background-light dark:hover:!bg-background-dark'
              asChild
            >
              <Link href={FEED_ROUTE}>
                <Icon
                  name='RiSearch'
                  className='mr-[6px] group-hover:animate-icon-shake opacity-90'
                />{' '}
                Explore Content
              </Link>
            </Button>
          </div>

          <div className='absolute top-0 left-0 w-full h-full -z-10 opacity-80'>
            <BackgroundWaves />
          </div>
        </div>

        <div className='py-8 flex flex-col items-center gap-3'>
          <h5 className='pb-3 font-dm_sans font-semibold text-3xl text-center'>
            Evolving Together
          </h5>

          <p className='text-sm md:text-base text-center'>
            At Monkeys, we&apos;re more than just a writing platform. With{' '}
            <span className='font-medium'>collaborative writing</span>,{' '}
            <span className='font-medium'>AI integration</span>,{' '}
            <span className='font-medium'>version control</span>, and{' '}
            <span className='font-medium'>social snapshots</span>, we&apos;ve
            set the stage for meaningful storytelling — and we continue to
            evolve through community contributions.
          </p>
        </div>
      </Container>

      <Container className='max-w-3xl'>
        <FeaturesGrid />
      </Container>

      <Container className='max-w-4xl py-8 space-y-10'>
        <div className='py-12 flex flex-col items-center gap-6'>
          <div className='text-center space-y-4'>
            <h5 className='font-dm_sans font-bold text-4xl md:text-5xl tracking-tight animate-appear-up'>
              The People Behind{' '}
              <span className='relative inline-block'>
                <span className='font-dm_sans text-brand-orange tracking-tight bg-gradient-to-r from-brand-orange to-orange-400 bg-clip-text text-transparent'>
                  Monkeys
                </span>
                <div className='absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-brand-orange/20 to-orange-400/20 rounded-full'></div>
              </span>
            </h5>

            <p className='text-base md:text-lg text-center max-w-2xl mx-auto leading-relaxed text-text-light dark:text-text-dark opacity-90'>
              Meet the passionate innovators, storytellers, and builders who are
              shaping the future of collaborative writing and meaningful content
              creation.
            </p>
          </div>

          <div className='flex items-center gap-2 mt-6'>
            <div className='w-12 h-[1px] bg-gradient-to-r from-transparent to-border-light dark:to-border-dark'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange/60'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange/40'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange/20'></div>
            <div className='w-12 h-[1px] bg-gradient-to-l from-transparent to-border-light dark:to-border-dark'></div>
          </div>
        </div>

        <MembersGrid />
      </Container>
    </>
  );
};

export default AboutPage;
