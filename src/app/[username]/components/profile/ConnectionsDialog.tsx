import Link from 'next/link';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetFollowers, useGetFollowing } from '@/hooks/useFollowStatus';

const ConnectionCard = ({
  first_name,
  last_name,
  username,
}: {
  first_name: string;
  last_name: string;
  username: string;
}) => {
  return (
    <Link
      href={`/${username}`}
      className='p-2 flex items-center flex-wrap gap-x-2 hover:bg-secondary-lightGrey/15'
    >
      <h2 className='font-josefin_Sans capitalize'>
        {`${first_name} ${last_name}`}
      </h2>

      <p className='font-jost text-sm opacity-75 truncate'>{`@${username}`}</p>
    </Link>
  );
};

export const ConnectionsDialog = () => {
  const { followers, follwerLoading } = useGetFollowers();
  const { following, follwingLoading } = useGetFollowing();

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Icon name='RiLinks' />
        </Button>
      </DialogTrigger>

      <DialogContent className='flex flex-col max-h-[60vh] sm:max-h-[80vh] overflow-hidden'>
        <DialogTitle>My Connections</DialogTitle>

        <Tabs
          defaultValue='followers'
          className='max-h-fit space-y-4 overflow-auto'
        >
          <TabsList className='py-2 sticky top-0 flex gap-0 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack z-30'>
            <TabsTrigger value='followers' className='w-full'>
              <p className='font-josefin_Sans text-lg'>Followers</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-full transition-all' />
            </TabsTrigger>

            <TabsTrigger value='following' className='w-full'>
              <p className='font-josefin_Sans text-lg'>Following</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-full transition-all' />
            </TabsTrigger>
          </TabsList>

          <div className='overflow-auto'>
            <TabsContent
              className='w-full divide-y-1 divide-secondary-lightGrey/25'
              value='followers'
            >
              {followers?.users ? (
                followers?.users.map((follower) => {
                  return (
                    <ConnectionCard
                      first_name={follower.first_name}
                      last_name={follower.last_name}
                      username={follower.username}
                    />
                  );
                })
              ) : (
                <p className='py-4 font-jost text-center italic opacity-75'>
                  You don&apos;t have any followers yet.
                </p>
              )}
            </TabsContent>

            <TabsContent className='w-full' value='following'>
              {following?.users ? (
                following?.users.map((following) => {
                  return (
                    <ConnectionCard
                      first_name={following.first_name}
                      last_name={following.last_name}
                      username={following.username}
                    />
                  );
                })
              ) : (
                <p className='py-4 font-jost text-center italic opacity-75'>
                  You&apos;re not following anyone yet.
                </p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
