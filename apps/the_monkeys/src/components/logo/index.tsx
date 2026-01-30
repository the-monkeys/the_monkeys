import { SmartImage } from '@/components/common/SmartImage';

const Logo = () => {
  return (
    <SmartImage
      src={'/logo-brand.svg'}
      alt='Monkeys Logo'
      title='Monkeys Logo'
      height={24}
      width={88}
      containerClassName='h-full w-full bg-transparent dark:bg-transparent'
      unoptimized
    />
  );
};

export default Logo;
