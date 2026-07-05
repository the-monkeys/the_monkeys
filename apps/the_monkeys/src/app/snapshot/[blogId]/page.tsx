'use client';

import { useMemo } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import {
  extractBlogImages,
  fromBlog,
} from '@/features/snapshot/adapters/fromBlog';
import { SnapshotStudio } from '@/features/snapshot/components/SnapshotStudio';
import { useSnapshotAuthor } from '@/features/snapshot/hooks/useSnapshotAuthor';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

interface SnapshotStudioPageProps {
  params: { blogId: string };
}

export default function SnapshotStudioPage({
  params,
}: SnapshotStudioPageProps) {
  const blogId = decodeURIComponent(params.blogId);
  const { blog, isLoading, isError } =
    useGetPublishedBlogDetailByBlogId(blogId);
  const { user: profile } = useGetProfileInfoById(blog?.owner_account_id);

  const authorUsername = profile?.user?.username;
  const displayName = useMemo(() => {
    const fn = profile?.user?.first_name?.trim();
    const ln = profile?.user?.last_name?.trim();
    return (
      [fn, ln].filter(Boolean).join(' ') || authorUsername || 'the_monkeys'
    );
  }, [profile?.user?.first_name, profile?.user?.last_name, authorUsername]);

  const { author } = useSnapshotAuthor(authorUsername, displayName);

  const input = useMemo(() => {
    if (!blog) return null;
    return fromBlog(blog, {
      author,
      sourceUrl:
        typeof window !== 'undefined'
          ? `${window.location.origin}/blog/${blog.blog_id}`
          : undefined,
    });
  }, [blog, author]);

  const availableImages = useMemo(() => extractBlogImages(blog), [blog]);

  const searchParams = useSearchParams();
  const previewMode: 'template' | 'x' =
    searchParams.get('mode') === 'x' ? 'x' : 'template';

  if (isLoading || !blog) {
    return (
      <div className='mx-auto w-full max-w-6xl px-4 py-8'>
        <Skeleton className='mb-4 h-8 w-48' />
        <Skeleton className='h-[60vh] w-full rounded-2xl' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='mx-auto max-w-md px-4 py-16 text-center'>
        <h1 className='mb-2 font-newsreader text-2xl'>Snapshot unavailable</h1>
        <p className='mb-6 text-foreground/70'>
          We could not load this post. It may be unpublished.
        </p>
        <Link href='/snapshot' className='text-brand-orange underline'>
          Pick another post
        </Link>
      </div>
    );
  }

  if (!input) return null;

  return (
    <div className='mx-auto w-full max-w-6xl px-4 py-6'>
      <div className='mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-1'>
          <Link
            href='/snapshot'
            className='text-xs text-foreground/60 hover:text-foreground'
          >
            ← All posts
          </Link>
          <h1 className='font-newsreader text-2xl'>
            Snapshot
            <span className='text-brand-orange'>.</span>
          </h1>
        </div>

        <div
          className='inline-flex self-start rounded-lg border p-0.5 text-xs sm:self-center shrink-0'
          role='tablist'
          aria-label='Preview mode'
        >
          <Link
            href='/snapshot/video'
            role='tab'
            className='rounded-md px-3 py-1.5 font-medium transition-colors text-foreground/70 hover:text-foreground'
          >
            Brand video
          </Link>
          <Link
            href='?mode=template'
            scroll={false}
            role='tab'
            aria-selected={previewMode === 'template'}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              previewMode === 'template'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            Image template
          </Link>
          <Link
            href='?mode=x'
            scroll={false}
            role='tab'
            aria-selected={previewMode === 'x'}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              previewMode === 'x'
                ? 'bg-brand-orange text-white'
                : 'text-foreground/70 hover:text-foreground'
            }`}
          >
            X screenshot
          </Link>
        </div>
      </div>
      <SnapshotStudio
        input={input}
        availableImages={availableImages}
        previewMode={previewMode}
      />
    </div>
  );
}
