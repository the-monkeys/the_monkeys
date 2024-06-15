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
import { signupSteps } from '@/constants/modal';
import { signupSchema } from '@/lib/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ModalContent from '../layout/ModalContent';
import { SignupStep } from './SignupModal';

const Step2 = ({
  setSignupStep,
}: {
  setSignupStep: React.Dispatch<React.SetStateAction<SignupStep>>;
}) => {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log(values);
  }

  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setSignupStep(signupSteps[0]);
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
                  <Input placeholder='Enter first name' {...field} />
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
                  <Input placeholder='Enter last name' {...field} />
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
                  <Input
                    placeholder='Enter Password'
                    {...field}
                    type='password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
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
          </div>

          <div className='pt-6 flex gap-2 items-center'>
            <Button
              variant='secondary'
              className='flex-1'
              onClick={handlePreviousStep}
            >
              Previous
            </Button>

            <Button className='flex-1'>Sign Up</Button>
          </div>
        </form>
      </Form>
    </ModalContent>
  );
};

export default Step2;
