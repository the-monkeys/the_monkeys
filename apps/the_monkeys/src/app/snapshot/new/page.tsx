'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { CardGallery } from '@/features/cards/components/CardGallery';
import { SnapshotStudio } from '@/features/snapshot/components/SnapshotStudio';
import { useSnapshotAuthor } from '@/features/snapshot/hooks/useSnapshotAuthor';
import { SnapshotInput } from '@/features/snapshot/types';
import useAuth from '@/hooks/auth/useAuth';

type StudioView = 'template' | 'x' | 'card';

const VIEW_STORAGE_KEY = 'monkeys_studio_view';

const isStudioView = (v: unknown): v is StudioView =>
  v === 'template' || v === 'x' || v === 'card';

/**
 * Blank-canvas snapshot studio. Lets any visitor (signed in or out) create a
 * shareable image without picking a published post first.
 *
 * Default content is intentionally generic and editable, so the page is
 * useful even with no source blog.
 */
export default function SnapshotNewPage() {
  const { data: session } = useAuth();
  const username = session?.username;
  const displayName = useMemo(() => {
    const fn = session?.first_name?.trim();
    const ln = session?.last_name?.trim();
    return [fn, ln].filter(Boolean).join(' ') || username || 'the_monkeys';
  }, [session?.first_name, session?.last_name, username]);

  const { author } = useSnapshotAuthor(username, displayName);
  const [view, setView] = useState<StudioView>('template');
  const previewMode: 'template' | 'x' = view === 'x' ? 'x' : 'template';
  const router = useRouter();
  const pathname = usePathname();

  // Restore the active tab from the URL (?view=) first so the page is
  // deep-linkable and the browser back button works; fall back to the
  // last-used tab persisted in localStorage.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('view');
    if (isStudioView(fromUrl)) {
      setView(fromUrl);
      return;
    }
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (isStudioView(saved)) setView(saved);
  }, []);

  const selectView = useCallback(
    (next: StudioView) => {
      setView(next);
      try {
        localStorage.setItem(VIEW_STORAGE_KEY, next);
      } catch {
        /* storage unavailable — ignore */
      }
      // Reflect the tab in the URL so it can be shared and navigated to.
      const params = new URLSearchParams(window.location.search);
      params.set('view', next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname]
  );

  const input = useMemo<SnapshotInput>(
    () => ({
      source: 'manual',
      title: 'Your headline goes here',
      description:
        'A short hook that makes people stop scrolling. Edit it to match your post.',
      quote: 'Drop a punchy line here for the quote templates.',
      tags: ['the_monkeys'],
      author: author ?? {
        username: username ?? 'the_monkeys',
        displayName,
      },
    }),
    [author, username, displayName]
  );

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6'>
      <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {view === 'card' ? (
          <div />
        ) : (
          <div className='flex flex-col gap-1'>
            <Link
              href='/snapshot'
              className='text-xs text-foreground/60 hover:text-foreground'
            >
              ← Pick a post instead
            </Link>
            <h1 className='font-newsreader text-2xl'>
              Snapshot
              <span className='text-brand-orange'>.</span>{' '}
              <span className='text-foreground/60'>blank canvas</span>
            </h1>
            <p className='text-xs text-foreground/60'>
              Type your own title, description and pull-quote. Choose a
              template, theme, and accent — then download.
            </p>
          </div>
        )}

        <div
          className='inline-flex self-start rounded-lg border p-0.5 text-xs sm:self-center shrink-0'
          role='tablist'
          aria-label='Studio mode'
        >
          <button
            type='button'
            role='tab'
            aria-selected={view === 'template'}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              view === 'template'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/70 hover:text-foreground'
            }`}
            onClick={() => selectView('template')}
          >
            Image template
          </button>
          <button
            type='button'
            role='tab'
            aria-selected={view === 'x'}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              view === 'x'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/70 hover:text-foreground'
            }`}
            onClick={() => selectView('x')}
          >
            X screenshot
          </button>
          <button
            type='button'
            role='tab'
            aria-selected={view === 'card'}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              view === 'card'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/70 hover:text-foreground'
            }`}
            onClick={() => selectView('card')}
          >
            Card
          </button>
        </div>
      </div>
      {view === 'card' ? (
        <CardGallery />
      ) : (
        <SnapshotStudio
          input={input}
          previewMode={previewMode}
          onPreviewModeChange={(mode) => selectView(mode)}
        />
      )}
    </div>
  );
}
