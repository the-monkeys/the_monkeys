'use client';

import { type ReactNode, useId } from 'react';

import Icon from '@/components/icon';
import { Tabs, TabsList, TabsTrigger } from '@the-monkeys/ui/atoms/tabs';

import { editorToolClass } from './editorToolClass';

interface EditorToolbarProps {
  connected: boolean;
  saving?: boolean;
  preview: boolean;
  imageUploading: boolean;
  onViewChange: (preview: boolean) => void;
  readinessAction: ReactNode;
  publishAction: ReactNode;
}

export function EditorToolbar({
  connected,
  saving = false,
  preview,
  imageUploading,
  onViewChange,
  readinessAction,
  publishAction,
}: EditorToolbarProps) {
  const uploadHintId = useId();
  return (
    <div
      className='grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 pb-3 pt-4 font-dm_sans sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'
      data-shortcut-scope='chrome'
      aria-label='Editor toolbar'
    >
      <div className='min-w-0 text-xs text-gray-500 dark:text-gray-400'>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 ${connected ? 'border-alert-green/80 bg-alert-green/20' : 'border-alert-red/80 bg-alert-red/20'}`}
        >
          <span
            aria-hidden='true'
            className={`size-1.5 rounded-full ${connected ? 'bg-alert-green' : 'bg-alert-red'}`}
          />
          {connected ? 'Online' : 'Offline'}
        </span>
        {connected && saving && (
          <span className='ml-2 inline-block'>Saving…</span>
        )}
        {!connected && (
          <span className='mt-1 block'>Changes may not be synced.</span>
        )}
      </div>
      <div className='col-span-2 row-start-2 flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:col-span-1 sm:col-start-2 sm:row-start-1'>
        <Tabs
          value={preview ? 'preview' : 'edit'}
          onValueChange={(value) => onViewChange(value === 'preview')}
        >
          <TabsList aria-label='Writing view' className='gap-2'>
            <TabsTrigger className={editorToolClass} value='edit'>
              <span aria-hidden='true'>
                <Icon name='RiPencil' size={16} />
              </span>
              Edit
            </TabsTrigger>
            <TabsTrigger
              className={editorToolClass}
              value='preview'
              disabled={imageUploading}
              aria-describedby={imageUploading ? uploadHintId : undefined}
            >
              <span aria-hidden='true'>
                <Icon name='RiEye' size={16} />
              </span>
              Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {readinessAction}
      </div>
      <div className='col-start-2 row-start-1 flex min-w-0 justify-end [&>button]:min-h-11 sm:col-start-3'>
        {publishAction}
      </div>
      {imageUploading && (
        <p
          id={uploadHintId}
          className='col-span-2 text-sm text-gray-500 dark:text-gray-400 sm:col-span-3'
        >
          Image uploading. Preview will be available when it finishes.
        </p>
      )}
    </div>
  );
}
