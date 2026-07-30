'use client';

import Link from 'next/link';

import { CardStudio } from '@/features/cards/components/CardStudio';

export default function NewCardPage() {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-8'>
      <div className='mb-6 flex items-center gap-3'>
        <Link
          href='/cards'
          className='text-sm text-foreground/50 hover:text-foreground'
        >
          ← Cards
        </Link>
        <h1 className='font-newsreader text-3xl'>Create Card</h1>
      </div>
      <CardStudio />
    </div>
  );
}
