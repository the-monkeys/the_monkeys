import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import PasswordInput from '@/components/input/PasswordInput';
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
import { loginSteps } from '@/constants/modal';
import { loginSchema } from '@/lib/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';

const Step2 = ({
  setLoginStep,
}: {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.ok) {
      router.back();

      toast({
        variant: 'success',
        title: 'Login Successful',
        description: 'You have successfully logged in. Welcome back!',
      });
      setLoading(false);
    }

    if (res?.error) {
      toast({
        variant: 'error',
        title: 'Login Error',
        description:
          'There was an error logging in. Please check your credentials and try again.',
      });
      setLoading(false);
    }
  }

  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setLoginStep(loginSteps[0]);
  };

  const handleForgotPassword = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();

    setLoginStep(loginSteps[2]);
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
                <FormLabel className='font-roboto text-sm'>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-roboto text-sm'>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder='Enter password'
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-6 flex flex-row-reverse  gap-2 items-center'>
            <Button
              className='flex-1 order-1'
              disabled={loading ? true : false}
            >
              {loading && <Loader />} Login
            </Button>

            <Button
              variant='secondary'
              className='flex-1 order-2'
              disabled={loading ? true : false}
              onClick={handlePreviousStep}
            >
              Previous
            </Button>
          </div>
        </form>

        <div className='pt-2 text-right font-roboto text-sm'>
          <Link
            href='#'
            className='text-primary-monkeyOrange'
            onClick={handleForgotPassword}
          >
            Forgot Password
          </Link>
        </div>
      </Form>
    </ModalContent>
  );
};

export default Step2;
