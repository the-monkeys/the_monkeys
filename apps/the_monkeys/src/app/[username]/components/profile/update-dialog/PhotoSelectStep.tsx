import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone';
import { twMerge } from 'tailwind-merge';

export const PhotoSelectStep = ({
  error,
  isDragActive,
  getRootProps,
  getInputProps,
  onCancel,
}: {
  error: string;
  isDragActive: boolean;
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  onCancel: () => void;
}) => (
  <div className='flex flex-col h-full animate-in fade-in duration-300 fill-mode-forwards'>
    <div className='flex-1 space-y-4 flex flex-col justify-center'>
      <p className='text-sm opacity-80 text-center w-full pb-4'>
        Upload a JPG or PNG photo — max 5MB
      </p>
      {error && <p className='font-medium text-sm text-alert-red'>{error}</p>}
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
      <Button type='button' variant='destructive' onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </div>
);
