'use client';

import { Button } from '@the-monkeys/ui/atoms/button';

import { SnapshotExportOptions } from '../types';

export interface DownloadButtonProps {
  isExporting: boolean;
  onExport: (opts?: SnapshotExportOptions) => Promise<unknown>;
  filename: string;
  disabled?: boolean;
}

export const DownloadButton = ({
  isExporting,
  onExport,
  filename,
  disabled,
}: DownloadButtonProps) => {
  return (
    <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
      <Button
        className='w-full sm:w-auto'
        onClick={() => onExport({ format: 'png', pixelRatio: 2, filename })}
        disabled={isExporting || disabled}
      >
        {isExporting ? 'Rendering…' : 'Download PNG'}
      </Button>
      <Button
        className='w-full sm:w-auto'
        variant='outline'
        onClick={() => onExport({ format: 'jpeg', pixelRatio: 2, filename })}
        disabled={isExporting || disabled}
      >
        Download JPEG
      </Button>
    </div>
  );
};
