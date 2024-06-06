import { FC, ReactNode } from 'react';

import Image from 'next/image';

import Styles from './styles/homeBannerStyles.module.css';

type HomeBannerProps = {
  children?: ReactNode;
};

const HomeBanner: FC<HomeBannerProps> = ({ children }) => {
  return (
    <div className='mb-12 w-full h-[28rem] relative flex flex-col justify-end items-center overflow-hidden'>
      <Image
        src='./background_banner.svg'
        alt=''
        width={300}
        height={300}
        className={Styles.screen_image}
      />

      <div className={Styles.screen_overlay_linear}></div>

      <div
        className={`${Styles.screen_overlay_radial_dark} opacity-0 dark:opacity-100`}
      ></div>

      <div
        className={`${Styles.screen_overlay_radial_light} opacity-100 dark:opacity-0`}
      ></div>

      <div className='flex flex-col items-center px-5 py-4 z-10 cursor-default'>
        {children}
      </div>
    </div>
  );
};

export default HomeBanner;
