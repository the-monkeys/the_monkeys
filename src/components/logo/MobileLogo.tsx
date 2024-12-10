import Image from 'next/image';

const MobileLogo = () => {
  return (
    <div className='block md:hidden '>
      <Image
        src={'/logo-full-dark.svg'}
        alt='Monkeys Logo'
        title='Monkeys Logo'
        height={22}
        width={88}
        className='dark:hidden'
      />

      <Image
        src={'/logo-full-light.svg'}
        alt='Monkeys Logo'
        title='Monkeys Logo'
        height={22}
        width={88}
        className='hidden dark:block'
      />
    </div>
  );
};

export default MobileLogo;
