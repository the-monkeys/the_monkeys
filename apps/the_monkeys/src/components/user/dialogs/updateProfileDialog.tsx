'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { PROFILE_IMAGE_QUERY_KEY } from '@/hooks/profile/useProfileImage';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import {
  type ProfileImageCropState,
  cropProfileImage,
} from '@/utils/profileImageCrop';
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

const DEFAULT_CROP_STATE: ProfileImageCropState = {
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
};

const MAX_ZOOM = 3;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const UpdateProfileDialog = () => {
  const queryClient = useQueryClient();
  const { data, isSuccess: isAuthenticated } = useAuth();

  const [uploadError, setUploadError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [cropState, setCropState] =
    useState<ProfileImageCropState>(DEFAULT_CROP_STATE);
  const [frameSize, setFrameSize] = useState<number>(320);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const cropFrameRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    if (open) {
      return;
    }

    setSelectedImage(undefined);
    setPreviewUrl('');
    setImageDimensions(null);
    setCropState(DEFAULT_CROP_STATE);
    setUploadError('');
    setLoading(false);
  }, [open]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  useEffect(() => {
    if (!previewUrl) {
      setImageDimensions(null);
      return;
    }

    const image = new window.Image();
    image.onload = () => {
      setImageDimensions({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => {
      setUploadError('Error: Failed to load the selected image.');
    };
    image.src = previewUrl;

    return () => {
      image.onload = null;
      image.onerror = null;
      image.src = '';
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!selectedImage || !cropFrameRef.current) {
      return;
    }

    const element = cropFrameRef.current;

    const updateFrameSize = () => {
      const measuredWidth = element.getBoundingClientRect().width;
      if (measuredWidth > 0) {
        setFrameSize(measuredWidth);
      }
    };

    updateFrameSize();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(updateFrameSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [selectedImage]);

  const cropMetrics = useMemo(() => {
    if (!imageDimensions) {
      return null;
    }

    const baseScale = Math.max(
      frameSize / imageDimensions.width,
      frameSize / imageDimensions.height
    );
    const scale = baseScale * cropState.zoom;
    const renderedWidth = imageDimensions.width * scale;
    const renderedHeight = imageDimensions.height * scale;

    return {
      scale,
      renderedWidth,
      renderedHeight,
      maxOffsetX: Math.max(0, (renderedWidth - frameSize) / 2),
      maxOffsetY: Math.max(0, (renderedHeight - frameSize) / 2),
    };
  }, [cropState.zoom, frameSize, imageDimensions]);

  useEffect(() => {
    if (!cropMetrics) {
      return;
    }

    setCropState((current) => {
      const nextState = {
        ...current,
        offsetX: clamp(
          current.offsetX,
          -cropMetrics.maxOffsetX,
          cropMetrics.maxOffsetX
        ),
        offsetY: clamp(
          current.offsetY,
          -cropMetrics.maxOffsetY,
          cropMetrics.maxOffsetY
        ),
        zoom: clamp(current.zoom, 1, MAX_ZOOM),
      };

      if (
        nextState.offsetX === current.offsetX &&
        nextState.offsetY === current.offsetY &&
        nextState.zoom === current.zoom
      ) {
        return current;
      }

      return nextState;
    });
  }, [cropMetrics]);

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
    setCropState(DEFAULT_CROP_STATE);
  }, []);

  const onProfileUpload = async () => {
    if (!selectedImage) {
      return;
    }

    setUploadError('');

    setLoading(true);

    try {
      const croppedImage = await cropProfileImage({
        file: selectedImage,
        frameSize,
        cropState,
      });

      if (croppedImage.size > MAX_FILE_SIZE_BYTES) {
        setUploadError('Error: The cropped image must be under 2 MB.');
        return;
      }

      const formData = new FormData();
      formData.append('profile_pic', croppedImage);

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
        setCropState(DEFAULT_CROP_STATE);
        setOpen(false);
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
    setImageDimensions(null);
    setCropState(DEFAULT_CROP_STATE);
    setUploadError('');
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!cropMetrics) {
      return;
    }

    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: cropState.offsetX,
      originY: cropState.offsetY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !cropMetrics) {
      return;
    }

    if (dragStartRef.current.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragStartRef.current.startX;
    const deltaY = event.clientY - dragStartRef.current.startY;

    setCropState({
      offsetX: clamp(
        dragStartRef.current.originX + deltaX,
        -cropMetrics.maxOffsetX,
        cropMetrics.maxOffsetX
      ),
      offsetY: clamp(
        dragStartRef.current.originY + deltaY,
        -cropMetrics.maxOffsetY,
        cropMetrics.maxOffsetY
      ),
      zoom: cropState.zoom,
    });
  };

  const endDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    if (event && dragStartRef.current?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStartRef.current = null;
  };

  const resetCrop = () => {
    setCropState(DEFAULT_CROP_STATE);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='icon' className='rounded-full'>
          <Icon name='RiUpload2' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-2xl'>
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
                multiple={false}
                type='file'
              />

              <p className='text-sm sm:text-base text-center'>
                {isDragActive
                  ? 'Drop the file here ...'
                  : 'Drop a file here, or click to select a photo'}
              </p>

              <p className='text-xs sm:text-sm text-center opacity-80'>
                You can crop the image before uploading
              </p>
            </div>
          </div>
        )}

        {selectedImage && (
          <div className='space-y-4'>
            <div className='flex items-start justify-between gap-4'>
              <div className='space-y-1'>
                <p className='font-medium'>Crop your profile photo</p>
                <p className='text-sm opacity-80'>
                  Drag the image to reposition it and use zoom to frame the
                  crop.
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
              <p className='font-medium text-sm text-alert-red'>
                {uploadError}
              </p>
            )}

            <div
              ref={cropFrameRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onPointerLeave={endDrag}
              className='relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-2xl border border-border-light bg-black/80 shadow-[0_24px_80px_rgba(0,0,0,0.25)] dark:border-border-dark'
              style={{ touchAction: 'none' }}
            >
              <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.14),transparent_60%)]' />

              {previewUrl && cropMetrics && (
                <img
                  src={previewUrl}
                  alt='Selected profile preview'
                  draggable={false}
                  className='absolute left-1/2 top-1/2 max-w-none select-none'
                  style={{
                    width: `${cropMetrics.renderedWidth}px`,
                    height: `${cropMetrics.renderedHeight}px`,
                    transform: `translate(calc(-50% + ${cropState.offsetX}px), calc(-50% + ${cropState.offsetY}px))`,
                  }}
                />
              )}

              <div className='pointer-events-none absolute inset-0 border-[3px] border-white/80 shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.28)]' />
              <div className='pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/35' />
              <div className='pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/35' />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between gap-3 text-sm'>
                <span className='font-medium'>Zoom</span>
                <span className='tabular-nums opacity-80'>
                  {Math.round(cropState.zoom * 100)}%
                </span>
              </div>

              <input
                type='range'
                min={1}
                max={MAX_ZOOM}
                step='0.01'
                value={cropState.zoom}
                onChange={(event) => {
                  const zoom = Number(event.target.value);
                  setCropState((current) => ({
                    ...current,
                    zoom,
                  }));
                }}
                className='w-full accent-brand-orange'
              />
            </div>

            <div className='flex items-center justify-between gap-3'>
              <div className='text-xs sm:text-sm opacity-80'>
                {selectedImage.name} • {(selectedImage.size / 1024).toFixed(1)}{' '}
                KB
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={resetCrop}
                  disabled={loading}
                >
                  Reset crop
                </Button>

                <Button
                  type='button'
                  variant='constructive'
                  onClick={onProfileUpload}
                  disabled={loading || !isAuthenticated}
                  className='rounded-full px-4'
                >
                  {loading ? <Loader /> : <Icon name='RiCheck' />}
                  <span className='ml-2'>Crop & Upload</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
