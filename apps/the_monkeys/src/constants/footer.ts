import { IconName } from '@/components/icon';

import {
  MONKEYS_DISCORD,
  MONKEYS_GITHUB,
  MONKEYS_INSTAGRAM,
  MONKEYS_TELEGRAM,
  MONKEYS_X,
  MONKEYS_YOUTUBE,
} from './social';

export const footerSocialsList: {
  account: string;
  link: string;
  icon: IconName;
}[] = [
  {
    account: 'github',
    link: MONKEYS_GITHUB,
    icon: 'RiGithub',
  },
  {
    account: 'x',
    link: MONKEYS_X,
    icon: 'RiTwitterX',
  },
  {
    account: 'youtube',
    link: MONKEYS_YOUTUBE,
    icon: 'RiYoutube',
  },
  {
    account: 'discord',
    link: MONKEYS_DISCORD,
    icon: 'RiDiscord',
  },
  {
    account: 'instagram',
    link: MONKEYS_INSTAGRAM,
    icon: 'RiInstagram',
  },
  {
    account: 'telegram',
    link: MONKEYS_TELEGRAM,
    icon: 'RiTelegram2',
  },
];

export const footerLinksList = [
  {
    heading: 'Company',
    items: [
      {
        text: 'Monkeys Feed',
        link: '/feed',
      },
      {
        text: 'About Us',
        link: '/about',
      },
      {
        text: 'Contact Us',
        link: 'mailto:mail.themonkeys.life@gmail.com',
      },
      {
        text: 'Advertise with Us',
        link: '#',
      },
      {
        text: 'Feedback',
        link: '#',
      },
    ],
  },
  {
    heading: 'Topics',
    items: [
      {
        text: 'Artificial Intelligence',
        link: '/topics/Artificial Intelligence',
      },
      {
        text: 'Corportate Layoffs',
        link: '/topics/Corporate Layoffs',
      },
      {
        text: 'Sports',
        link: '/topics/Sports',
      },
      {
        text: 'Healthcare',
        link: '/topics/Healthcare',
      },
      {
        text: 'Explore All',
        link: '/topics/explore',
        disable: false,
      },
    ],
  },
  {
    heading: 'Legal',
    items: [
      {
        text: 'Terms of Use',
        link: '/terms',
      },
      {
        text: 'Privacy Policy',
        link: '/privacy',
      },
      {
        text: 'Cookie Policy',
        link: '/cookies',
      },
    ],
  },
];
