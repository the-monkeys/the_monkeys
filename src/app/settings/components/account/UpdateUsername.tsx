'use client';

import React from 'react';

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
import { updateUsername } from '@/lib/schema/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const UpdateUsername = () => {
  const form = useForm<z.infer<typeof updateUsername>>({
    resolver: zodResolver(updateUsername),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof updateUsername>) {
    console.log(values);
  }

  return (
    <div className='w-full flex flex-col items-start'>
      <p className='font-josefin_Sans text-lg'>Update your Username</p>

      <p className='font-light font-jost opacity-75'>
        Change your username to something that reflects your individuality.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mt-4 w-full space-y-8'
        >
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-josefin_Sans text-sm'>
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    className='w-1/2'
                    variant='border'
                    placeholder='Enter Username'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default UpdateUsername;
