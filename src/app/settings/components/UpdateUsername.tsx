'use client';

import React from 'react';

import Button from '@/components/button';
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
    <div>
      <div className='grid grid-cols-[25%_70%] px-4 sm:px-6 lg:px-8'>
        <div className='font-josefin_Sans text-xl '>Username</div>
        <div>
          <p className='font-josefin_Sans text-base text-primary-monkeyWhite '>
            Update Your Username
          </p>
          <p className='font-jost text-secondary-mute dark:text-secondary-mute'>
            Change your username to something that reflects your individuality.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-secondary-mute'>
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='max-w-[234px]'
                        variant='border'
                        placeholder='shadcn'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <Button variant='secondary' type='submit' title='submit' /> */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUsername;
