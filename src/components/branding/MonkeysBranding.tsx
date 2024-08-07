import Image from 'next/image';

import Styles from './styles/backgroundStyles.module.css';

const MonkeysBranding = () => {
  return (
    <div className='w-full h-80 relative flex flex-col justify-end items-center overflow-hidden'>
      <Image
        src='./logo-branding.svg'
        alt='Monkeys Logo'
        title='Monkeys Logo'
        width={300}
        height={300}
        className='h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-25'
      />

      <div className={Styles.screen_overlay_linear}></div>

      <div
        className={`${Styles.radial_dark} w-full h-full absolute top-0 left-0 opacity-0 dark:opacity-100`}
      ></div>

      <div
        className={`${Styles.radial_light} w-full h-full absolute top-0 left-0 opacity-100 dark:opacity-0`}
      ></div>
    </div>
  );
};

export default MonkeysBranding;
