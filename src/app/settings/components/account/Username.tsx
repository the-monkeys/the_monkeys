'use client';

import React, { useState } from 'react';

import { useSession } from '@/app/session-store-provider';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { API_URL } from '@/constants/api';
import { updateUsername } from '@/lib/schema/settings';
import axiosInstance from '@/services/api/axiosInstance';
import { User } from '@/services/models/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Username = () => {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateUsername>>({
    resolver: zodResolver(updateUsername),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUsername>) => {
    setLoading(true);

    try {
      const res = await axiosInstance.put(
        `${API_URL}/auth/settings/username/${session?.user?.username}`,
        {
          username: values.username,
        }
      );

      update({
        data: {
          user: new User(res.data),
        },
      });

      form.reset();
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Username updated successfully.',
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to send verification request.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>
        Change your username to something that reflects your individuality.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='flex items-end flex-wrap gap-2'>
            <div className='w-full sm:w-1/2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormMessage />
                    <FormControl>
                      <Input
                        placeholder={
                          session?.user.username
                            ? `${session?.user.username}`
                            : 'Enter username'
                        }
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button size='lg' disabled={loading ? true : false} type='submit'>
              {loading && <Loader />} Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
