'use client';

import { useCallback, useEffect, useState } from 'react';

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

export const ProfilePhotoUploader = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) => {
  const { data, isSuccess: isAuthenticated } = useAuth();
  const [uploadError, setUploadError] = useState('');
  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const uploadMutation = useUploadProfileImage({
    username: data?.username,
    onSuccess: () => {
      setSelectedImage(undefined);
      setUploadError('');
      onSuccess();
    },
    onError: setUploadError,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError('');

    if (acceptedFiles.length !== 1) {
      setUploadError('Error: Please upload a single file at a time.');
      return;
    }

    const [file] = acceptedFiles;
    const validationError = validateProfileImage(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setSelectedImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: PROFILE_IMAGE_ACCEPT,
  });

  const removeImage = () => {
    setSelectedImage(undefined);
    setUploadError('');
  };

  const handleCancel = () => {
    removeImage();
    onCancel();
  };

  return (
    <div className='w-full'>
      {!selectedImage && (
        <div className='space-y-2'>
          {uploadError && (
            <p className='font-medium text-sm text-alert-red'>{uploadError}</p>
          )}

          <div
            {...getRootProps()}
            className={twMerge(
              'h-44 sm:h-52 rounded-md flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-light dark:border-border-dark',
              isDragActive && 'border-brand-orange'
            )}
          >
            <Icon name='RiUpload2' size={32} />
            <Input
              {...getInputProps()}
              accept='image/png, image/jpeg'
              type='file'
            />
            <p className='text-sm sm:text-base text-center'>
              {isDragActive
                ? 'Drop the file here ...'
                : 'Drop a file here, or click to select a photo'}
            </p>
            <p className='text-xs sm:text-sm text-center opacity-80'>
              The file should be under 5 MB
            </p>
          </div>
          <div className='flex justify-end pt-2'>
            <Button type='button' variant='secondary' onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className='space-y-4'>
          <div className='flex items-start justify-between gap-4'>
            <div className='space-y-1'>
              <p className='font-medium'>Selected photo</p>
              <p className='text-sm opacity-80'>
                You can apply the changes or choose a different photo.
              </p>
            </div>
            <Button
              type='button'
              variant='secondary'
              onClick={removeImage}
              disabled={uploadMutation.isPending}
            >
              Change image
            </Button>
          </div>

          {uploadError && (
            <p className='font-medium text-sm text-alert-red'>{uploadError}</p>
          )}

          <div className='mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-border-light bg-neutral-100 shadow-[0_24px_80px_rgba(0,0,0,0.25)] dark:border-border-dark dark:bg-neutral-800'>
            {previewUrl && (
              <Image
                src={previewUrl}
                alt='Selected profile preview'
                draggable={false}
                width={360}
                height={360}
                unoptimized
                className='h-auto max-h-[360px] w-full select-none object-contain'
              />
            )}
          </div>

          <div className='flex items-center justify-between gap-3 pt-2'>
            <div className='text-xs sm:text-sm opacity-80'>
              {selectedImage.name} • {(selectedImage.size / 1024).toFixed(1)} KB
            </div>

            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='secondary'
                onClick={handleCancel}
                disabled={uploadMutation.isPending}
                className='rounded-full px-4'
              >
                Cancel
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
                className='rounded-full px-4'
              >
                {uploadMutation.isPending ? (
                  <Loader />
                ) : (
                  <Icon name='RiCheck' />
                )}
                <span className='ml-2'>Apply changes</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
