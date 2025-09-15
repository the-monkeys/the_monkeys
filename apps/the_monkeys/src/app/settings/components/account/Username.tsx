import { Loader } from '@/components/loader';
import { updateUsername as updateUsernameSchema } from '@/lib/schema/settings';
import { IUser } from '@/services/models/user';
import { updateUserName } from '@/services/user/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@the-monkeys/ui/molecules/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Username = ({ data }: { data: IUser }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof updateUsernameSchema>>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      username: '',
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });

      form.reset();
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Username updated successfully.',
      });
    },
    onError: (err) => {
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
    },
  });

  const onSubmit = async (values: z.infer<typeof updateUsernameSchema>) => {
    if (!data) return;

    mutation.mutate({ username: data.username, newUsername: values.username });
  };

  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>
        Change your username to something that reflects your individuality.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='flex items-center gap-[6px]'>
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
                          data?.username ? `${data.username}` : 'Enter username'
                        }
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              variant='secondary'
              size='lg'
              disabled={mutation.isPending}
              type='submit'
              className='shrink-0'
            >
              {mutation.isPending && <Loader />} Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
