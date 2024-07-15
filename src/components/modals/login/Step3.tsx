import { useState } from 'react';

import { Loader } from '@/components/loader';
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
import { toast } from '@/components/ui/use-toast';
import { API_URL } from '@/constants/api';
import { loginSteps } from '@/constants/modal';
import { forgotPasswordSchema } from '@/lib/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';

const Step3 = ({
  setLoginStep,
}: {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-pass`, {
        email: values.email,
      });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Reset Link Sent',
          description: `Message: ${response.data.message}`,
        });
        setLoginStep(loginSteps[0]);
      }
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Password Reset Error',
        description:
          'There was an error sending the password reset link. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setLoginStep(loginSteps[1]);
  };

  return (
    <ModalContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-6 flex gap-2 items-center'>
            <Button
              variant='secondary'
              className='flex-1'
              onClick={handlePreviousStep}
              disabled={loading ? true : false}
            >
              Previous
            </Button>
            <Button className='flex-1' disabled={loading ? true : false}>
              {loading && <Loader />} Send Link
            </Button>
          </div>
        </form>
      </Form>
    </ModalContent>
  );
};

export default Step3;
