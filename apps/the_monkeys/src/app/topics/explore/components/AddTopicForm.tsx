'use client';

import { useState } from 'react';

import { Loader } from '@/components/loader';
import { SelectInputStyles } from '@/components/styles/SelectInputStyles';
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
import axiosInstance from '@/services/api/axiosInstance';
import { Category } from '@/services/category/categoryTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import * as z from 'zod';

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

      await axiosInstance.post(`/user/topics`, { ...format });

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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='Topic'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>Topic</FormLabel>
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

        <FormField
          control={form.control}
          name='Category'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>Category</FormLabel>
              <FormControl>
                <Select
                  isDisabled={loading}
                  onChange={(e: any) => field.onChange(e.value)}
                  options={categoryOptions}
                  isLoading={isCategoriesLoading}
                  placeholder='Select a category'
                  styles={SelectInputStyles(theme == 'dark' ? true : false)}
                  className='w-full'
                  classNamePrefix='react-select'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-4'>
          <Button disabled={loading} type='submit' className='float-right'>
            {loading && <Loader />} Add
          </Button>
        </div>
      </form>
    </Form>
  );
}
