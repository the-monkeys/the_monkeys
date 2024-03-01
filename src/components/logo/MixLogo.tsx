import Image from 'next/image';

const MixLogo = () => {
  return (
    <>
      <Image
        className='dark:hidden'
        src={'/logo-full-mix-dark.svg'}
        alt='TheMonkeys'
        title='TheMonkeys'
        height={30}
        width={120}
      />
      <Image
        className='hidden dark:block'
        src={'/logo-full-mix-light.svg'}
        alt='TheMonkeys'
        title='TheMonkeys'
        height={30}
        width={120}
      />
    </>
  );
};

export default MixLogo;
