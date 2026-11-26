'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { loginHref } from '@/lib/authRedirect';

export function DiscussionLoginPrompt({ action }: { action: string }) {
  const pathname = usePathname();
  return (
    <p className='font-inter text-sm text-gray-500'>
      <Link
        className='text-brand-orange hover:underline'
        href={loginHref(pathname)}
      >
        Log in
      </Link>{' '}
      {action}
    </p>
  );
}
