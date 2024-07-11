'use client';

import { useCallback, useState } from 'react';

import Image from 'next/image';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import axiosFileInstance from '@/services/api/axiosFileInstance';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const ProfileUpdateDialog = () => {
  const { data, status } = useSession();

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
        `/files/profile/${data?.user.user_name}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${data?.user.token}`,
          },
        }
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
          description: 'An unknown error occured.',
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
      <DialogTrigger className='h-9 w-9 inline-flex items-center justify-center whitespace-nowrap font-jost transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-base rounded-full bg-secondary-darkGrey text-secondary-white dark:bg-secondary-white dark:text-secondary-darkGrey border-2 border-secondary-darkGrey dark:border-secondary-white hover:text-secondary-darkGrey dark:hover:text-secondary-white hover:bg-opacity-0 dark:hover:bg-opacity-0'>
        <Icon name='RiUpload2' />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Update Profile Photo</DialogTitle>

        {!selectedImage && (
          <div className='space-y-2'>
            {uploadError && (
              <p className='font-jost font-medium text-sm text-alert-red'>
                {uploadError}
              </p>
            )}

            <div
              {...getRootProps()}
              className={twMerge(
                'h-44 sm:h-52 rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-dashed border-secondary-lightGrey/25',
                isDragActive &&
                  'border-secondary-darkGrey dark:border-secondary-white'
              )}
            >
              <Icon name='RiUpload2' size={32} />

              <Input
                {...getInputProps()}
                accept='image/png, image/jpeg'
                type='file'
              />

              <p className='font-jost text-sm sm:text-base text-center'>
                {isDragActive
                  ? 'Drop the file here ...'
                  : 'Drop a file here, or click to select files'}
              </p>

              <p className='font-jost text-xs sm:text-sm text-center opacity-75'>
                The file should be under 2 MB
              </p>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className='overflow-hidden'>
            <div className='mx-auto w-fit h-44 sm:h-52 rounded-md overflow-hidden'>
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt='Selected Image'
                width={150}
                height={150}
                className='h-full w-full object-contain'
              />
            </div>

            <div className='flex items-center gap-2'>
              <p className='py-1 flex-1 font-jost truncate'>
                {selectedImage.name}
                <span className='block text-sm opacity-75'>
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
                <Icon name='RiDeleteBin' />
              </Button>

              <Button
                size='icon'
                variant='constructive'
                type='button'
                onClick={onProfileUpload}
                disabled={loading || status === 'unauthenticated'}
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

export default ProfileUpdateDialog;
