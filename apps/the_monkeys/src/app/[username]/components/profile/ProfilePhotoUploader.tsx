'use client';

import { useCallback, useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { PROFILE_IMAGE_QUERY_KEY } from '@/hooks/profile/useProfileImage';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export type Step = 'details' | 'select-image' | 'confirm-image';

export const ProfilePhotoUploader = ({
  step,
  setStep,
  onSuccess,
}: {
  step: Step;
  setStep: (step: Step) => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data, isSuccess: isAuthenticated } = useAuth();

  const [uploadError, setUploadError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadError('');

      if (acceptedFiles.length !== 1) {
        setUploadError('Please upload a single file at a time.');
        return;
      }

      const [file] = acceptedFiles;

      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        setUploadError('Only JPG or PNG files are supported.');
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError('Image must be under 2 MB.');
        return;
      }

      setSelectedImage(file);
      setStep('confirm-image');
    },
    [setStep]
  );

  const onProfileUpload = async () => {
    if (!selectedImage) return;

    setUploadError('');

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('profile_pic', selectedImage);

      const response = await axiosInstanceV2.post(
        `/storage/profiles/${data?.username}/profile`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.status === 201) {
        queryClient.invalidateQueries({
          queryKey: [PROFILE_IMAGE_QUERY_KEY, data?.username],
        });

        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been updated successfully.',
        });
        setSelectedImage(undefined);
        setUploadError('');
        onSuccess?.();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setUploadError(`Error: ${err.message}`);
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to update the profile photo.',
        });
      } else {
        setUploadError('Error: An unknown error occurred.');
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
  });

  const handleCancelToDetails = () => {
    setSelectedImage(undefined);
    setUploadError('');
    setStep('details');
  };

  if (step === 'select-image') {
    return (
      <div className='flex flex-col h-full animate-in fade-in duration-300 fill-mode-forwards'>
        <div className='flex-1 space-y-4 flex flex-col justify-center'>
          <p className='text-sm opacity-80 text-center w-full pb-4'>
            Upload a JPG or PNG photo — max 2MB
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
              JPG or PNG, max 2MB
            </p>
          </div>
        </div>
        <div className='flex justify-start pt-6 mt-auto shrink-0'>
          <Button
            type='button'
            variant='destructive'
            onClick={handleCancelToDetails}
          >
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt='Selected profile preview'
                draggable={false}
                className='h-full w-full object-cover select-none bg-white dark:bg-black'
              />
            )}
          </div>
        </div>
        <div className='flex items-center justify-between gap-2 sm:gap-3 pt-6 mt-auto shrink-0 w-full'>
          <Button
            type='button'
            variant='destructive'
            onClick={handleCancelToDetails}
            disabled={loading}
            className='px-2 sm:px-4 text-sm'
          >
            Cancel
          </Button>
          <div className='flex items-center gap-2 sm:gap-3'>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setStep('select-image')}
              disabled={loading}
              className='px-2 sm:px-4 text-sm'
            >
              Change
            </Button>
            <Button
              type='button'
              variant='constructive'
              onClick={onProfileUpload}
              disabled={loading || !isAuthenticated}
              className='w-[130px] sm:w-[160px] px-1 sm:px-4 text-sm'
            >
              {loading ? <Loader /> : null} Update Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
