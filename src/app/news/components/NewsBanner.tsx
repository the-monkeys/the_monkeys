import { Badge } from '@/components/ui/badge';

const NewsBanner = () => {
  const getGreeting = () => {
    const hours = new Date().getHours();

    if (hours < 12) {
      return 'Good morning!';
    } else if (hours < 18) {
      return 'Good afternoon!';
    } else {
      return 'Good evening!';
    }
  };

  return (
    <div>
      <Badge variant='secondary' className='w-fit animate-appear-up'>
        News by Monkeys
      </Badge>

      <h1 className='mt-2 font-playfair_Display text-3xl sm:text-4xl md:text-5xl text-primary-monkeyBlack dark:text-primary-monkeyWhite drop-shadow-sm cursor-default animate-appear-up'>
        Stay <span className='text-primary-monkeyOrange'>Informed</span> <br />
        Stay <span className='text-primary-monkeyOrange'>Ahead</span>
      </h1>

      <p className='mt-4 sm:mt-6 font-jost text-sm sm:text-base cursor-default animate-appear-up'>
        {getGreeting()} Your daily dose of news and insights. Stay updated with
        the latest headlines.
      </p>
    </div>
  );
};

export default NewsBanner;
