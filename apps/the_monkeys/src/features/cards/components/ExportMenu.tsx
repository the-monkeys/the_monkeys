'use client';

import { CopyImageButton } from '@/components/CopyImageButton';
import { Button } from '@the-monkeys/ui/atoms/button';

import { CardExportOptions } from '../types';

export interface ExportMenuProps {
  isExporting: boolean;
  onExport: (opts?: CardExportOptions) => Promise<unknown>;
  onCopy: () => void;
  copying: boolean;
  copied: boolean;
  onDownloadVCard: () => void;
  filename: string;
  disabled?: boolean;
}

export const ExportMenu = ({
  isExporting,
  onExport,
  onCopy,
  copying,
  copied,
  onDownloadVCard,
  filename,
  disabled,
}: ExportMenuProps) => (
  <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center'>
    <CopyImageButton
      onClick={onCopy}
      disabled={disabled || isExporting}
      copied={copied}
      copying={copying}
    />
    <Button
      className='w-full sm:w-auto'
      onClick={() => onExport({ format: 'png', pixelRatio: 3, filename })}
      disabled={isExporting || disabled}
    >
      {isExporting ? 'Rendering…' : 'Download PNG'}
    </Button>
    <Button
      className='w-full sm:w-auto'
      variant='outline'
      onClick={() => onExport({ format: 'jpeg', pixelRatio: 3, filename })}
      disabled={isExporting || disabled}
    >
      Download JPEG
    </Button>
    <Button
      className='w-full sm:w-auto'
      variant='outline'
      onClick={onDownloadVCard}
      disabled={disabled}
    >
      Download vCard
    </Button>
  </div>
);
