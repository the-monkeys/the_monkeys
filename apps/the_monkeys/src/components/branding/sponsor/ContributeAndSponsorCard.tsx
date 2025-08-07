import Link from 'next/link';

import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';
import { twMerge } from 'tailwind-merge';

export const ContributeAndSponsorCard = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        className,
        'p-[2px] bg-gradient-to-r from-blue-500 to-pink-500'
      )}
    >
      <div className='p-4 sm:p-6 bg-background-light dark:bg-background-dark space-y-6'>
        <div className='space-y-1'>
          <h4 className='font-dm_sans font-semibold text-2xl sm:text-3xl leading-tight drop-shadow-sm'>
            Together
            <span className='font-bold text-blue-500'> .</span>
            <br />
            We Build Better
            <span className='font-bold text-pink-500'> .</span>
          </h4>

          <p className='text-sm sm:text-base opacity-90'>
            Add features or sponsor to support sustainable growth and community
            impact.
          </p>
        </div>

        <div className='w-full flex-1 flex gap-3 flex-wrap'>
          <Button
            variant='outline'
            className='flex-1 !rounded-none border-blue-500/80 dark:border-blue-500/80 hover:bg-blue-500/25 dark:hover:bg-blue-500/25'
            asChild
          >
            <Link
              href='https://github.com/the-monkeys/the_monkeys'
              target='_blank'
            >
              <Icon name='RiCodeSSlash' className='mr-1 text-blue-500' />
              Contribute
            </Link>
          </Button>

          <Button
            variant='outline'
            className='flex-1 !rounded-none border-pink-500/80 dark:border-pink-500/80 hover:bg-pink-500/25 dark:hover:bg-pink-500/25'
            asChild
          >
            <Link
              href='https://github.com/sponsors/the-monkeys'
              target='_blank'
            >
              <Icon name='RiShakeHands' className='mr-1 text-pink-500' />
              Sponsor
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
