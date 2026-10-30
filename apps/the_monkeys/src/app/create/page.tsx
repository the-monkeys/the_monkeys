'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { EditorBlockSkeleton } from '@/components/skeletons/blogSkeleton';

/**
 * Backward Compatibility Route: /create
 * This page handles legacy links and redirects them directly to the new unified /edit/[id] route.
 */
export default function CreateBlog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const blogId = Math.random().toString(36).substring(7);
    const group = searchParams.get('group')?.trim();
    const groupQuery = group ? `&group=${encodeURIComponent(group)}` : '';
    router.replace(`/edit/${blogId}?isNew=true${groupQuery}`);
  }, [router, searchParams]);

  // Show a skeleton while the redirect is processing
  return (
    <div className='w-full'>
      <EditorBlockSkeleton />
    </div>
  );
}
