'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { EditorBlockSkeleton } from '@/components/skeletons/blogSkeleton';
import { generateBlogUUID } from '@/utils/helper';

/**
 * Backward Compatibility Route: /create
 * This page handles legacy links and redirects them directly to the new unified /edit/[id] route.
 */
export default function CreateBlog() {
  const router = useRouter();

  useEffect(() => {
    // Generate a fresh blog ID
    const blogId = generateBlogUUID();

    // Redirect to the new edit route immediately
    router.replace(`/edit/${blogId}?isNew=true`);
  }, [router]);

  // Show a skeleton while the redirect is processing
  return (
    <div className='w-full'>
      <EditorBlockSkeleton />
    </div>
  );
}
