'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { StudioTabs } from '@/components/StudioTabs';
import { CardStudio } from '@/features/cards/components/CardStudio';
import { CardsAuthGuard } from '@/features/cards/components/CardsAuthGuard';
import { getCard } from '@/features/cards/lib/cardsRemote';
import { SavedCard } from '@/features/cards/lib/storage';
import useAuth from '@/hooks/auth/useAuth';
import { Button } from '@the-monkeys/ui/atoms/button';

export default function EditCardPage() {
  const params = useParams<{ cardId: string }>();
  const { data: session } = useAuth();
  const [card, setCard] = useState<SavedCard | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Never fetch a card for logged-out visitors — the guard blocks them.
    if (!session) return;
    let active = true;
    setLoading(true);
    (async () => {
      try {
        const found = await getCard(params.cardId);
        if (active) setCard(found);
      } catch {
        if (active) setCard(undefined);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [params.cardId, session]);

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6'>
      <StudioTabs active='card' />
      <CardsAuthGuard>
        {loading ? (
          <div className='h-8 w-48 animate-pulse rounded bg-foreground/10' />
        ) : !card ? (
          <div className='mx-auto flex w-full max-w-md flex-col items-center gap-4 py-16 text-center'>
            <h1 className='font-newsreader text-2xl'>Card not found</h1>
            <p className='text-foreground/60'>
              This card may have been deleted or the link is invalid.
            </p>
            <Link href='/cards'>
              <Button variant='outline'>Back to Cards</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className='mb-6 flex items-center gap-3'>
              <Link
                href='/cards'
                className='text-sm text-foreground/50 hover:text-foreground'
              >
                ← Cards
              </Link>
              <h1 className='font-newsreader text-3xl'>
                {card.name || 'Edit Card'}
              </h1>
            </div>
            <CardStudio cardId={card.id} initial={card.state} />
          </>
        )}
      </CardsAuthGuard>
    </div>
  );
}
