import { Metadata } from 'next';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Notifications',
    description: 'Stay updated with the latest notifications on Monkeys.',
  };
}

const NotificationsPage = () => {
  return (
    <Container className='pb-12 min-h-screen'>
      <PageHeading
        heading='Notifications'
        badge={
          <Badge variant='secondary'>
            <Icon name='RiCodeSSlash' size={18} className='mr-2' />
            Feature in Development
          </Badge>
        }
      />

      <Tabs defaultValue='all'>
        <div className='mt-6 flex flex-col justify-center items-center'>
          <TabsList className='font-josefin_Sans'>
            <TabsTrigger value='all'>
              <p className='font-josefin_Sans text-base sm:text-lg'>All</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all rounded-full' />
            </TabsTrigger>

            <TabsTrigger className='text-xl' value='account'>
              <p className='font-josefin_Sans text-base sm:text-lg'>Account</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all rounded-full' />
            </TabsTrigger>

            <TabsTrigger className='text-xl' value='post'>
              <p className='font-josefin_Sans text-base sm:text-lg'>Post</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all rounded-full' />
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </Container>
  );
};

export default NotificationsPage;
