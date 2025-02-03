import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from '@/app/session-store-provider';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { API_URL } from '@/constants/api';
import { updateUsername } from '@/lib/schema/settings';
import axiosInstance from '@/services/api/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const UpdateUsernameDialog = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateUsername>>({
    resolver: zodResolver(updateUsername),
    defaultValues: {
      username: '',
    },
  });

  const updateUserSession = async (token: string) => {};

  const onSubmit = async (values: z.infer<typeof updateUsername>) => {
    setLoading(true);

    axiosInstance
      .put(`${API_URL}/auth/settings/username/${session?.user?.username}`, {
        username: values.username,
      })
      .then((res) => {
        updateUserSession(res.data.token);
        form.reset();
        router.push(`/${values.username}`);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Username updated successfully.',
        });
      })
      .catch((err) => {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to update username.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='opcity-100 hover:opacity-80'>
          <Icon
            name='RiPencil'
            size={16}
            type='Fill'
            className='text-brand-orange'
          />
        </button>
      </DialogTrigger>

      <DialogContent className='flex flex-col'>
        <DialogTitle>Update Username</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Username</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      placeholder={
                        session?.user?.username
                          ? `${session?.user?.username}`
                          : 'Enter username'
                      }
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='pt-4'>
              <Button
                size='lg'
                disabled={loading ? true : false}
                type='submit'
                className='float-right'
              >
                {loading && <Loader />} Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
