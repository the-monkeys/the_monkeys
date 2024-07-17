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
import { signupSchema } from '@/lib/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';

const Step4 = ({
  setLoginStep,
}: {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setLoading(true);
    const res = await signIn('credentials', {
      first_name: values.first_name,
      last_name: values.last_name,
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
      console.log(res, 'res');

      toast({
        variant: 'error',
        title: 'Login Error',
        description:
          'There was an error registring in. Please check your credentials and try again.',
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

  return (
    <ModalContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter first Name' {...field} />
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter last Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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

          <ul>
            <li className='font-jost text-sm list-disc list-inside opacity-75'>
              Must be at least 6 characters long.
            </li>
            <li className='font-jost text-sm list-disc list-inside opacity-75'>
              Must contain at least one lowercase letter.
            </li>
            <li className='font-jost text-sm list-disc list-inside opacity-75'>
              Must contain at least one uppercase letter.
            </li>
            <li className='font-jost text-sm list-disc list-inside opacity-75'>
              Must contain at least one number.
            </li>
          </ul>

          <div className='pt-6 flex flex-row-reverse  gap-2 items-center'>
            <Button
              disabled={loading ? true : false}
              className='flex-1 order-1'
            >
              {loading && <Loader />} Register
            </Button>

            <Button
              variant='secondary'
              disabled={loading ? true : false}
              className='flex-1 order-2'
              onClick={handlePreviousStep}
            >
              Previous
            </Button>
          </div>
        </form>
      </Form>
    </ModalContent>
  );
};

export default Step4;
