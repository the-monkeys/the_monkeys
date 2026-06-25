'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { EditorBlockSkeleton } from '@/components/skeletons/blogSkeleton';

const CreatePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Preload the editor chunk programmatically without rendering it.
    // This starts the download in the background while the redirect happens.
    import('@/components/editor');

    // Generate a random blogId and redirect to the edit page
    const blogId = Math.random().toString(36).substring(7);
    router.replace(`/edit/${blogId}`);
  }, [router]);

  return (
    <div className='relative min-h-screen'>
      <div className='pt-4 pb-3 flex justify-between items-center gap-2'>
        <div className='px-[10px] py-[1px] flex items-center gap-1 border-1 rounded-full border-alert-green/80 bg-alert-green/20'>
          <div className='inline-block size-2 rounded-full bg-alert-green' />
          <p className='text-xs'>Connecting...</p>
        </div>
      </div>

      <div className='py-3'>
        <EditorBlockSkeleton />
      </div>
    </div>
  );
};

export default CreatePage;
