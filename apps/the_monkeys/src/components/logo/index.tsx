import Image from 'next/image';

const Logo = () => {
  return (
    <Image
      src={'/logo-brand.svg'}
      alt='Monkeys Logo'
      title='Monkeys Logo'
      height={24}
      width={88}
      className='h-full w-full'
    />
  );
};

export default Logo;
