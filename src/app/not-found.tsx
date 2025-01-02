import SocialCard from '@/components/cards/SocialCard';
import Container from '@/components/layout/Container';
import { notFoundList } from '@/constants/social';

const NotFound = () => {
  return (
    <Container className='min-h-screen px-4 py-5 flex flex-col items-center space-y-8 md:space-y-10'>
      <div className='space-y-1'>
        <p className='px-1 font-dm_sans font-medium text-center sm:text-left text-alert-red'>
          Page Not Found
        </p>

        <h4 className='font-arvo text-3xl md:text-5xl text-center sm:text-left text-text-light dark:text-text-dark'>
          Lost your path?
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
