import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { updateUsername } from '@/lib/schema/settings';
import { User } from '@/services/models/user';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { updateUserName } from '@/services/user/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@the-monkeys/ui/molecules/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const UpdateUsernameDialog = ({
  user,
}: {
  user?: GetPublicUserProfileApiResponse;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateUsername>>({
    resolver: zodResolver(updateUsername),
    defaultValues: {
      username: '',
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: (data) => {
      const user = new User(data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });

      form.reset();
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Username updated successfully.',
      });
      router.push(`/${user.username}`);
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Error',
        description: err.message || 'Failed to update username.',
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUsername>) => {
    if (!user) return;

    mutation.mutate({ username: user.username, newUsername: values.username });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='opcity-100 hover:opacity-80'>
          <Icon name='RiPencil' size={16} type='Fill' />
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
                  <FormControl>
                    <Input
                      placeholder={
                        user?.username ? `${user.username}` : 'Enter username'
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='pt-4'>
              <Button
                size='lg'
                disabled={mutation.isPending}
                type='submit'
                className='float-right'
              >
                {mutation.isPending && <Loader />} Update
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
