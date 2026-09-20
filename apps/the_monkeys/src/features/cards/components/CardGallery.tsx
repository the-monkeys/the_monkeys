'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiFileCopyLine,
  RiIdCardLine,
} from '@remixicon/react';
import { Button } from '@the-monkeys/ui/atoms/button';

import { deleteCard, duplicateCard, listCards } from '../lib/cardsRemote';
import { SavedCard } from '../lib/storage';

export const CardGallery = () => {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);

  const newCardHref = isStudio ? '/studio/cards/new' : '/cards/new';
  const getCardHref = (id: string) =>
    isStudio ? `/studio/cards/${id}` : `/cards/${id}`;

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
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange'>
              Studio
            </span>
            <span className='text-xs text-foreground/40'>•</span>
            <span className='text-xs text-foreground/50'>Digital Cards</span>
          </div>
          <h1 className='mt-2 font-newsreader text-3xl sm:text-4xl text-foreground dark:text-text-dark'>
            Cards
          </h1>
          <p className='mt-1 text-sm text-foreground/60 dark:text-text-dark/60'>
            Create, customize, and export professional digital business cards.
          </p>
        </div>
        <div>
          <Link
            href={newCardHref}
            className='inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-orange/90'
          >
            <RiAddLine size={16} />
            <span>Create New</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className='h-36 animate-pulse rounded-2xl border border-border-light bg-foreground-light/10 p-4 dark:border-border-dark dark:bg-foreground-dark/10'
            />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border-light bg-background-light/50 py-16 text-center dark:border-border-dark dark:bg-background-dark/50'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange'>
            <RiIdCardLine size={24} />
          </div>
          <p className='text-lg font-medium text-foreground dark:text-text-dark'>
            No cards yet
          </p>
          <p className='max-w-md text-sm text-foreground/60 dark:text-text-dark/60'>
            Create your first card with your name, email, phone, company logo,
            and choose from multiple professional templates.
          </p>
          <Link
            href={newCardHref}
            className='inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-orange/90'
          >
            Create Your First Card
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {cards.map((card) => {
            const cardUrl = getCardHref(card.id);
            const template = card.state?.templateId || 'default';
            const theme = card.state?.themeId || 'light';

            return (
              <div
                key={card.id}
                className='group relative flex flex-col justify-between rounded-2xl border border-border-light bg-background-light p-4 shadow-sm transition-all hover:border-brand-orange/50 hover:shadow-md dark:border-border-dark dark:bg-background-dark'
              >
                <Link href={cardUrl} className='flex flex-col gap-2'>
                  <div className='flex items-center justify-between gap-2'>
                    <h3 className='font-semibold text-foreground dark:text-text-dark truncate'>
                      {card.name || 'Untitled Card'}
                    </h3>
                    <span className='rounded-md bg-foreground-light/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/70 dark:bg-foreground-dark/30 dark:text-text-dark/70 shrink-0'>
                      {template}
                    </span>
                  </div>

                  <p className='text-xs text-foreground/60 dark:text-text-dark/60 truncate'>
                    {card.state?.input?.contact?.jobTitle &&
                      `${card.state.input.contact.jobTitle} · `}
                    {card.state?.input?.contact?.company ?? ''}
                  </p>

                  <p className='text-[11px] text-foreground/40 dark:text-text-dark/40'>
                    Updated{' '}
                    {new Date(card.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </Link>

                <div className='mt-4 flex items-center justify-between border-t border-border-light/60 pt-3 dark:border-border-dark/60'>
                  <div className='flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
                    <Link
                      href={cardUrl}
                      className='inline-flex items-center gap-1 rounded-lg border border-border-light bg-background-light px-2.5 py-1 text-xs font-medium text-foreground/70 hover:bg-foreground-light/40 dark:border-border-dark dark:bg-background-dark transition-colors'
                    >
                      <RiEditLine size={12} />
                      <span>Edit</span>
                    </Link>
                    <button
                      type='button'
                      onClick={() => handleDuplicate(card.id)}
                      className='inline-flex items-center gap-1 rounded-lg border border-border-light bg-background-light px-2.5 py-1 text-xs font-medium text-foreground/70 hover:bg-foreground-light/40 dark:border-border-dark dark:bg-background-dark transition-colors'
                    >
                      <RiFileCopyLine size={12} />
                      <span>Duplicate</span>
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(card.id)}
                      className='inline-flex items-center gap-1 rounded-lg border border-alert-red/30 bg-alert-red/5 px-2.5 py-1 text-xs font-medium text-alert-red hover:bg-alert-red/10 transition-colors'
                    >
                      <RiDeleteBinLine size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
