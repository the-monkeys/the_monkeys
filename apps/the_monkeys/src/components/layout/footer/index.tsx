import Link from 'next/link';

import Icon from '@/components/icon';
import Logo from '@/components/logo';
import { footerList } from '@/constants/footer';
import {
  MONKEYS_DISCORD,
  MONKEYS_GITHUB,
  MONKEYS_INSTAGRAM,
  MONKEYS_X,
} from '@/constants/social';

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
    <div className='space-y-4'>
      <h4 className='font-dm_sans font-semibold'>{heading}</h4>

      <ul className='space-y-2'>
        {items.map((item, index) => (
          <li className='text-sm hover:opacity-80' key={index}>
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
      <footer className='space-y-10'>
        <div className='flex flex-col sm:flex-row justify-between flex-wrap gap-10'>
          <div className='space-y-6'>
            <Logo showSubHeading={true} />

            <div>
              <p className='pb-1 font-dm_sans text-xs'>Connect with us</p>

              <div className='flex items-center gap-3'>
                <Link
                  className='opacity-80 hover:opacity-100'
                  href={MONKEYS_X}
                  target='_blank'
                >
                  <Icon name='RiTwitterX' type='Fill' />
                </Link>

                <Link
                  className='opacity-80 hover:opacity-100'
                  href={MONKEYS_DISCORD}
                  target='_blank'
                >
                  <Icon name='RiDiscord' type='Fill' />
                </Link>

                <Link
                  className='opacity-80 hover:opacity-100'
                  href={MONKEYS_GITHUB}
                  target='_blank'
                >
                  <Icon name='RiGithub' type='Fill' />
                </Link>

                <Link
                  className='opacity-80 hover:opacity-100'
                  href={MONKEYS_INSTAGRAM}
                  target='_blank'
                >
                  <Icon name='RiInstagram' type='Fill' />
                </Link>
              </div>
            </div>
          </div>

          <div className='flex flex-wrap gap-12'>
            {footerList.map((listItem, index) => {
              return <FooterList {...listItem} key={index} />;
            })}
          </div>
        </div>

        <div className='pb-8 space-y-2'>
          <p className='text-xs sm:text-sm text-center opacity-80'>
            2025,{' '}
            <Link href='/feed' className='font-medium'>
              Monkeys
            </Link>
            , All Rights Reserved
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;
