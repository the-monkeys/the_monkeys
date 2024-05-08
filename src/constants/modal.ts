import { LoginStep } from '@/components/modals/login/LoginModal';
import { PublishStep } from '@/components/modals/publish/PublishModal';
import { SignupStep } from '@/components/modals/signup/SignupModal';

export const loginSteps: LoginStep[] = [
  {
    id: 1,
    heading: 'Account Login',
    subHeading: 'choose an option to continue',
  },
  {
    id: 2,
    heading: 'Log in',
    subHeading: 'to continue to Monkeys',
  },
  {
    id: 3,
    heading: 'Welcome',
    subHeading: 'to Monkeys',
  },
];

export const signupSteps: SignupStep[] = [
  {
    id: 1,
    heading: 'Join Monkeys',
    subHeading: 'choose an option to continue',
  },
  {
    id: 2,
    heading: 'Basic Details',
    subHeading: 'enter first name and last name',
  },
  {
    id: 3,
    heading: 'Login Details',
    subHeading: 'set email address',
  },
  {
    id: 4,
    heading: 'Almost there',
    subHeading: 'secure your account',
  },
];

export const publishSteps: PublishStep[] = [
  {
    id: 1,
    heading: 'Blog Preview',
    subHeading: 'add preview details',
  },
  {
    id: 2,
    heading: 'Blog Details',
    subHeading: 'select suitable topics for your blog',
  },
  {
    id: 3,
    heading: '',
    subHeading: '',
  },
];
