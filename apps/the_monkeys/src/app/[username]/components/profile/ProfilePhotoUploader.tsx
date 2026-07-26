'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import {
  PROFILE_IMAGE_ACCEPT,
  useUploadProfileImage,
  validateProfileImage,
} from '@/hooks/profile/useProfileImage';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

export type Step = 'details' | 'select-image' | 'confirm-image';

export const ProfilePhotoUploader = ({
  step,
  setStep,
  onSuccess,
}: {
  step: Step;
  setStep: (step: Step) => void;
  onSuccess: () => void;
}) => {
  const { data, isSuccess: isAuthenticated } = useAuth();

  const [uploadError, setUploadError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);
  const changeInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadProfileImage({
    username: data?.username,
    onSuccess: () => {
      setSelectedImage(undefined);
      setUploadError('');
      onSuccess();
    },
    onError: setUploadError,
  });
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError('');

      if (acceptedFiles.length !== 1) {
        setUploadError('Please upload a single file at a time.');
        return;
      }

      const [file] = acceptedFiles;

      const validationError = validateProfileImage(file);
      if (validationError) {
        setUploadError(validationError);
        return;
      }

      setSelectedImage(file);
      setStep('confirm-image');
    },
    [setStep]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: PROFILE_IMAGE_ACCEPT,
  });

  const handleCancel = () => {
    setSelectedImage(undefined);
    setUploadError('');
    setStep('details');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onDrop([file]);

    e.target.value = '';
  };

  if (step === 'select-image') {
    return (
      <div className='flex flex-col h-full animate-in fade-in duration-300 fill-mode-forwards'>
        <div className='flex-1 space-y-4 flex flex-col justify-center'>
          <p className='text-sm opacity-80 text-center w-full pb-4'>
            Upload a JPG or PNG photo — max 5MB
          </p>
          {uploadError && (
            <p className='font-medium text-sm text-alert-red'>{uploadError}</p>
          )}
          <div
            {...getRootProps()}
            className={twMerge(
              'h-52 rounded-md flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-light dark:border-border-dark cursor-pointer',
              isDragActive && 'border-brand-orange'
            )}
          >
            <Icon name='RiUpload2' size={32} />
            <Input {...getInputProps()} />
            <p className='text-sm sm:text-base text-center'>
              Drag image here or click to browse
            </p>
            <p className='text-xs sm:text-sm text-center opacity-80'>
              JPG or PNG, max 5MB
            </p>
          </div>
        </div>
        <div className='flex justify-start pt-6 mt-auto shrink-0'>
          <Button type='button' variant='destructive' onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'confirm-image') {
    return (
      <div className='flex flex-col h-full animate-in fade-in duration-300 fill-mode-forwards'>
        <div className='flex-1 space-y-6 flex flex-col items-center justify-center'>
          <p className='text-sm opacity-80 text-center w-full'>
            This will be your new profile photo.
          </p>
          {uploadError && (
            <p className='font-medium text-sm text-alert-red w-full text-left'>
              {uploadError}
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
            onClick={handleCancel}
            disabled={uploadMutation.isPending}
            className='px-2 sm:px-4 text-sm'
          >
            Cancel
          </Button>
          <div className='flex items-center gap-2 sm:gap-3'>
            <input
              ref={changeInputRef}
              type='file'
              accept='image/jpeg,image/png'
              className='hidden'
              onChange={handleFileChange}
            />
            <Button
              type='button'
              variant='secondary'
              onClick={() => changeInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className='px-2 sm:px-4 text-sm'
            >
              Change
            </Button>
            <Button
              type='button'
              variant='constructive'
              onClick={() => uploadMutation.mutate(selectedImage!)}
              disabled={
                !selectedImage ||
                !data?.username ||
                uploadMutation.isPending ||
                !isAuthenticated
              }
              className='w-[130px] sm:w-[160px] px-1 sm:px-4 text-sm'
            >
              {uploadMutation.isPending ? <Loader /> : null} Update Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
