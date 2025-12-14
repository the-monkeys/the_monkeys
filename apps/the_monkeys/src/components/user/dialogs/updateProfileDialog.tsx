'use client';

import { useCallback, useState } from 'react';

import Image from 'next/image';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { PROFILE_IMAGE_QUERY_KEY } from '@/hooks/profile/useProfileImage';
import axiosFileInstance from '@/services/api/axiosFileInstance';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

export const UpdateProfileDialog = () => {
  const queryClient = useQueryClient();
  const { data, isSuccess: isAuthenticated } = useAuth();

  const [uploadError, setUploadError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError('');

    if (
      acceptedFiles[0].type !== 'image/png' &&
      acceptedFiles[0].type !== 'image/jpeg'
    ) {
      setUploadError('Error: The file must be either a PNG or JPEG type.');
      return;
    }

    if (acceptedFiles.length > 1) {
      setUploadError('Error: Please upload a single file at a time.');
      return;
    }

    if (acceptedFiles[0].size > 2097152) {
      setUploadError('Error: The file size must be under 2 MB.');
      return;
    }

    setSelectedImage(acceptedFiles[0]);
  }, []);

  const onProfileUpload = async () => {
    if (!selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append('profile_pic', selectedImage);

    setLoading(true);

    try {
      const response = await axiosFileInstance.post(
        `/files/profile/${data?.username}/profile`,
        formData
      );

      if (response.status === 202) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been updated successfully.',
        });
        setSelectedImage(undefined);

        setOpen(false);
      }

      queryClient.invalidateQueries({
        queryKey: [PROFILE_IMAGE_QUERY_KEY, data?.username],
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to update the profile photo.',
        });
      } else {
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
  });

  const removeImage = () => {
    setSelectedImage(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <Icon name='RiUpload2' />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Update Profile Photo</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        {!selectedImage && (
          <div className='space-y-2'>
            {uploadError && (
              <p className='font-medium text-sm text-alert-red'>
                {uploadError}
              </p>
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
                  : 'Drop a file here, or click to select files'}
              </p>

              <p className='text-xs sm:text-sm text-center opacity-80'>
                The file should be under 2 MB
              </p>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className='overflow-hidden'>
            <div className='mx-auto w-fit h-44 sm:h-52 overflow-hidden'>
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt='Selected Image'
                width={150}
                height={150}
                className='h-full w-full object-contain'
              />
            </div>

            <div className='mt-4 flex items-center gap-2'>
              <p className='py-1 flex-1 truncate'>
                {selectedImage.name}
                <span className='block text-sm opacity-80'>
                  {(selectedImage.size / 1024).toFixed(1)} KB
                </span>
              </p>

              <Button
                size='icon'
                variant='destructive'
                type='button'
                onClick={removeImage}
                disabled={loading}
                className='rounded-full'
              >
                <Icon name='RiDeleteBin6' />
              </Button>

              <Button
                size='icon'
                variant='constructive'
                type='button'
                onClick={onProfileUpload}
                disabled={loading || !isAuthenticated}
                className='rounded-full'
              >
                {loading ? <Loader /> : <Icon name='RiCheck' />}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
