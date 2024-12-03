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
import {
  useGetFollowers,
  useGetFollowing,
} from '@/hooks/user/useUserConnections';

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
      className='px-1 py-2 flex items-center gap-x-2 hover:bg-foreground-light dark:hover:bg-foreground-dark overflow-hidden'
    >
      <h2 className='font-roboto text-sm md:text-base'>
        {first_name} {last_name}
      </h2>

      <p className='flex-1 font-roboto text-xs md:text-sm opacity-75 truncate'>
        {`@${username}`}
      </p>
    </Link>
  );
};

export const ConnectionsDialog = ({ label }: { label: string }) => {
  const { followers, follwerLoading } = useGetFollowers();
  const { following, follwingLoading } = useGetFollowing();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='font-roboto text-sm font-light opacity-80 hover:opacity-100'>
          {label}
        </button>
      </DialogTrigger>

      <DialogContent className='flex flex-col'>
        <DialogTitle>Connections</DialogTitle>

        <Tabs defaultValue='followers' className='space-y-4'>
          <TabsList className='flex gap-0 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack z-30'>
            <TabsTrigger value='followers' className='w-full'>
              <p className='font-dm_sans text-base sm:text-lg opacity-75 group-data-[state=active]:opacity-100'>
                Followers
              </p>

              <div className='mt-[1px] h-[2px] w-0 bg-primary-monkeyOrange group-data-[state=active]:w-full transition-all' />
            </TabsTrigger>

            <TabsTrigger value='following' className='w-full'>
              <p className='font-dm_sans text-base sm:text-lg opacity-75 group-data-[state=active]:opacity-100'>
                Following
              </p>

              <div className='mt-[1px] h-[2px] w-0 bg-primary-monkeyOrange group-data-[state=active]:w-full transition-all' />
            </TabsTrigger>
          </TabsList>

          <div className='max-h-[50vh] sm:max-h-[60vh] overflow-auto'>
            <TabsContent
              className='divide-y-1 divide-secondary-lightGrey/25'
              value='followers'
            >
              {followers?.users ? (
                followers?.users.map((follower) => {
                  return (
                    <ConnectionCard
                      key={follower?.username}
                      first_name={follower.first_name}
                      last_name={follower.last_name}
                      username={follower.username}
                    />
                  );
                })
              ) : (
                <p className='py-4 font-roboto text-center italic opacity-75'>
                  You don&apos;t have any followers yet.
                </p>
              )}
            </TabsContent>

            <TabsContent
              className='divide-y-1 divide-secondary-lightGrey/25'
              value='following'
            >
              {following?.users ? (
                following?.users.map((following) => {
                  return (
                    <ConnectionCard
                      key={following?.username}
                      first_name={following.first_name}
                      last_name={following.last_name}
                      username={following.username}
                    />
                  );
                })
              ) : (
                <p className='py-4 font-roboto text-center italic opacity-75'>
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
