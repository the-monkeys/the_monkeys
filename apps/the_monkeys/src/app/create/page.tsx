'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Loader } from '@/components/loader';

const CreatePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Generate a random blogId and redirect to the edit page
    const blogId = Math.random().toString(36).substring(7);
    router.replace(`/edit/${blogId}`);
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Loader size={40} className='text-brand-orange' />
    </div>
  );
};

export default CreatePage;
