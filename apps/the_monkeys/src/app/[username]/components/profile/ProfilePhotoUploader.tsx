'use client';

import { useCallback, useRef, useState } from 'react';

import useAuth from '@/hooks/auth/useAuth';
import {
  PROFILE_IMAGE_ACCEPT,
  profileImageSchema,
  useUploadProfileImage,
} from '@/hooks/profile/useProfileImage';
import { useDropzone } from 'react-dropzone';

import { useUpdateProfileSteps } from '../../store/update-user-profile-steps';
import { PhotoConfirmStep } from './update-dialog/PhotoConfirmStep';
import { PhotoSelectStep } from './update-dialog/PhotoSelectStep';

export const ProfilePhotoUploader = ({
  username,
  onSuccess,
}: {
  username: string;
  onSuccess: () => void;
}) => {
  const steps = useUpdateProfileSteps((state) => state.steps);
  const currentStep = useUpdateProfileSteps((state) => state.currentStep);
  const handleJumpToStep = useUpdateProfileSteps(
    (state) => state.handleJumpToStep
  );
  const resetStep = useUpdateProfileSteps((state) => state.resetStep);

  const { isSuccess: isAuthenticated } = useAuth();

  const [uploadError, setUploadError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File>();

  const changeInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadProfileImage({
    username,
    onSuccess: () => {
      setSelectedImage(undefined);
      setUploadError('');
      onSuccess();
    },
    onError: () => {},
  });

  const handleUpload = () => {
    if (selectedImage) uploadMutation.mutate(selectedImage);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError('');

    if (acceptedFiles.length === 0) {
      setUploadError('Only JPEG and PNG images are allowed.');
      return;
    }

    if (acceptedFiles.length > 1) {
      setUploadError('Please upload a single file at a time.');
      return;
    }

    const [file] = acceptedFiles;

    const result = profileImageSchema.safeParse(file);
    if (!result.success) {
      setUploadError(result.error.issues[0].message);
      return;
    }

    setSelectedImage(file);
    handleJumpToStep('confirm-image');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: PROFILE_IMAGE_ACCEPT,
  });

  const handleCancel = () => {
    setSelectedImage(undefined);
    setUploadError('');

    resetStep();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onDrop([file]);

    e.target.value = '';
  };

  if (steps[currentStep] === 'select-image')
    return (
      <PhotoSelectStep
        error={uploadError}
        isDragActive={isDragActive}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        onCancel={handleCancel}
      />
    );

  if (steps[currentStep] === 'confirm-image')
    return (
      <PhotoConfirmStep
        file={selectedImage}
        error={uploadError}
        isPending={uploadMutation.isPending}
        canUpload={!!selectedImage && isAuthenticated}
        inputRef={changeInputRef}
        onCancel={handleCancel}
        onChange={handleFileChange}
        onUpload={handleUpload}
      />
    );

  return null;
};
