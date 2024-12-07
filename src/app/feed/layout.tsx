import type { Metadata } from 'next';
import Link from 'next/link';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { SearchInput } from '@/components/search/SearchInput';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Notifications',
};

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='grid grid-cols-3 gap-4 px-5 py-4 pb-12 min-h-screen'>
      <div className='col-span-3 md:col-span-2'>{children}</div>

      <div className='col-span-3 md:col-span-1'>
        <SearchInput />

        <div className='mt-4 p-4 border-1 border-foreground-light dark:border-foreground-dark rounded-lg sm:rounded-xl space-y-2'>
          <h2 className='py-2 font-dm_sans font-medium text-lg sm:text-xl text-center'>
            Your support matters!
          </h2>

          <p className='py-1 font-roboto font-light text-sm sm:text-base opacity-80'>
            <b>Contribute</b> ideas or code, or <b>sponsor</b> us to help drive
            growth and impact.
          </p>

          <div className='flex gap-1 flex-wrap'>
            <Button
              variant='ghost'
              className='flex-1 rounded-full hover:bg-blue-500/25 dark:hover:bg-blue-500/25'
              asChild
            >
              <Link
                href='https://github.com/the-monkeys/the_monkeys'
                target='_blank'
              >
                <Icon name='RiCodeSSlash' className='mr-2 text-blue-500' />
                Contribute
              </Link>
            </Button>

            <Button
              variant='ghost'
              className='flex-1 rounded-full hover:bg-pink-500/25 dark:hover:bg-pink-500/25'
              asChild
            >
              <Link
                href='https://github.com/sponsors/the-monkeys'
                target='_blank'
              >
                <Icon name='RiHeart3' className='mr-2 text-pink-500' />
                Sponsor
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BlogFeedPageLayout;
