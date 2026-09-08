'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';

export const BackButton = ({ href }: { href?: string }) => {
  const router = useRouter();
  const className =
    'inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition-opacity';

  if (href) {
    return (
      <Link href={href} className={className}>
        <Icon name='RiArrowLeft' size={18} />
        Back
      </Link>
    );
  }

  return (
    <button type='button' onClick={() => router.back()} className={className}>
      <Icon name='RiArrowLeft' size={18} />
      Back
    </button>
  );
};
