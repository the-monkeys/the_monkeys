import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@the-monkeys/ui/molecules/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

type Values = z.infer<typeof updateProfileSchema>;

const fields: Array<{
  name: keyof Values;
  label: string;
  placeholder: string;
}> = [
  { name: 'first_name', label: 'First Name', placeholder: 'Enter first name' },
  { name: 'last_name', label: 'Last Name', placeholder: 'Enter last name' },
  { name: 'address', label: 'Location', placeholder: 'Enter location' },
  { name: 'bio', label: 'Bio', placeholder: 'Enter bio' },
];

export const UpdateDetailsStep = ({
  username,
  form,
  loading,
  onSubmit,
  onSelectImage,
  onDeleteImage,
}: {
  username: string;
  form: UseFormReturn<Values>;
  loading: boolean;
  onSubmit: (values: Values) => void;
  onSelectImage: () => void;
  onDeleteImage?: () => void;
}) => (
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
            {onDeleteImage && (
              <Button
                type='button'
                variant='destructive'
                size='icon'
                className='rounded-full'
                onClick={onDeleteImage}
              >
                <Icon name='RiDeleteBin6' />
              </Button>
            )}
            <Button
              type='button'
              variant='secondary'
              size='icon'
              className='rounded-full'
              onClick={onSelectImage}
            >
              <Icon name='RiUpload2' />
            </Button>
          </div>
        </div>

        {fields.map(({ name, label, placeholder }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>{label}</FormLabel>
                <FormControl>
                  <Input
                    className='w-full'
                    {...field}
                    placeholder={placeholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <div className='flex justify-end pt-4 mt-auto shrink-0'>
        <Button disabled={loading} type='submit'>
          {loading && <Loader />} Update
        </Button>
      </div>
    </form>
  </Form>
);
