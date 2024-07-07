'use client';

import React, { useState } from 'react';
import axios from 'axios';
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
import { toast } from '@/components/ui/use-toast';

const Username = () => {
  const { data, update } = useSession();
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
      toast({
        variant: 'error',
        title: 'Error',
        description: 'User is not authenticated',
      });
      return { exists: true, message: 'User is not authenticated' };
    }

    try {
      const response = await axios.get(`${API_URL}/user/${username}`, {
        headers: {
          Authorization: `Bearer ${data.user.token}`,
        },
      });

      if (response.status === 200 && response.data?.message === 'the user does not exist') {
        return { exists: false, message: 'Username does not exist' };
      }
      return { exists: true, message: 'Username exists' };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return { exists: false, message: error.response?.data?.message || 'Username does not exist' };
        }
      }
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Error checking username',
      });
      return { exists: true, message: 'Error checking username' };
    }
  };

  const updateUsernameAPI = async (username: string) => {
    if (!data || !data.user) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'User is not authenticated',
      });
      return { message: 'User is not authenticated' };
    }
    try {
      const response = await axios.put(
        `${API_URL}/auth/settings/username/${data.user.user_name}`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${data.user.token}`,
          },
        }
      );

      const updatedUser = { ...data.user, user_name: username };
      await update({ ...data, user: updatedUser });

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Username updated successfully',
      });

      return { message: 'Username updated successfully' };
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Error updating username',
      });
      return { message: 'Error updating username' };
    }
  };

  const onSubmit = async (values: z.infer<typeof updateUsername>) => {
    const result = await checkUsernameExists(values.username);
    if (!result.exists) {
      const updateResult = await updateUsernameAPI(values.username);
      setResponseMessage(updateResult.message);
      form.reset();
      setUsernameExists(null);
    } else {
      toast({
        variant: 'error',
        title: 'Error',
        description: result.message,
      });
      setResponseMessage(result.message);
    }
    setUsernameExists(result.exists);
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
                  </FormItem>
                )}
              />
            </div>

            <Button size='lg' variant='secondary' type='submit'>
              Update
            </Button>
          </div>
          {responseMessage && (
            <p className={`text-sm mt-1 text-primary-monkeyOrange ${usernameExists}`}>
              {responseMessage}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Username;
