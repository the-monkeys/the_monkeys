'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
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
import { updateUsername } from '@/lib/schema/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { API_URL } from '@/constants/api';

const Username = () => {
  const { data } = useSession();
  const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof updateUsername>>({
    resolver: zodResolver(updateUsername),
    defaultValues: {
      username: '',
    },
  });

  const checkUsernameExists = async (username: string) => {
    if (!data || !data.user) {
      return { exists: true, message: 'User is not authenticated' };
    }

    try {
      const response = await axios.get(`${API_URL}/user/${username}`, {
        headers: {
          Authorization: `Bearer ${data.user.token}`,
        },
      });
      return { exists: response.status === 200, message: response.data?.message || 'Username exists' };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.log('Username does not exist');
          return { exists: false, message: error.response.data?.message || 'Username does not exist' };
        }
      } else {
      }
      return { exists: true, message: 'Error checking username' }; // Assume true in case of error to avoid overwriting existing usernames
    }
  };

  const onSubmit = async (values: z.infer<typeof updateUsername>) => {
    const result = await checkUsernameExists(values.username);
    setUsernameExists(result.exists);
    setResponseMessage(result.message);
  };

  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Update Username</h4>

      <p className='font-jost text-sm opacity-75'>
        Change your username to something that reflects your individuality.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full mt-4'>
          <div className='flex items-end flex-wrap gap-2'>
            <div className='w-full sm:w-1/2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Username
                    </FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder='Enter username' {...field} />
                    </FormControl>
                    {responseMessage && (
                      <p className={`text-sm mt-1 text-primary-monkeyOrange ${usernameExists}`}>
                        {responseMessage}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <Button size='lg' variant='secondary' type='submit'>
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Username;
