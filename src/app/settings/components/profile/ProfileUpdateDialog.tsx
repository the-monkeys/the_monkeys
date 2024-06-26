'use client';

import { useCallback, useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { axiosFileInstance } from '@/services/fetcher';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

import Icon from '../../../../components/icon';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';

const ProfileUpdateDialog = () => {
  const { data, status } = useSession();

  const [uploadError, setUploadError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const [open, setOpen] = useState<boolean>(false);

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
      setUploadError('Error: Please upload a single file at a time');
      return;
    }

    if (acceptedFiles[0].size > 2097152) {
      setUploadError('Error: The file size must be under 2 MB.');
      return;
    }

    setSelectedImage(acceptedFiles[0]);
  }, []);

  const onProfileUpload = () => {
    if (!selectedImage) {
      return;
    }

    const formData = new FormData();
    formData.append('profile_pic', selectedImage);

    axiosFileInstance
      .post(`/files/profile/${data?.user.user_name}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${data?.user.token}`,
        },
      })
      .then((res) => {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been updated successfully',
        });
        setSelectedImage(undefined);

        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to update the profile photo',
        });
      });
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
          <div>
            <p className='pb-2 font-jost text-sm text-secondary-darkGrey dark:text-secondary-white'>
              {uploadError}
            </p>

            <div
              {...getRootProps()}
              className={twMerge(
                'h-44 sm:h-52 rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-dashed border-secondary-lightGrey/25',
                isDragActive && 'border-primary-monkeyOrange'
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
                  ? 'Drop the files here ...'
                  : 'Drag n drop some files here, or click to select files'}
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

            <p className='pt-2 font-jost truncate'>
              {selectedImage.name}
              <span className='block text-sm opacity-75'>
                {(selectedImage.size / 1024).toFixed(1)} KB
              </span>
            </p>

            <div className='mt-6 flex justify-end gap-2'>
              <Button
                className='w-fit'
                variant='destructive'
                type='button'
                onClick={removeImage}
              >
                Discard
              </Button>

              <Button
                className='w-fit'
                variant='secondary'
                type='button'
                onClick={onProfileUpload}
              >
                Update
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpdateDialog;
