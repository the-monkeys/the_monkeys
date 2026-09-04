'use client';

import { StudioTabs } from '@/components/StudioTabs';
import { CardGallery } from '@/features/cards/components/CardGallery';
import { CardsAuthGuard } from '@/features/cards/components/CardsAuthGuard';

export default function CardsPageClient() {
  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6'>
      <StudioTabs active='card' />
      <CardsAuthGuard>
        <CardGallery />
      </CardsAuthGuard>
    </div>
  );
}
