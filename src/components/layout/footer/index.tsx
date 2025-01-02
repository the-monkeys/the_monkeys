import Link from 'next/link';

import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { footerList } from '@/constants/footer';
import { MONKEYS_DISCORD, MONKEYS_GITHUB, MONKEYS_X } from '@/constants/social';

import Container from '../Container';

const FooterList = ({
  heading,
  items,
}: {
  heading: string;
  items: {
    text: string;
    link: string;
  }[];
}) => {
  return (
    <div className='space-y-2'>
      <h2 className='font-dm_sans font-medium text-base'>{heading}</h2>

      <ul className='space-y-2'>
        {items.map((item, index) => (
          <li className='text-sm opacity-80 hover:opacity-100' key={index}>
            <Link href={item.link}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  return (
    <Container className='px-4 py-12'>
      <footer className='space-y-6'>
        <Logo showSubHeading={true} />

        <div className='w-full pt-4 flex flex-col sm:flex-row justify-between gap-8'>
          {footerList.map((listItem, index) => {
            return <FooterList {...listItem} key={index} />;
          })}
        </div>

        <div className='pb-8 space-y-2'>
          <div className='flex items-center justify-center gap-4'>
            <Link
              className='opacity-80 hover:opacity-100'
              href={MONKEYS_DISCORD}
              target='_blank'
            >
              <Icon name='RiDiscord' type='Fill' size={18} />
            </Link>

            <Link
              className='opacity-80 hover:opacity-100'
              href={MONKEYS_GITHUB}
              target='_blank'
            >
              <Icon name='RiGithub' type='Fill' size={18} />
            </Link>

            <Link
              className='opacity-80 hover:opacity-100'
              href={MONKEYS_X}
              target='_blank'
            >
              <Icon name='RiTwitterX' type='Fill' size={18} />
            </Link>
          </div>

          <p className='text-xs sm:text-sm text-center opacity-80'>
            Monkeys, All Rights Reserved
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;
