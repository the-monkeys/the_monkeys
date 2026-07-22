'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';

import { Button } from '@the-monkeys/ui/atoms/button';

import { deleteCard, duplicateCard, listCards } from '../lib/cardsRemote';
import { SavedCard } from '../lib/storage';

export const CardGallery = () => {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setCards(await listCards());
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    await deleteCard(id);
    refresh();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateCard(id);
    refresh();
  };

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-newsreader text-3xl'>Cards</h1>
          <p className='mt-1 text-foreground/60'>
            Create and manage your digital cards.
          </p>
        </div>
        <Link href='/cards/new'>
          <Button>Create New</Button>
        </Link>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className='h-32 animate-pulse rounded-xl border border-foreground/10 bg-foreground/5'
            />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className='flex flex-col items-center gap-4 rounded-xl border border-dashed border-foreground/20 py-16 text-center'>
          <p className='text-lg text-foreground/50'>No cards yet</p>
          <p className='max-w-md text-sm text-foreground/40'>
            Create your first card with your name, email, phone, company logo,
            and choose from multiple professional templates.
          </p>
          <Link href='/cards/new'>
            <Button>Create Your First Card</Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {cards.map((card) => (
            <div
              key={card.id}
              className='group flex flex-col gap-3 rounded-xl border border-foreground/10 p-4 transition-colors hover:border-foreground/20'
            >
              <Link href={`/cards/${card.id}`} className='flex flex-col gap-2'>
                <h3 className='font-medium'>{card.name || 'Untitled Card'}</h3>
                <p className='text-xs text-foreground/50'>
                  {card.state.input.contact.jobTitle &&
                    `${card.state.input.contact.jobTitle} · `}
                  {card.state.input.contact.company ?? ''}
                </p>
                <p className='text-xs text-foreground/40'>
                  Updated{' '}
                  {new Date(card.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </Link>
              <div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                <Link
                  href={`/cards/${card.id}`}
                  className='text-xs text-foreground/60 hover:text-foreground'
                >
                  Edit
                </Link>
                <button
                  type='button'
                  onClick={() => handleDuplicate(card.id)}
                  className='text-xs text-foreground/60 hover:text-foreground'
                >
                  Duplicate
                </button>
                <button
                  type='button'
                  onClick={() => handleDelete(card.id)}
                  className='text-xs text-foreground/60 hover:text-destructive'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
