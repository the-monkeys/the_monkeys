import Link from 'next/link';

import { ConnectionsListSkeleton } from '@/components/skeletons/userSkeleton';
import {
  useGetFollowers,
  useGetFollowing,
} from '@/hooks/user/useUserConnections';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@the-monkeys/ui/atoms/tabs';

import { FollowButton } from '../buttons/followButton';

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
    <div className='w-full flex justify-between items-center gap-2'>
      <div className='flex-1 space-y-1 overflow-hidden'>
        <Link href={`/${username}`} className='hover:underline truncate'>
          {first_name} {last_name}
        </Link>

        <p className='text-sm opacity-90 truncate'>{`@${username}`}</p>
      </div>

      <FollowButton username={username} className='shrink-0' />
    </div>
  );
};

export const ConnectionsDialog = ({
  label,
}: {
  label: 'followers' | 'following';
}) => {
  const { followers, followerLoading } = useGetFollowers();
  const { following, followingLoading } = useGetFollowing();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='opacity-80 hover:opacity-100 hover:underline capitalize'>
          {label}
        </button>
      </DialogTrigger>

      <DialogContent className='flex flex-col'>
        <DialogTitle>My Connections</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <Tabs defaultValue={label} className='space-y-4'>
          <TabsList className='flex gap-0 bg-background-light dark:bg-background-dark z-30'>
            <TabsTrigger
              disabled={followerLoading}
              value='followers'
              className='w-full'
            >
              <p className='font-dm_sans opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
                Followers
              </p>

              <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
            </TabsTrigger>

            <TabsTrigger
              disabled={followingLoading}
              value='following'
              className='w-full'
            >
              <p className='font-dm_sans opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
                Following
              </p>

              <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
            </TabsTrigger>
          </TabsList>

          <div className='max-h-[50vh] sm:max-h-[60vh] overflow-auto'>
            {!followerLoading || followingLoading ? (
              <ConnectionsListSkeleton />
            ) : (
              <>
                <TabsContent
                  className='divide-y-1 divide-foreground-light dark:divide-foreground-dark'
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
                    <p className='py-4 text-xs sm:text-sm text-center opacity-80'>
                      You don&apos;t have any followers yet.
                    </p>
                  )}
                </TabsContent>

                <TabsContent
                  className='divide-y-1 divide-foreground-light dark:divide-foreground-dark'
                  value='following'
                >
                  {following?.users ? (
                    following?.users.map((following) => {
                      return (
                        <div
                          key={following?.username}
                          className='flex justify-between items-center py-1'
                        >
                          <ConnectionCard
                            key={following?.username}
                            first_name={following.first_name}
                            last_name={following.last_name}
                            username={following.username}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className='py-4 text-xs sm:text-sm text-center opacity-80'>
                      You&apos;re not following anyone yet.
                    </p>
                  )}
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
