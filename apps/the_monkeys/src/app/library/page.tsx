'use client';

import useAuth from '@/hooks/auth/useAuth';

import { Bookmarks } from './components/Bookmarks';

const LibraryPage = ({
  params,
}: {
  params: {
    source: string;
  };
}) => {
  const source = params.source;
  const { data: session } = useAuth();

  return (
    <div className='mx-auto max-w-4xl min-h-[800px]'>
      {!session ? (
        <div className='min-h-[800px]'>
          <p className='w-full opacity-90 text-center'>
            Login to see bookmarks.
          </p>
        </div>
      ) : (
        <Bookmarks />
      )}
    </div>
  );
};

export default LibraryPage;
