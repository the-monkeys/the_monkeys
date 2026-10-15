'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { StudioTabs } from '@/components/StudioTabs';
import { SnapshotStudio } from '@/features/snapshot/components/SnapshotStudio';
import { useSnapshotAuthor } from '@/features/snapshot/hooks/useSnapshotAuthor';
import { SnapshotInput } from '@/features/snapshot/types';
import useAuth from '@/hooks/auth/useAuth';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';

type StudioView = 'template' | 'x';

const VIEW_STORAGE_KEY = 'monkeys_studio_view';

const isStudioView = (v: unknown): v is StudioView =>
  v === 'template' || v === 'x';

export default function SnapshotNewClient() {
  const { data: session } = useAuth();
  const username = session?.username;
  const isLoggedIn = !!username;
  const { data: profile } = useGetAuthUserProfile(username);
  const displayName = useMemo(() => {
    // Logged-out visitors are never fetched/tracked — show a generic byline.
    if (!isLoggedIn) return 'Anonymous User';
    const fn = session?.first_name?.trim() || profile?.first_name?.trim();
    const ln = session?.last_name?.trim() || profile?.last_name?.trim();
    return [fn, ln].filter(Boolean).join(' ') || username || 'the_monkeys';
  }, [
    isLoggedIn,
    session?.first_name,
    session?.last_name,
    profile?.first_name,
    profile?.last_name,
    username,
  ]);

  // Only pass a username when signed in, so the profile/avatar API is never
  // called for anonymous users (the hook is a no-op without a username).
  const { author } = useSnapshotAuthor(username, displayName);
  const [view, setView] = useState<StudioView>('template');
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
        username: username ?? 'anonymous',
        displayName,
      },
    }),
    [author, username, displayName]
  );

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6'>
      <StudioTabs active={view} onSelect={selectView} />
      <SnapshotStudio input={input} previewMode={view} />
    </div>
  );
}
