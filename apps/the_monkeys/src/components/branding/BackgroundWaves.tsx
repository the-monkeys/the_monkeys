import Styles from './styles/backgroundStyles.module.css';

export const BackgroundWaves = () => {
  return (
    <div className='w-full h-full relative flex flex-col justify-end items-center'>
      <div className={Styles.screen_overlay_linear}></div>

      <div
        className={`${Styles.radial_dark} w-full h-full absolute top-0 left-0 hidden dark:block`}
      ></div>

      <div
        className={`${Styles.radial_light} w-full h-full absolute top-0 left-0 block dark:hidden`}
      ></div>
    </div>
  );
};
