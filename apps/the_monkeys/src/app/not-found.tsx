import SocialCard from '@/components/cards/SocialCard';
import Container from '@/components/layout/Container';
import { notFoundList } from '@/constants/social';

const NotFound = () => {
  return (
    <Container className='min-h-[800px] px-4 pt-12 flex flex-col items-center space-y-12'>
      <div className='space-y-1'>
        <p className='font-dm_sans font-medium text-center sm:text-left opacity-80'>
          Page Not Found
        </p>

        <h4 className='font-dm_sans text-3xl md:text-5xl text-center sm:text-left text-text-light dark:text-text-dark'>
          Lost your path
          <span className='font-dm_sans font-medium text-brand-orange'>?</span>
        </h4>
      </div>

      <div className='mx-auto max-w-3xl grid grid-cols-2 gap-4'>
        {notFoundList.map((item, index) => {
          return <SocialCard {...item} key={index} />;
        })}
      </div>
    </Container>
  );
};

export default NotFound;
