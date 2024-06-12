import { LoginStep } from '@/components/modals/login/LoginModal';
import { PublishStep } from '@/components/modals/publish/PublishModal';
import { SignupStep } from '@/components/modals/signup/SignupModal';

export const loginSteps: LoginStep[] = [
  {
    id: 1,
    heading: 'Account Login',
    subHeading: 'Select an option to log in',
  },
  {
    id: 2,
    heading: 'Log In',
    subHeading: 'Access your Monkeys account',
  },
  {
    id: 3,
    heading: 'Forgot Password',
    subHeading: 'Enter your email to reset your password',
  },
];

export const signupSteps: SignupStep[] = [
  {
    id: 1,
    heading: 'Join Monkeys',
    subHeading: 'Select an option to sign up',
  },
  {
    id: 2,
    heading: 'Enter Details',
    subHeading: 'Provide your personal information',
  },
];

export const publishSteps: PublishStep[] = [
  {
    id: 1,
    heading: 'Blog Details',
    subHeading: 'Add preview details to your blog',
  },
  {
    id: 2,
    heading: 'Blog Topics',
    subHeading: 'Select suitable topics for your blog',
  },
];
