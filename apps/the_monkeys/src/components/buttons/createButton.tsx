'use client';

import { useRouter } from 'next/navigation';

import Icon from '../icon';

export const CreateButton = () => {
  const router = useRouter();

  const handleCreate = () => {
    // Generate a unique blogId immediately
    const blogId = Math.random().toString(36).substring(7);
    // Navigate directly to the edit page with isNew flag to skip redundant fetch
    window.location.href = `/edit/${blogId}?isNew=true`;
  };

  return (
    <button
      onClick={handleCreate}
      // Prefetch the edit route on hover to speed up the subsequent navigation
      onMouseEnter={() => router.prefetch('/edit/[blogId]')}
      title='Create Post'
      className='group h-9 flex items-center gap-1 px-[6px] sm:px-4 py-[6px] border-2 border-brand-orange text-white bg-brand-orange rounded-full hover:bg-brand-orange/20 hover:text-brand-orange transition-all active:scale-95'
    >
      <Icon name='RiAdd' />
      <p className='hidden sm:block font-dm_sans font-bold'>Create</p>
    </button>
  );
};
