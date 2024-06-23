import { useCallback, useState } from 'react';

import { useDropzone } from 'react-dropzone';

import Icon from '../../../../components/icon';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Input } from '../../../../components/ui/input';

const ProfileUpdateDialog = () => {
  const [uploadError, setUploadError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: any) => {
    setUploadError('');

    if (
      acceptedFiles[0].type !== 'image/png' &&
      acceptedFiles[0].type !== 'image/jpeg'
    ) {
      setUploadError('The file should be either a PNG or JPEG type.');
      return;
    }

    if (acceptedFiles.length > 1) {
      setUploadError('You should upload a single file at a time.');
      return;
    }

    if (acceptedFiles[0].size > 2097152) {
      setUploadError('The file size should be under 2MB.');
      return;
    }

    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Dialog>
      <DialogTrigger className='h-9 w-9 inline-flex items-center justify-center whitespace-nowrap font-jost transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 text-base rounded-full bg-secondary-darkGrey text-secondary-white dark:bg-secondary-white dark:text-secondary-darkGrey border-2 border-secondary-darkGrey dark:border-secondary-white hover:text-secondary-darkGrey dark:hover:text-secondary-white hover:bg-opacity-0 dark:hover:bg-opacity-0'>
        <Icon name='RiUpload2' />
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Update Profile Photo</DialogTitle>

        {uploadError && (
          <p className='font-jost text-sm text-alert-red'>{uploadError}</p>
        )}

        <div
          {...getRootProps()}
          className='h-44 sm:h-52 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-secondary-lightGrey/25'
        >
          <Icon
            name='RiUpload2'
            size={32}
            className={`${isDragActive && 'text-primary-monkeyOrange'}`}
          />

          <Input
            {...getInputProps()}
            accept='image/png, image/jpeg'
            type='file'
          />

          {isDragActive ? (
            <p className='p-2 font-jost text-sm sm:text-base text-center'>
              Drop the files here ...
            </p>
          ) : (
            <p className='p-2 font-jost text-sm sm:text-base text-center'>
              Drag 'n' drop some files here, or click to select files{' '}
              <span className='opacity-75'>
                &#40;profile should be under 2MB&#41;
              </span>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpdateDialog;
