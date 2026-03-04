'use client';

import { Suspense } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';

const PDFReaderContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  const title = searchParams.get('title') || 'PDF Viewer';

  if (!url) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-4'>
        <Icon name='RiErrorWarning' size={48} className='text-alert-red' />
        <h1 className='text-2xl font-bold'>No PDF URL provided</h1>
        <button
          onClick={() => router.back()}
          className='px-6 py-2 bg-brand-orange text-white rounded-full font-medium'
        >
          Go Back
        </button>
      </div>
    );
  }

  // Append toolbar=0 to hide browser download/print buttons
  const viewerUrl = url.includes('#') ? url : `${url}#toolbar=0`;

  return (
    <div className='flex flex-col h-[calc(100vh-80px)]'>
      <div className='bg-gray-100 dark:bg-gray-900 border-b border-border-light dark:border-border-dark p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => router.back()}
            className='p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors'
          >
            <Icon name='RiArrowLeft' size={24} />
          </button>
          <div>
            <h1 className='font-dm_sans font-semibold text-lg line-clamp-1'>
              {title}
            </h1>
            <p className='text-xs opacity-70'>Monkeys Secure PDF Reader</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='hidden sm:flex items-center gap-2 px-3 py-1 bg-brand-orange/10 text-brand-orange rounded-full text-xs font-medium'>
            <Icon name='RiVerifiedBadge' type='Fill' size={12} />
            Read Only Mode
          </div>
        </div>
      </div>

      <div className='flex-grow bg-gray-200 dark:bg-gray-800 overflow-hidden relative'>
        <iframe
          src={viewerUrl}
          className='w-full h-full border-none'
          title={title}
        />
      </div>
    </div>
  );
};

export default function PDFReaderPage() {
  return (
    <Container className='max-w-6xl py-4 sm:py-8'>
      <div className='rounded-2xl overflow-hidden border border-border-light dark:border-border-dark shadow-xl bg-white dark:bg-zinc-950'>
        <Suspense
          fallback={
            <div className='flex flex-col items-center justify-center min-h-[80vh] gap-4'>
              <div className='w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin'></div>
              <p className='font-dm_sans font-medium'>Initializing reader...</p>
            </div>
          }
        >
          <PDFReaderContent />
        </Suspense>
      </div>
    </Container>
  );
}
