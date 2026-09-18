'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import ScheduleDrawer from '@/features/studio/composer/ScheduleDrawer';
import type { SocialPlatform, SocialPost } from '@/features/studio/types';
import {
  useSocialAccounts,
  useSocialPost,
  useSocialPostMutations,
} from '@/hooks/studio/useSocialPosts';

const platforms: { id: SocialPlatform; label: string; limit: number }[] = [
  { id: 'x', label: 'X', limit: 280 },
  { id: 'linkedin', label: 'LinkedIn', limit: 3000 },
  { id: 'instagram', label: 'Instagram', limit: 2200 },
  { id: 'facebook', label: 'Facebook', limit: 63206 },
  { id: 'youtube', label: 'YouTube', limit: 5000 },
  { id: 'tiktok', label: 'TikTok', limit: 2200 },
];

export default function ComposerPage({ postId }: { postId?: string }) {
  const router = useRouter();
  const existing = useSocialPost(postId);
  const { data: accounts } = useSocialAccounts();
  const mutations = useSocialPostMutations();

  const create = mutations?.create;
  const update = mutations?.update;
  const upsertRendition = mutations?.upsertRendition;
  const setRenditionMedia = mutations?.setRenditionMedia;
  const schedule = mutations?.schedule;
  const cancelSchedule = mutations?.cancelSchedule;
  const publishNow = mutations?.publishNow;
  const deleteDraft = mutations?.deleteDraft;

  const [text, setText] = useState('');
  const [selected, setSelected] = useState<SocialPlatform[]>(['x', 'linkedin']);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);

  const post = existing.data;
  const postStatus = post?.state ?? post?.status ?? 'draft';
  const isScheduled = postStatus === 'scheduled';
  const isDraft = !post || postStatus === 'draft';
  const isPublishing = postStatus === 'publishing';
  const isPublished =
    postStatus === 'published' || postStatus === 'published_with_errors';

  useEffect(() => {
    if (post) {
      setText(post.base_text ?? '');
      setSelected(
        post.renditions
          ?.filter((item) => item.enabled)
          ?.map((item) => item.platform)
          ?.filter((platform): platform is SocialPlatform =>
            Boolean(platform)
          ) ?? []
      );
      const initialOverrides: Record<string, string> = {};
      post.renditions?.forEach((r) => {
        if (r.platform && r.text_override) {
          initialOverrides[r.platform] = r.text_override;
        }
      });
      if (Object.keys(initialOverrides).length > 0) {
        setOverrides((prev) => ({ ...initialOverrides, ...prev }));
      }
    }
  }, [post]);

  const baseText = text;

  const toggle = (platform: SocialPlatform) =>
    setSelected((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform]
    );

  const getPlatformTextLength = useCallback(
    (platform: SocialPlatform) => {
      return (overrides[platform] || baseText).length;
    },
    [overrides, baseText]
  );

  const isExceeded = useMemo(() => {
    return selected.some((platformId) => {
      const def = platforms.find((p) => p.id === platformId);
      if (!def) return false;
      return getPlatformTextLength(platformId) > def.limit;
    });
  }, [selected, getPlatformTextLength]);

  const save = async (): Promise<SocialPost> => {
    let result = post;
    if (!result) {
      if (!create?.mutateAsync)
        throw new Error('Create mutation not available');
      result = await create.mutateAsync({ base_text: baseText });
    } else {
      if (!update?.mutateAsync)
        throw new Error('Update mutation not available');
      result = await update.mutateAsync({
        id: result.id,
        input: { base_text: baseText },
        expectedVersion: result.version,
      });
    }

    if (upsertRendition?.mutateAsync) {
      for (const platform of selected) {
        const targetAccount = accounts?.find(
          (acc) => acc.platform === platform
        );
        if (!targetAccount?.id) continue;
        result = await upsertRendition.mutateAsync({
          id: result.id,
          expectedVersion: result.version,
          rendition: {
            social_account_id: targetAccount.id,
            text_override: overrides[platform] || undefined,
          },
        });
        if (result.media_asset_ids?.length && setRenditionMedia?.mutateAsync) {
          result = await setRenditionMedia.mutateAsync({
            id: result.id,
            accountId: targetAccount.id,
            assetIds: result.media_asset_ids,
            expectedVersion: result.version,
          });
        }
      }
    }
    router.push(`/studio/compose/${result.id}`);
    return result;
  };

  const handlePublishNow = async () => {
    if (isScheduled && post) {
      if (!publishNow?.mutateAsync) return;
      await publishNow.mutateAsync({
        id: post.id,
        expectedVersion: post.version,
      });
    } else {
      const savedPost = await save();
      if (savedPost?.id && publishNow?.mutateAsync) {
        await publishNow.mutateAsync({
          id: savedPost.id,
          expectedVersion: savedPost.version,
        });
      }
    }
  };

  const handleSchedule = async (scheduledAtIso: string, timezone: string) => {
    if (!schedule?.mutateAsync) return;

    if (isScheduled && post) {
      await schedule.mutateAsync({
        id: post.id,
        input: {
          scheduled_at: scheduledAtIso,
          schedule_timezone: timezone,
          expected_version: post.version,
        },
        reschedule: true,
      });
      setIsScheduleDrawerOpen(false);
    } else {
      const savedPost = await save();
      if (savedPost?.id) {
        await schedule.mutateAsync({
          id: savedPost.id,
          input: {
            scheduled_at: scheduledAtIso,
            schedule_timezone: timezone,
            expected_version: savedPost.version,
          },
          reschedule: false,
        });
        setIsScheduleDrawerOpen(false);
      }
    }
  };

  const handleCancelSchedule = async () => {
    if (!post?.id || !cancelSchedule?.mutateAsync) return;
    await cancelSchedule.mutateAsync({
      id: post.id,
      expectedVersion: post.version,
    });
  };

  const handleDeleteDraft = async () => {
    if (!post?.id || !deleteDraft?.mutateAsync) return;
    await deleteDraft.mutateAsync({
      id: post.id,
      expectedVersion: post.version,
    });
    router.push('/studio');
  };

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <header>
        <p className='text-sm text-brand-orange'>Composer</p>
        <h2 className='font-newsreader text-4xl'>
          {postId ? 'Refine your post.' : 'Start with one idea.'}
        </h2>
      </header>

      {isScheduled && (
        <div className='rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-4 py-2.5 text-xs text-brand-orange'>
          To edit post content, cancel the schedule first.
        </div>
      )}

      <section className='rounded-xl border bg-background-light p-5 dark:bg-background-dark'>
        <label htmlFor='base-text' className='mb-2 block text-sm font-semibold'>
          Base post
        </label>
        <textarea
          id='base-text'
          value={baseText}
          onChange={(event) => setText(event.target.value)}
          placeholder='Write the thought you want to share...'
          className='min-h-40 w-full resize-y rounded-lg border bg-transparent p-3 outline-none ring-brand-orange focus:ring-2'
        />
        <div className='mt-2 flex justify-between text-xs text-foreground/50'>
          <span>Overrides inherit this text until you customize them.</span>
          <span>{baseText.length} characters</span>
        </div>
      </section>

      <section className='rounded-xl border bg-background-light p-5 dark:bg-background-dark'>
        <h3 className='mb-3 font-newsreader text-2xl'>Renditions</h3>
        <div className='grid gap-2 sm:grid-cols-3'>
          {platforms.map((platform) => {
            const currentLen = getPlatformTextLength(platform.id);
            const isSelected = selected.includes(platform.id);
            const isOver = isSelected && currentLen > platform.limit;
            return (
              <label
                key={platform.id}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                  isOver
                    ? 'border-alert-red/50 bg-alert-red/5'
                    : isSelected
                      ? 'border-brand-orange/40'
                      : ''
                }`}
              >
                <input
                  type='checkbox'
                  checked={isSelected}
                  onChange={() => toggle(platform.id)}
                />
                <span>{platform.label}</span>
                <span
                  className={`ml-auto text-xs ${
                    isOver
                      ? 'font-semibold text-alert-red'
                      : isSelected
                        ? 'text-foreground/70'
                        : 'text-foreground/40'
                  }`}
                >
                  {isSelected
                    ? `${currentLen}/${platform.limit}`
                    : platform.limit}
                </span>
              </label>
            );
          })}
        </div>

        <div className='mt-5 space-y-4'>
          {selected.map((platform) => {
            const definition = platforms.find((item) => item.id === platform)!;
            const currentLen = getPlatformTextLength(platform);
            const isOver = currentLen > definition.limit;
            return (
              <div key={platform}>
                <label
                  htmlFor={`override-${platform}`}
                  className='mb-1 block text-sm font-medium'
                >
                  {definition.label} override{' '}
                  <span className='text-foreground/40'>(optional)</span>
                </label>
                <textarea
                  id={`override-${platform}`}
                  value={overrides[platform] ?? ''}
                  onChange={(event) =>
                    setOverrides({
                      ...overrides,
                      [platform]: event.target.value,
                    })
                  }
                  placeholder='Use the base post, or tailor this rendition...'
                  className='min-h-20 w-full rounded-lg border bg-transparent p-3 text-sm outline-none ring-brand-orange focus:ring-2'
                />
                <p
                  className={`mt-1 text-right text-xs ${
                    isOver
                      ? 'font-semibold text-alert-red'
                      : 'text-foreground/40'
                  }`}
                >
                  {currentLen}/{definition.limit}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Schedule Drawer */}
      {isScheduleDrawerOpen && (
        <ScheduleDrawer
          initialScheduledAt={post?.scheduled_at}
          initialTimezone={post?.schedule_timezone}
          onSchedule={handleSchedule}
          onCancel={() => setIsScheduleDrawerOpen(false)}
          isLoading={schedule?.isPending}
          disabled={isExceeded}
        />
      )}

      {/* Bottom Action Bar */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-background-light p-4 dark:bg-background-dark'>
        <div className='flex flex-wrap items-center gap-3'>
          {isScheduled && (
            <div
              data-testid='scheduled-badge'
              className='flex items-center gap-2 rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-semibold text-brand-orange'
            >
              <span>
                Scheduled:{' '}
                {post?.scheduled_at
                  ? new Date(post.scheduled_at).toLocaleString(undefined, {
                      timeZone: post?.schedule_timezone || 'UTC',
                    })
                  : ''}{' '}
                ({post?.schedule_timezone || 'UTC'})
              </span>
            </div>
          )}

          {isPublishing && (
            <div className='flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500'>
              <span>Publishing...</span>
            </div>
          )}

          {isPublished && (
            <div className='flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500'>
              <span>Published</span>
            </div>
          )}

          {isDraft && post?.id && (
            <button
              type='button'
              onClick={handleDeleteDraft}
              disabled={deleteDraft?.isPending}
              className='rounded-lg border border-alert-red/30 px-3 py-1.5 text-xs font-medium text-alert-red hover:bg-alert-red/10 disabled:opacity-50'
            >
              {deleteDraft?.isPending ? 'Deleting...' : 'Delete draft'}
            </button>
          )}

          {(create?.isError ||
            update?.isError ||
            upsertRendition?.isError ||
            schedule?.isError ||
            cancelSchedule?.isError ||
            publishNow?.isError ||
            deleteDraft?.isError) && (
            <p className='text-xs text-alert-red'>
              An error occurred. Please try again.
            </p>
          )}

          {isExceeded && (
            <p className='text-xs text-alert-red'>
              One or more platforms exceed character limit.
            </p>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {isScheduled ? (
            <>
              <button
                type='button'
                onClick={() => setIsScheduleDrawerOpen((prev) => !prev)}
                disabled={schedule?.isPending}
                className='rounded-lg border px-4 py-2 text-sm font-medium hover:bg-foreground/5 disabled:opacity-50'
              >
                Reschedule
              </button>
              <button
                type='button'
                onClick={handleCancelSchedule}
                disabled={cancelSchedule?.isPending}
                className='rounded-lg border border-alert-red/30 px-4 py-2 text-sm font-medium text-alert-red hover:bg-alert-red/10 disabled:opacity-50'
              >
                {cancelSchedule?.isPending
                  ? 'Cancelling...'
                  : 'Cancel schedule'}
              </button>
              <button
                type='button'
                onClick={handlePublishNow}
                disabled={publishNow?.isPending || isExceeded}
                className='rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50'
              >
                {publishNow?.isPending ? 'Publishing...' : 'Publish now'}
              </button>
            </>
          ) : isDraft ? (
            <>
              <button
                type='button'
                onClick={() => setIsScheduleDrawerOpen((prev) => !prev)}
                disabled={isExceeded || schedule?.isPending}
                className='rounded-lg border px-4 py-2 text-sm font-medium hover:bg-foreground/5 disabled:opacity-50'
              >
                Schedule...
              </button>
              <button
                type='button'
                onClick={handlePublishNow}
                disabled={
                  publishNow?.isPending ||
                  isExceeded ||
                  create?.isPending ||
                  update?.isPending
                }
                className='rounded-lg border border-brand-orange px-4 py-2 text-sm font-medium text-brand-orange hover:bg-brand-orange/10 disabled:opacity-50'
              >
                {publishNow?.isPending ? 'Publishing...' : 'Publish now'}
              </button>
              <button
                type='button'
                onClick={save}
                disabled={
                  create?.isPending ||
                  update?.isPending ||
                  upsertRendition?.isPending
                }
                className='rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50'
              >
                {create?.isPending || update?.isPending
                  ? 'Saving...'
                  : 'Save draft'}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
