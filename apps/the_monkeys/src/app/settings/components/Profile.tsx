import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Loader } from '@/components/loader';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { DeleteProfileDialog } from '@/components/user/dialogs/deleteProfileDialog';
import { UpdateProfileDialog } from '@/components/user/dialogs/updateProfileDialog';
import useProfileImage from '@/hooks/profile/useProfileImage';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import { birthdayReturnPath } from '@/lib/moderationNavigation';
import { queryKeys } from '@/lib/queryKeys';
import { updateProfileSchema } from '@/lib/schema/settings';
import axiosInstance from '@/services/api/axiosInstance';
import { IUser } from '@/services/models/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
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

import { Section } from './Section';
import { profileBirthdayDate } from './profile/parseDate';

export const Profile = ({ data }: { data?: IUser }) => {
  const { data: user } = useGetAuthUserProfile(data?.username);
  const { imageUrl } = useProfileImage(data?.username);
  const [loading, setLoading] = useState<boolean>(false);
  const hasProfileImage = imageUrl !== '';
  const router = useRouter();
  const queryClient = useQueryClient();
  const [birthdayCompletion, setBirthdayCompletion] = useState(false);
  const today = new Date();
  const latestBirthday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      address: '',
      contact_number: '',
      bio: '',
      date_of_birth: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      github: '',
    },
  });

  function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    if (birthdayCompletion && !values.date_of_birth) {
      form.setError('date_of_birth', {
        message: 'Add your birthday before returning to the content.',
      });
      return;
    }
    setLoading(true);
    axiosInstance
      .put(`/user/${data?.username}`, {
        values,
      })
      .then(async () => {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.profile.authenticated(
            data?.username,
            data?.account_id
          ),
          exact: true,
        });
        // Eligibility must be checked again after any profile birthday update.
        await queryClient.invalidateQueries({ queryKey: ['content-access'] });
        const returnTo = birthdayReturnPath(window.location.search);
        if (returnTo && values.date_of_birth) router.push(returnTo);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile has been updated successfully',
        });
      })
      .catch((err) => {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        address: user.address ?? '',
        contact_number: user.contact_number ?? '',
        bio: user.bio ?? '',
        date_of_birth: profileBirthdayDate(user.date_of_birth),
        twitter: user.twitter ?? '',
        linkedin: user.linkedin ?? '',
        instagram: user.instagram ?? '',
        github: user.github ?? '',
      });
    }
  }, [user, form]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('focus') === 'birthday') {
      setBirthdayCompletion(true);
      window.requestAnimationFrame(() => form.setFocus('date_of_birth'));
    }
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Section sectionTitle='Basic Information'>
          <div className='p-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='col-span-1 sm:col-span-2 flex flex-wrap items-end gap-2'>
              <p className='w-full col-span-1 sm:col-span-2 text-sm'>
                Profile Photo
              </p>

              <ProfileFrame className='size-[100px] sm:size-[120px]'>
                {data?.username && <ProfileImage username={data.username} />}
              </ProfileFrame>

              <div className='space-x-2'>
                {hasProfileImage && <DeleteProfileDialog />}

                <UpdateProfileDialog />
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
              name='contact_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter contact number'
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

            <FormField
              control={form.control}
              name='date_of_birth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='profile-birthday' className='text-sm'>
                    Birth Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id='profile-birthday'
                      aria-label='Birth Date'
                      value={field.value || ''}
                      className='w-full'
                      type='date'
                      min='1900-01-01'
                      max={latestBirthday}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <Section sectionTitle='Social Accounts'>
          <div className='p-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='twitter'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter username'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='linkedin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter username'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='instagram'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter username'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='github'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>GitHub</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
                      {...field}
                      placeholder='Enter username'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <div className='flex justify-end'>
          <Button size='lg' disabled={loading ? true : false} type='submit'>
            {loading && <Loader />} Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
