'use client';

import Link from 'next/link';

import { StudioTabs } from '@/components/StudioTabs';
import { CardStudio } from '@/features/cards/components/CardStudio';
import { CardsAuthGuard } from '@/features/cards/components/CardsAuthGuard';

export default function NewCardPage() {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6'>
      <StudioTabs active='card' />
      <CardsAuthGuard>
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
      </CardsAuthGuard>
    </div>
  );
}
