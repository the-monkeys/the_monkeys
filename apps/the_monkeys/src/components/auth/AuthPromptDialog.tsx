'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import Icon, { type IconName, type IconProps } from '@/components/icon';
import { LOGIN_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';
import { twMerge } from 'tailwind-merge';

const REGISTER_ROUTE = '/auth/register';

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  iconName?: IconName;
  iconType?: IconProps['type'];
  iconClassName?: string;
  iconContainerClassName?: string;
  title?: string;
  description?: string;
  loginLabel?: string;
  signUpLabel?: string;
  showSignUp?: boolean;
  callbackPath?: string;
}

export const AuthPromptDialog = ({
  open,
  onOpenChange,
  iconName = 'RiHeart3',
  iconType = 'Fill',
  iconClassName = 'text-brand-orange',
  iconContainerClassName,
  title = 'Like a post to share the love.',
  description = 'Join Monkeys now to let the author know you like their post.',
  loginLabel = 'Log in',
  signUpLabel = 'Sign up',
  showSignUp = true,
  callbackPath,
}: AuthPromptDialogProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.toString();
  const callbackURL = encodeURIComponent(
    callbackPath ?? `${pathname}${search ? `?${search}` : ''}`
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[calc(100vw-32px)] max-w-lg border-1 border-border-light bg-background-light px-5 py-8 shadow-xl dark:border-border-dark dark:bg-background-dark sm:px-8 sm:py-10 [&>button]:right-4 [&>button]:top-4'>
        <div className='flex flex-col items-center gap-6 text-center sm:gap-8'>
          <div
            className={twMerge(
              'flex size-16 items-center justify-center rounded-full border-1 border-brand-orange/30 bg-brand-orange/10 sm:size-20',
              iconContainerClassName
            )}
          >
            <Icon
              name={iconName}
              type={iconType}
              size={40}
              className={iconClassName}
            />
          </div>

          <div className='space-y-3'>
            <DialogTitle className='p-0 text-center font-dm_sans text-2xl font-bold leading-tight text-text-light dark:text-text-dark sm:text-3xl'>
              {title}
            </DialogTitle>

            <DialogDescription className='mx-auto max-w-sm text-center font-dm_sans text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base'>
              {description}
            </DialogDescription>
          </div>

          <div
            className={twMerge(
              'grid w-full gap-3',
              showSignUp && 'sm:grid-cols-2'
            )}
          >
            <Button variant='brand' size='lg' asChild className='w-full'>
              <Link href={`${LOGIN_ROUTE}?callbackURL=${callbackURL}`}>
                {loginLabel}
              </Link>
            </Button>

            {showSignUp && (
              <Button variant='outline' size='lg' asChild className='w-full'>
                <Link href={`${REGISTER_ROUTE}?callbackURL=${callbackURL}`}>
                  {signUpLabel}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
