'use client';

import { useCallback, useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { PROFILE_IMAGE_QUERY_KEY } from '@/hooks/profile/useProfileImage';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export const ProfilePhotoUploader = ({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  const { data, isSuccess: isAuthenticated } = useAuth();

  const [uploadError, setUploadError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // If the uploader is unmounted, clean up the object URL.
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError('');

    if (acceptedFiles.length !== 1) {
      setUploadError('Error: Please upload a single file at a time.');
      return;
    }

    const [file] = acceptedFiles;

    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setUploadError('Error: The file must be either a PNG or JPEG type.');
      return;
    }

    setSelectedImage(file);
  }, []);

  const onProfileUpload = async () => {
    if (!selectedImage) {
      return;
    }

    setUploadError('');

    if (selectedImage.size > MAX_FILE_SIZE_BYTES) {
      setUploadError('Error: The image must be under 2 MB.');
      return;
    }

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
        // Invalidate the cached profile image so useProfileImage refetches the new one.
        queryClient.invalidateQueries({
          queryKey: [PROFILE_IMAGE_QUERY_KEY, data?.username],
        });

        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile photo has been updated successfully.',
        });
        setSelectedImage(undefined);
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
    multiple: false,
  });

  const removeImage = () => {
    setSelectedImage(undefined);
    setPreviewUrl('');
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
              The file should be under 2 MB
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
              disabled={loading}
            >
              Change image
            </Button>
          </div>

          {uploadError && (
            <p className='font-medium text-sm text-alert-red'>{uploadError}</p>
          )}

          <div className='mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-border-light bg-black/80 shadow-[0_24px_80px_rgba(0,0,0,0.25)] dark:border-border-dark'>
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt='Selected profile preview'
                draggable={false}
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
                disabled={loading}
                className='rounded-full px-4'
              >
                Cancel
              </Button>
              <Button
                type='button'
                variant='constructive'
                onClick={onProfileUpload}
                disabled={loading || !isAuthenticated}
                className='rounded-full px-4'
              >
                {loading ? <Loader /> : <Icon name='RiCheck' />}
                <span className='ml-2'>Apply changes</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const UpdateProfileDialog = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <Icon name='RiUpload2' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-2xl px-4 pb-8'>
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
        </DialogHeader>

        <ProfilePhotoUploader
          onCancel={() => setOpen(false)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
