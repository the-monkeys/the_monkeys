'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Category } from '@/services/category/categoryTypes';

import TopicForm from './AddTopicForm';

export const AddTopicForm = ({
  categories,
  categoriesLoading,
}: {
  categoriesLoading: boolean;
  categories:
    | {
        [key: string]: Category;
      }
    | {};
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger key='add_topic' asChild>
        <Button
          variant='brand'
          size='icon'
          className='rounded-full'
          title='Add new topic'
        >
          <Icon name='RiAdd' size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Add Topic</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <TopicForm
          onSuccess={closeDialog}
          categoriesData={categories}
          isCategoriesLoading={categoriesLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
