'use client';

import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';

import type { PostUndoHandle } from './types';

export function EditUndoRedoButtons({
  handle,
}: {
  handle: PostUndoHandle | null;
}) {
  if (!handle) return null;

  return (
    <div className='flex items-center gap-1'>
      <Button
        type='button'
        variant='ghost'
        aria-label='Undo'
        disabled={!handle.canUndo}
        onClick={() => handle.undo()}
        className='min-h-11 min-w-11 p-0'
      >
        <Icon name='RiArrowGoBack' size={18} />
      </Button>
      <Button
        type='button'
        variant='ghost'
        aria-label='Redo'
        disabled={!handle.canRedo}
        onClick={() => handle.redo()}
        className='min-h-11 min-w-11 p-0'
      >
        <Icon name='RiArrowGoForward' size={18} />
      </Button>
    </div>
  );
}
