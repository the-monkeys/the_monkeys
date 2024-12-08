import { LoginStep } from '@/components/modals/login/LoginModal';
import { PublishStep } from '@/components/modals/publish/PublishModal';

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
  {
    id: 4,
    heading: 'Join Monkeys',
    subHeading: 'Create your Monkeys account',
  },
];

export const publishSteps: PublishStep[] = [
  {
    id: 1,
    heading: 'Add Topics',
    subHeading: 'Add suitable topics to your blog (at most 5)',
  },
];
