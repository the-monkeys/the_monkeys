import { IconName } from '@/components/icon';

export const X_URL = 'https://x.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in';
export const GITHUB_URL = 'https://github.com';
export const INSTAGRAM_URL = 'https://www.instagram.com';

export const MONKEYS_DISCORD = 'https://discord.gg/6fK9YuV8FV';
export const MONKEYS_GITHUB = 'https://github.com/the-monkeys';
export const MONKEYS_X = 'https://x.com/monkeys_com_co';
export const MONKEYS_INSTAGRAM = 'https://www.instagram.com/monkeys_com_co/';

export const notFoundList = [
  {
    title: 'Join our Discord',
    text: 'Join our Discord to connect, chat, and stay in the loop.',
    icon: 'RiDiscord' as IconName,
    link: MONKEYS_DISCORD,
  },
  {
    title: 'Explore on GitHub',
    text: 'Explore our GitHub for repositories and collaboration tools.',
    icon: 'RiGithub' as IconName,
    link: MONKEYS_GITHUB,
  },
  {
    title: 'Follow us on X',
    text: 'Follow us on X for the latest updates and news highlights.',
    icon: 'RiTwitterX' as IconName,
    link: MONKEYS_X,
  },
  {
    title: 'Monkeys Showcase',
    text: 'Check out latest blogs and news from around the world.',
    icon: 'RiNewspaper' as IconName,
    link: '/feed',
  },
];
