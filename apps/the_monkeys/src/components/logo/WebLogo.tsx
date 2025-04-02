import Image from 'next/image';

const WebLogo = () => {
  return (
    <div className='hidden md:block'>
      <Image
        className='dark:hidden'
        src={'/logo-full-dark.svg'}
        alt='Monkeys Logo'
        title='Monkeys Logo'
        height={28}
        width={112}
      />

      <Image
        className='hidden dark:block'
        src={'/logo-full-light.svg'}
        alt='Monkeys Logo'
        title='Monkeys Logo'
        height={28}
        width={112}
      />
    </div>
  );
};

export default WebLogo;
