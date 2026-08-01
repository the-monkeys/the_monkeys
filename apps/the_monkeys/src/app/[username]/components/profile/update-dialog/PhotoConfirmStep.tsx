import { RefObject, useEffect, useState } from 'react';

import Image from 'next/image';

import { Loader } from '@/components/loader';
import { Button } from '@the-monkeys/ui/atoms/button';

export const PhotoConfirmStep = ({
  file,
  error,
  isPending,
  canUpload,
  inputRef,
  onCancel,
  onChange,
  onUpload,
}: {
  file: File | undefined;
  error: string;
  isPending: boolean;
  canUpload: boolean;
  inputRef: RefObject<HTMLInputElement>;
  onCancel: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className='flex flex-col h-full animate-in fade-in duration-300 fill-mode-forwards'>
      <div className='flex-1 space-y-6 flex flex-col items-center justify-center'>
        <p className='text-sm opacity-80 text-center w-full'>
          This will be your new profile photo.
        </p>
        {error && (
          <p className='font-medium text-sm text-alert-red w-full text-left'>
            {error}
          </p>
        )}
        <div className='w-48 h-48 sm:w-64 sm:h-64 overflow-hidden rounded-full border border-border-light bg-neutral-100 dark:bg-neutral-800 dark:border-border-dark flex items-center justify-center shrink-0 shadow-lg'>
          {previewUrl && (
            <Image
              src={previewUrl}
              alt='Selected profile preview'
              draggable={false}
              width={256}
              height={256}
              unoptimized
              className='h-full w-full object-cover select-none bg-white dark:bg-black'
            />
          )}
        </div>
      </div>
      <div className='flex items-center justify-between gap-2 sm:gap-3 pt-6 mt-auto shrink-0 w-full'>
        <Button
          type='button'
          variant='destructive'
          onClick={onCancel}
          disabled={isPending}
          className='px-2 sm:px-4 text-sm'
        >
          Cancel
        </Button>
        <div className='flex items-center gap-2 sm:gap-3'>
          <input
            ref={inputRef}
            type='file'
            accept='image/jpeg,image/png'
            className='hidden'
            onChange={onChange}
          />
          <Button
            type='button'
            variant='secondary'
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className='px-2 sm:px-4 text-sm'
          >
            Change
          </Button>
          <Button
            type='button'
            variant='constructive'
            onClick={onUpload}
            disabled={!canUpload || isPending}
            className='w-[130px] sm:w-[160px] px-1 sm:px-4 text-sm'
          >
            {isPending && <Loader />} Update Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
