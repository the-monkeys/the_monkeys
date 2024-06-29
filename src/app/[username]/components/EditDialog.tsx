import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import useUser from '@/hooks/useUser';
import { updateProfileDetailsSchema } from '@/lib/schema/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EditDialog = () => {
  const { data, status } = useSession();

  const { user, isLoading, isError } = useUser(data?.user?.user_name);

  if (isLoading) return <p className='font-jost'>Fetching Details</p>;

  if (isError) return null;

  const form = useForm<z.infer<typeof updateProfileDetailsSchema>>({
    resolver: zodResolver(updateProfileDetailsSchema),
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      location: user?.address || '',
      bio: user?.bio || '',
    },
  });

  return (
    <Dialog>
      <DialogTrigger className='p-2 flex w-full items-center gap-2 hover:opacity-75'>
        <Icon name='RiEdit' />

        <p className='font-josefin_Sans text-base'>Edit Details</p>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Details</DialogTitle>

        <Form {...form}>
          <form className='space-y-4'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-josefin_Sans text-sm'>
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter first name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-josefin_Sans text-sm'>
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter last name'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-josefin_Sans text-sm'>
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter location'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='bio'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-josefin_Sans text-sm'>
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter bio'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='pt-4'>
              <Button className='float-right'>Update Details</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
