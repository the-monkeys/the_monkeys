import Image from 'next/image';

const MobileLogo = () => {
  return (
    <>
      <Image
        className='dark:hidden'
        src={'/logo-dark.svg'}
        alt='TheMonkeys'
        title='TheMonkeys'
        height={30}
        width={30}
      />
      <Image
        className='hidden dark:block'
        src={'/logo-light.svg'}
        alt='TheMonkeys'
        title='TheMonkeys'
        height={30}
        width={30}
      />
    </>
  );
};

export default MobileLogo;
