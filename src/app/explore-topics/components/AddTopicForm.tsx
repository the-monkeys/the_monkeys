'use client';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const AddTopicForm = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='outline' className='rounded-full'>
          <p>Create Topic</p>
          <Icon name='RiAdd' size={18} className='ml-2' />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Add Topic</DialogTitle>

        {/* Todo
        Create a form with following inputs:
        1. Topic name (input box)
        2. Category name (select menu) */}
      </DialogContent>
    </Dialog>
  );
};
