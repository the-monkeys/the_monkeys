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
      <DialogTrigger>
        <Button variant='outline' className='rounded-full'>
          <p>Create Topic</p>
          <Icon name='RiAdd' size={18} className='ml-2' />
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