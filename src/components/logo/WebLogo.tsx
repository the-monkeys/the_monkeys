import Image from 'next/image';

const WebLogo = () => {
  return (
    <>
      <Image
        className='dark:hidden'
        src={'/logo-full-dark.svg'}
        alt='Monkeys Logo'
        title='Monkeys Logo'
        height={30}
        width={120}
      />

      <Image
        className='hidden dark:block'
        src={'/logo-full-light.svg'}
        alt='Monkeys Logo'
        title='Monkeys Logo'
        height={30}
        width={120}
      />
    </>
  );
};

export default WebLogo;
