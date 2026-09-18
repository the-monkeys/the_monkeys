'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import type {
  SocialPlatform,
  SocialPostRendition,
} from '@/features/studio/types';
import {
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
  const { create, update, upsertRendition, setRenditionMedia } =
    useSocialPostMutations();
  const [text, setText] = useState('');
  const [selected, setSelected] = useState<SocialPlatform[]>(['x', 'linkedin']);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const post = existing.data;
  useEffect(() => {
    if (post) {
      setText(post.base_text ?? '');
      setSelected(
        post.renditions
          .filter((item) => item.enabled)
          .map((item) => item.platform)
          .filter((platform): platform is SocialPlatform => Boolean(platform))
      );
    }
  }, [post]);
  const baseText = text;

  const toggle = (platform: SocialPlatform) =>
    setSelected((current) =>
      current.includes(platform)
        ? current.filter((item) => item !== platform)
        : [...current, platform]
    );

  const save = async () => {
    let result = post;
    if (!result) {
      result = await create.mutateAsync({ base_text: baseText });
    } else {
      result = await update.mutateAsync({
        id: result.id,
        input: { base_text: baseText },
        expectedVersion: result.version,
      });
    }
    for (const platform of selected) {
      const existingRendition = result.renditions.find(
        (rendition) => rendition.platform === platform
      );
      if (!existingRendition?.social_account_id) continue;
      result = await upsertRendition.mutateAsync({
        id: result.id,
        expectedVersion: result.version,
        rendition: {
          social_account_id: existingRendition.social_account_id,
          text_override: overrides[platform] || undefined,
        },
      });
      if (result.media_asset_ids?.length) {
        result = await setRenditionMedia.mutateAsync({
          id: result.id,
          accountId: existingRendition.social_account_id,
          assetIds: result.media_asset_ids,
          expectedVersion: result.version,
        });
      }
    }
    router.push(`/studio/compose/${result.id}`);
  };

  return (
    <div className='mx-auto max-w-4xl space-y-6'>
      <header>
        <p className='text-sm text-brand-orange'>Composer</p>
        <h2 className='font-newsreader text-4xl'>
          {postId ? 'Refine your post.' : 'Start with one idea.'}
        </h2>
      </header>
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
          {platforms.map((platform) => (
            <label
              key={platform.id}
              className='flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm'
            >
              <input
                type='checkbox'
                checked={selected.includes(platform.id)}
                onChange={() => toggle(platform.id)}
              />
              <span>{platform.label}</span>
              <span className='ml-auto text-xs text-foreground/40'>
                {platform.limit}
              </span>
            </label>
          ))}
        </div>
        <div className='mt-5 space-y-4'>
          {selected.map((platform) => {
            const definition = platforms.find((item) => item.id === platform)!;
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
                  className={`mt-1 text-right text-xs ${(overrides[platform] || baseText).length > definition.limit ? 'text-alert-red' : 'text-foreground/40'}`}
                >
                  {(overrides[platform] || baseText).length}/{definition.limit}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <div className='flex justify-end gap-3'>
        {create.isError || update.isError || upsertRendition.isError ? (
          <p className='self-center text-sm text-alert-red'>
            Could not save this post.
          </p>
        ) : null}
        <button
          type='button'
          onClick={save}
          disabled={create.isPending || update.isPending}
          className='rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white disabled:opacity-50'
        >
          {create.isPending || update.isPending ? 'Saving...' : 'Save draft'}
        </button>
      </div>
    </div>
  );
}
