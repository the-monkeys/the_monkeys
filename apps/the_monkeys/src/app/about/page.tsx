import { Metadata } from 'next';
import Link from 'next/link';

import { BackgroundWaves } from '@/components/branding/BackgroundWaves';
import FeaturesGrid from '@/components/branding/featuresGrid';
import MembersGrid from '@/components/branding/membersGrid';
import { StartWritingButton } from '@/components/buttons/StartWritingButton';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { HOME_ROUTE } from '@/constants/routeConstants';
import {
  LEGAL_PUBLISHER_ID,
  MONKEYS_BRAND_ID,
  MONKEYS_WEBSITE_ID,
  absoluteUrl,
  pageMetadata,
} from '@/lib/seo';
import { Button } from '@the-monkeys/ui/atoms/button';

export const metadata: Metadata = pageMetadata({
  title: 'About Monkeys | Content and Community Platform',
  description:
    'Learn how Monkeys connects thoughtful posts, topics, authors, groups, and community-led events in one platform operated by Buddhicintaka (OPC) Pvt. Ltd.',
  path: '/about',
  keywords: [
    'about monkeys',
    'content and community platform',
    'community posts',
    'events and groups',
    'authors and topics',
  ],
});

const AboutPage = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${absoluteUrl('/about')}#about`,
    name: 'About Monkeys',
    description:
      'Monkeys is a content and community platform for posts, topics, authors, groups, and events.',
    url: absoluteUrl('/about'),
    about: { '@id': MONKEYS_BRAND_ID },
    isPartOf: { '@id': MONKEYS_WEBSITE_ID },
    publisher: { '@id': LEGAL_PUBLISHER_ID },
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className='max-w-4xl space-y-10'>
        <div className='relative pt-16 flex flex-col items-center gap-2'>
          <h1 className='p-2 font-dm_sans font-medium text-4xl md:text-5xl text-center animate-appear-up'>
            Inspire
            <span className='text-brand-orange'>.</span> Inform
            <span className='text-brand-orange'>.</span> Innovate
            <span className='text-brand-orange'>.</span>
          </h1>

          <p className='pt-3 text-base md:text-lg text-center tracking-tight'>
            Monkeys is a{' '}
            <span className='font-semibold'>
              content and community platform
            </span>{' '}
            where people publish thoughtful posts, explore topics, join
            interest-based groups, and meet through community-led events.
          </p>

          <div className='p-6 flex flex-col sm:flex-row justify-center items-center gap-4'>
            <StartWritingButton
              variant='brand'
              size='lg'
              className='group rounded-full hover:!bg-background-light dark:hover:!bg-background-dark'
            />

            <Button
              size='lg'
              className='group rounded-full hover:!bg-background-light dark:hover:!bg-background-dark'
              asChild
            >
              <Link href={HOME_ROUTE}>
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

        <div className='py-10 space-y-10'>
          <div className='py-8 flex flex-col items-center gap-4'>
            <h2 className='pb-3 font-dm_sans font-semibold text-4xl md:text-5xl text-center'>
              Connecting{' '}
              <span className='font-dm_sans text-brand-orange tracking-tight'>
                Content and Community
              </span>
            </h2>

            <p className='text-base md:text-lg text-center'>
              Publishing tools help authors create thoughtful posts and social
              snapshots. Topics, groups, and events help people discover ideas,
              build communities, and continue the conversation together.
            </p>
          </div>

          <div className='flex justify-center items-center gap-2 mt-6'>
            <div className='w-12 h-[2px] bg-gradient-to-r from-transparent to-border-light dark:to-border-dark'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange/60'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange/60'></div>
            <div className='w-12 h-[2px] bg-gradient-to-l from-transparent to-border-light dark:to-border-dark'></div>
          </div>

          <FeaturesGrid />
        </div>

        <div className='py-10 space-y-10'>
          <div className='py-8 flex flex-col items-center gap-4'>
            <h5 className='pb-3 font-dm_sans font-semibold text-4xl md:text-5xl text-center'>
              The People Behind{' '}
              <span className='font-dm_sans text-brand-orange tracking-tight'>
                Monkeys
              </span>
            </h5>

            <p className='text-base md:text-lg text-center'>
              Meet the{' '}
              <span className='font-semibold'>passionate innovators</span>,{' '}
              <span className='font-semibold'>storytellers</span>, and{' '}
              <span className='font-semibold'>builders</span>, who are shaping
              the future of thoughtful content, community discovery, and
              meaningful participation.
            </p>
          </div>

          <div className='flex justify-center items-center gap-2 mt-6'>
            <div className='w-12 h-[2px] bg-gradient-to-r from-transparent to-border-light dark:to-border-dark'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange/60'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange'></div>
            <div className='w-2 h-2 rounded-full bg-brand-orange/60'></div>
            <div className='w-12 h-[2px] bg-gradient-to-l from-transparent to-border-light dark:to-border-dark'></div>
          </div>

          <MembersGrid />
        </div>

        <div className='py-10 space-y-10'>
          <div className='relative p-6 bg-brand-orange/20 border-1 border-brand-orange rounded-xl'>
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <div className='px-6 py-2 bg-brand-orange text-white font-dm_sans font-medium text-lg shadow-lg rounded-full text-center'>
                Community
              </div>
            </div>

            <div className='py-8 flex flex-col items-center gap-4'>
              <h5 className='pb-3 font-dm_sans font-semibold text-2xl text-center'>
                Powered by Our Amazing{' '}
                <span className='font-dm_sans text-brand-orange tracking-tight'>
                  Community
                </span>
              </h5>

              <p className='text-base md:text-lg text-center'>
                Behind every <span className='font-medium'>feature</span>,{' '}
                <span className='font-medium'>improvement</span>, and{' '}
                <span className='font-medium'>innovation</span> are the
                incredible contributors who believe in our mission. From{' '}
                <span className='font-medium'>code contributions</span>, to{' '}
                <span className='font-medium'>bug reports</span>, from{' '}
                <span className='font-medium'>feature ideas</span>, to{' '}
                <span className='font-medium'>feedback</span>, you make Monkeys
                what it is.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AboutPage;
