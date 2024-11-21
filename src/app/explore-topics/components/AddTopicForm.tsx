'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useGetProfileTopics } from '@/hooks/useGetProfileTopics';
import useGetAllCategories from '@/hooks/usetGetAllCategories';
import { Category } from '@/services/category/categoryTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLoader4Fill } from '@remixicon/react';
import axios from 'axios';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import * as z from 'zod';

import { customStyles } from './functions/customStyles';

const formSchema = z.object({
  Topic: z
    .string()
    .min(3, 'Topic must be at least 3 characters long')
    .max(40, 'Topic must be at most 40 characters long'),
  Category: z.string().min(3),
});

export default function TopicForm({
  onSuccess,
  categoriesData,
  isCategoriesLoading,
}: {
  isCategoriesLoading: boolean;
  onSuccess: () => void;
  categoriesData: {
    [key: string]: Category;
  };
}) {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const { data: userData, status } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Topic: '',
      Category: '',
    },
  });

  const categoryOptions =
    !isCategoriesLoading && categoriesData?.category
      ? Object.keys(categoriesData.category).map((key) => ({
          value: key,
          label: key,
        }))
      : [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const inputTopics = values.Topic.split(',').map((t) => t.trim());
      const format = {
        topics: inputTopics,
        category: values.Category,
      };

      await axios.post(
        `https://dev.themonkeys.site/api/v1/user/topics`,
        { ...format },
        {
          headers: {
            Authorization: `Bearer ${userData?.user.token}`,
          },
        }
      );
      toast({
        variant: 'success',
        title: 'Success',
        description: 'New topic successfully added.',
      });
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Error in adding a new topic',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-3xl mx-auto py-5 w-full'
      >
        <FormField
          control={form.control}
          name='Topic'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input
                  placeholder='Topic'
                  type='text'
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Selector with react-select */}
        <FormField
          control={form.control}
          name='Category'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  isDisabled={loading}
                  options={categoryOptions}
                  isLoading={isCategoriesLoading}
                  placeholder='Select a category'
                  styles={customStyles(theme == 'dark' ? true : false)}
                  onChange={(e: any) => field.onChange(e.value)}
                  className='w-full text-sm'
                  classNamePrefix='react-select'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className='flex justify-between items-center'>
          <div>
            <RiLoader4Fill
              className={clsx(
                'animate-spin',
                loading ? 'visible' : 'invisible'
              )}
            />
          </div>
          <div>
            <Button
              variant='secondary'
              disabled={loading}
              type='submit'
              className='float-right'
            >
              Add
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
