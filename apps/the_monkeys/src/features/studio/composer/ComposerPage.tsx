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
import {
  RiEditLine,
  RiEyeLine,
  RiInformationLine,
  RiSparklingFill,
} from '@remixicon/react';

import FastActionBar from './FastActionBar';
import MediaLibraryModal from './MediaLibraryModal';
import MediaShelf from './MediaShelf';
import PlatformSelector, { PLATFORM_DEFINITIONS } from './PlatformSelector';
import RenditionTabs from './RenditionTabs';
import RichComposerEditor from './RichComposerEditor';
import SocialPlatformPreview from './SocialPlatformPreview';
import { type ComposerMedia, useComposerStore } from './composerStore';

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

  // Local state aligned with Zustand store
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<SocialPlatform[]>(['x', 'linkedin']);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [isSynced, setIsSynced] = useState<Record<string, boolean>>({
    x: true,
    linkedin: true,
    instagram: true,
    facebook: true,
    youtube: true,
    tiktok: true,
  });
  const [activeTab, setActiveTab] = useState<'base' | SocialPlatform>('base');
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('x');
  const [media, setMedia] = useState<ComposerMedia[]>([]);
  const [isScheduleDrawerOpen, setIsScheduleDrawerOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  const post = existing.data;
  const postStatus = post?.state ?? post?.status ?? 'draft';
  const isScheduled = postStatus === 'scheduled';
  const isDraft = !post || postStatus === 'draft';
  const isPublishing = postStatus === 'publishing';
  const isPublished =
    postStatus === 'published' || postStatus === 'published_with_errors';

  // Synchronize existing post into editor state
  useEffect(() => {
    if (post) {
      setText(post.base_text ?? '');
      const enabledPlatforms =
        post.renditions
          ?.filter((item) => item.enabled)
          ?.map((item) => item.platform)
          ?.filter((platform): platform is SocialPlatform =>
            Boolean(platform)
          ) ?? [];
      if (enabledPlatforms.length > 0) {
        setSelected(enabledPlatforms);
      }

      const initialOverrides: Record<string, string> = {};
      const initialSynced: Record<string, boolean> = {
        x: true,
        linkedin: true,
        instagram: true,
        facebook: true,
        youtube: true,
        tiktok: true,
      };

      post.renditions?.forEach((r) => {
        if (r.platform && r.text_override) {
          initialOverrides[r.platform] = r.text_override;
          initialSynced[r.platform] = false;
        }
      });

      if (Object.keys(initialOverrides).length > 0) {
        setOverrides((prev) => ({ ...initialOverrides, ...prev }));
        setIsSynced((prev) => ({ ...initialSynced, ...prev }));
      }
    }
  }, [post]);

  const baseText = text;

  // Toggle platform selection
  const togglePlatform = (platform: SocialPlatform) => {
    setSelected((current) => {
      const exists = current.includes(platform);
      const next = exists
        ? current.filter((item) => item !== platform)
        : [...current, platform];
      if (activeTab === platform && exists) {
        setActiveTab('base');
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelected(PLATFORM_DEFINITIONS.map((p) => p.id));
  };

  const handleClearAll = () => {
    setSelected([]);
    setActiveTab('base');
  };

  const getPlatformTextLength = useCallback(
    (platform: SocialPlatform) => {
      return (overrides[platform] || baseText).length;
    },
    [overrides, baseText]
  );

  const isExceeded = useMemo(() => {
    return selected.some((platformId) => {
      const def = PLATFORM_DEFINITIONS.find((p) => p.id === platformId);
      if (!def) return false;
      return getPlatformTextLength(platformId) > def.limit;
    });
  }, [selected, getPlatformTextLength]);

  // Unsync a platform to allow independent customization
  const handleUnsync = (platform: SocialPlatform) => {
    setIsSynced((prev) => ({ ...prev, [platform]: false }));
    setOverrides((prev) => ({
      ...prev,
      [platform]: prev[platform] ?? baseText,
    }));
  };

  // Reset platform back to base post inheritance
  const handleResetToBase = (platform: SocialPlatform) => {
    setIsSynced((prev) => ({ ...prev, [platform]: true }));
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[platform];
      return next;
    });
  };

  // Media handlers
  const handleAddMedia = (newMedia: ComposerMedia[]) => {
    setMedia((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const unique = newMedia.filter((m) => !existingIds.has(m.id));
      return [...prev, ...unique];
    });
  };

  const handleRemoveMedia = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  // Save draft mutation
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

  // 1-Click Quick Scheduling Presets
  const handleQuickSchedule = async (hoursFromNow: number) => {
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + hoursFromNow);
    if (hoursFromNow === 24) {
      // Set to 9:00 AM next day
      targetDate.setHours(9, 0, 0, 0);
    }
    const isoString = targetDate.toISOString();
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    await handleSchedule(isoString, userTz);
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

  const activePreviewPlatform =
    activeTab !== 'base' ? activeTab : previewPlatform;

  const currentPreviewText =
    activePreviewPlatform === 'base'
      ? baseText
      : overrides[activePreviewPlatform] ?? baseText;

  const currentAccount = accounts?.find(
    (a) => a.platform === activePreviewPlatform
  );

  return (
    <div className='w-full space-y-6'>
      {/* Header */}
      <header className='flex flex-col sm:flex-row sm:items-end justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <span className='rounded bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-brand-orange'>
              Composer
            </span>
          </div>
          <h2 className='mt-2 font-newsreader text-3xl sm:text-4xl text-foreground dark:text-text-dark'>
            {postId ? 'Refine your post.' : 'Start with one idea.'}
          </h2>
        </div>

        {/* Mobile View Toggle: Edit vs Preview */}
        <div className='flex items-center rounded-xl border border-border-light bg-background-light p-1 lg:hidden dark:border-border-dark dark:bg-background-dark'>
          <button
            type='button'
            onClick={() => setMobileView('edit')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              mobileView === 'edit'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/60'
            }`}
          >
            <RiEditLine size={14} />
            <span>Editor</span>
          </button>
          <button
            type='button'
            onClick={() => setMobileView('preview')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              mobileView === 'preview'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/60'
            }`}
          >
            <RiEyeLine size={14} />
            <span>Preview</span>
          </button>
        </div>
      </header>

      {/* Scheduled Lock Banner */}
      {isScheduled && (
        <div className='flex items-center gap-2 rounded-xl border border-brand-orange/30 bg-brand-orange/5 px-4 py-3 text-xs text-brand-orange'>
          <RiInformationLine size={16} className='shrink-0' />
          <span>To edit post content, cancel the schedule first.</span>
        </div>
      )}

      {/* 2-Column Responsive Workspace */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start'>
        {/* Left Column: Authoring Surface */}
        <div
          className={`space-y-6 lg:col-span-7 ${
            mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Channel Selector Chips */}
          <PlatformSelector
            selected={selected}
            onToggle={togglePlatform}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
            accounts={accounts}
            getTextLength={getPlatformTextLength}
          />

          {/* Canonical vs Renditions Tabs */}
          <div className='rounded-2xl border border-border-light bg-background-light p-4 dark:border-border-dark/60 dark:bg-background-dark shadow-sm space-y-4'>
            <RenditionTabs
              selectedPlatforms={selected}
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                if (tab !== 'base') setPreviewPlatform(tab);
              }}
              isSynced={isSynced}
              overrides={overrides}
              getTextLength={getPlatformTextLength}
            />

            {/* Rich Editor Canvas */}
            <RichComposerEditor
              activeTab={activeTab}
              selectedPlatforms={selected}
              baseText={baseText}
              overrides={overrides}
              isSynced={isSynced}
              onChangeBaseText={setText}
              onChangeOverride={(p, val) =>
                setOverrides((prev) => ({ ...prev, [p]: val }))
              }
              onUnsync={handleUnsync}
              onResetToBase={handleResetToBase}
              onAddMedia={handleAddMedia}
              disabled={isScheduled}
            />

            {/* Media Shelf */}
            <MediaShelf
              media={media}
              onAddMedia={handleAddMedia}
              onRemoveMedia={handleRemoveMedia}
              onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
              disabled={isScheduled}
            />
          </div>

          {/* Fast Action Bar */}
          <FastActionBar
            post={post}
            isDraft={isDraft}
            isScheduled={isScheduled}
            isPublishing={isPublishing}
            isPublished={isPublished}
            isExceeded={isExceeded}
            isError={Boolean(
              create?.isError ||
                update?.isError ||
                upsertRendition?.isError ||
                schedule?.isError ||
                cancelSchedule?.isError ||
                publishNow?.isError ||
                deleteDraft?.isError
            )}
            onSaveDraft={save}
            onOpenScheduleDrawer={() =>
              setIsScheduleDrawerOpen((prev) => !prev)
            }
            onQuickSchedule={handleQuickSchedule}
            onPublishNow={handlePublishNow}
            onCancelSchedule={handleCancelSchedule}
            onDeleteDraft={handleDeleteDraft}
            isSavePending={Boolean(
              create?.isPending ||
                update?.isPending ||
                upsertRendition?.isPending
            )}
            isPublishPending={Boolean(publishNow?.isPending)}
            isSchedulePending={Boolean(schedule?.isPending)}
            isCancelPending={Boolean(cancelSchedule?.isPending)}
            isDeletePending={Boolean(deleteDraft?.isPending)}
          />
        </div>

        {/* Right Column: Live Social Preview */}
        <div
          className={`lg:col-span-5 lg:sticky lg:top-24 ${
            mobileView === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <SocialPlatformPreview
            platform={activePreviewPlatform}
            text={currentPreviewText}
            media={media}
            account={currentAccount}
            allSelectedPlatforms={selected}
            onSelectPlatform={setPreviewPlatform}
          />
        </div>
      </div>

      {/* Schedule Drawer Modal */}
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

      {/* Media Library Picker Modal */}
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectMedia={(selectedItem) => handleAddMedia([selectedItem])}
      />
    </div>
  );
}
