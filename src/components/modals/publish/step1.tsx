'use client';

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
import { publishSteps } from '@/constants/modal';
import { blogDetailsSchema } from '@/lib/schema/blog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ModalContent from '../layout/ModalContent';
import { PublishStep } from './PublishModal';

const Step1 = ({
  setPublishStep,
}: {
  setPublishStep: React.Dispatch<React.SetStateAction<PublishStep>>;
}) => {
  const form = useForm<z.infer<typeof blogDetailsSchema>>({
    resolver: zodResolver(blogDetailsSchema),
    defaultValues: {
      title: '',
      subheading: '',
    },
  });

  return (
    <ModalContent>
      <Form {...form}>
        <form className='space-y-2'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Add preview title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='subheading'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subheading</FormLabel>
                <FormControl>
                  <Input placeholder='Add preview subheading' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-6 flex gap-2 items-center'>
            <Button variant='secondary' className='flex-1'>
              Save as Draft
            </Button>

            <Button
              className='flex-1'
              onClick={() => setPublishStep(publishSteps[1])}
            >
              Add Topics
            </Button>
          </div>
        </form>
      </Form>
    </ModalContent>
  );
};

export default Step1;
