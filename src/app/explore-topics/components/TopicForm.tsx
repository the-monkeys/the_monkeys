'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useGetProfileTopics } from '@/hooks/useGetProfileTopics';
import useGetAllCategories from '@/hooks/usetGetAllCategories';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLoader4Fill } from '@remixicon/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import * as z from 'zod';

const formSchema = z.object({
  Topic: z
    .string()
    .min(3, 'Topic must be at least 3 characters long')
    .max(40, 'Topic must be at most 40 characters long'),
  SelectedCategory: z.string().min(3),
});
const customStyles: StylesConfig = {
  control: (provided: any, state: any) => ({
    ...provided,
    outline: 'none',
    borderColor: state.isFocused ? '#ff462e' : '#2b2b2b',
    boxShadow: state.isFocused ? '0 0 0 2px #ff462e' : 'none',
    borderRadius: '0.375rem',
    backgroundColor: '#FFF4ed',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: '#FFF4ed',
    border: '1px solid #2b2b2b',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? '#ffd2cc' // monkeyOrange on hover
      : state.isSelected
        ? '#ff462e' // monkeyOrange on selection
        : '#FFF4ed', // monkeyWhite otherwise
    color: state.isSelected || state.isFocused ? 'black' : '#101010',
    padding: '0.5rem 0.75rem',
    ':active': 'bg-[#ff462e]',
    cursor: 'pointer',
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#4f4f4f',
    fontSize: '0.875rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#101010',
    fontSize: '0.875rem',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#101010',
  }),
};

export default function TopicForm({ onSuccess }: { onSuccess: () => void }) {
  const { categories: data, isLoading } = useGetAllCategories();
  const { avaliableTopics, error, isTopicsLoading } = useGetProfileTopics();

  const existingTopics = useMemo(() => avaliableTopics?.topics || [], []);

  const [loading, setLoading] = useState(false);
  const { data: userData, status } = useSession();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Topic: '',
      SelectedCategory: '',
    },
  });

  const categoryOptions = data?.category
    ? Object.keys(data.category).map((key) => ({
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
        category: values.SelectedCategory,
      };

      // const newTopics = inputTopics.filter((t) => !existingTopics.includes(t));

      // if (newTopics.length === 0) {
      //   toast({
      //     variant: 'destructive',
      //     title: 'Topics already present',
      //     description: 'Entered topics are already present ',
      //   });
      // }

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
        className='space-y-8 max-w-3xl mx-auto py-10 w-full'
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
              <FormDescription>
                Enter the name mutiple topics separated by comma(,)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Selector with react-select */}
        <FormField
          control={form.control}
          name='SelectedCategory'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select category</FormLabel>
              <FormControl>
                <Select
                  isDisabled={loading}
                  options={categoryOptions}
                  isLoading={isLoading}
                  placeholder='Select a category'
                  styles={customStyles} // Use the custom styles
                  isClearable
                  onChange={(e: any) => field.onChange(e.value)}
                  className='w-full text-sm' // Tailwind utility class
                  classNamePrefix='react-select'
                />
              </FormControl>
              <FormDescription>
                Select the category of the topic
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type='submit' disabled={loading}>
          {loading ? (
            <>
              Add
              <RiLoader4Fill className='animate-spin' />
            </>
          ) : (
            'Add'
          )}
        </Button>
      </form>
    </Form>
  );
}
