import { useState } from 'react';

import { useUpdateProfileSteps } from '@/app/[username]/store/update-user-profile-steps';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import useProfileImage from '@/hooks/profile/useProfileImage';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import { USER_QUERY_KEY } from '@/hooks/user/useUser';
import axiosInstance from '@/services/api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast.js';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@the-monkeys/ui/molecules/form';
import { z } from 'zod';

import useUserForm from '../../useUserForm';

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

type Values = z.infer<typeof updateProfileSchema>;

export const UpdateDetailsStep = ({
  username,
  onSubmitSuccess,
}: {
  username: string;
  onSubmitSuccess?: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const { data } = useGetAuthUserProfile(username);
  const form = useUserForm({ user: data });

  const queryClient = useQueryClient();

  const handleJumpToStep = useUpdateProfileSteps(
    (state) => state.handleJumpToStep
  );
  const handleDeleteImage = () => handleJumpToStep('delete-image');
  const handleSelectImage = () => handleJumpToStep('select-image');

  const { imageUrl } = useProfileImage(username);

  const onSubmit = async (updatedValues: Values) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/user/${username}`, {
        values: {
          ...updatedValues,
          contact_number: data?.contact_number,
          date_of_birth: data?.date_of_birth,
          twitter: data?.twitter,
          linkedin: data?.linkedin,
          instagram: data?.instagram,
          github: data?.github,
        },
      });
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your profile has been updated successfully',
      });

      onSubmitSuccess?.();
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY, username],
      });
    } catch {
      toast({ variant: 'error', title: 'Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col h-full flex-1 animate-in fade-in duration-300 fill-mode-forwards'
      >
        <div className='flex-1 space-y-3 sm:space-y-4 pt-2'>
          <div className='flex flex-wrap items-end gap-2'>
            <p className='w-full text-sm'>Profile Photo</p>
            <ProfileFrame className='size-20 sm:size-24'>
              <ProfileImage username={username} />
            </ProfileFrame>
            <div className='space-x-2'>
              {imageUrl && (
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='rounded-full'
                  onClick={handleDeleteImage}
                >
                  <Icon name='RiDeleteBin6' />
                </Button>
              )}

              <Button
                type='button'
                variant='secondary'
                size='icon'
                className='rounded-full'
                onClick={handleSelectImage}
              >
                <Icon name='RiUpload2' />
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>First Name</FormLabel>
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
            name='last_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>Last Name</FormLabel>
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
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>Location</FormLabel>
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
                <FormLabel className='text-sm'>Bio</FormLabel>
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
        </div>

        <div className='flex justify-end pt-4 mt-auto shrink-0'>
          <Button disabled={loading} type='submit'>
            {loading && <Loader />} Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
