import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UserPosts = () => {
  return (
    <div className='px-5 py-4'>
      {/*Remove this 
        <LinksRedirectArrow target='/activity' title='View Activity' />*/}
      {/*Add tabs to switch between Posts and Drafts */}
      <Tabs>
        <div className='flex justify-end'>
          <TabsList>
            <TabsTrigger value='posts'>
              <p>Posts</p>
            </TabsTrigger>
            <TabsTrigger value='drafts'>
              <p>Draft</p>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default UserPosts;
