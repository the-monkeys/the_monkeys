'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';
import { loginHref } from '@/lib/authRedirect';

/**
 * Gates the Business Card studio behind login. Image template and X screenshot
 * stay open to everyone; only cards (which are saved to the user's account)
 * require an account. Keeps the surrounding StudioTabs visible so a logged-out
 * visitor can switch back to the free tools.
 */
export const CardsAuthGuard = ({ children }: { children: ReactNode }) => {
  const { data: session, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className='h-40 w-full animate-pulse rounded-xl bg-foreground/5' />
    );
  }

  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 rounded-xl border border-border-light/60 px-6 py-16 text-center dark:border-border-dark/60'>
        <h2 className='font-newsreader text-2xl'>
          Sign in to create Business Cards
        </h2>
        <p className='max-w-md text-sm text-foreground/60'>
          Business cards are saved to your account. Log in to design, save and
          download yours. Image template and X screenshot stay free to use
          without an account.
        </p>
        <Link
          href={loginHref(pathname)}
          className='rounded-md bg-brand-orange px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
        >
          Log in to continue
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
