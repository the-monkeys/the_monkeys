import { IUser } from '@/services/models/user';
import { TabsList, TabsTrigger } from '@the-monkeys/ui/atoms/tabs';

export const NavigationTabs = ({
  username,
  user,
}: {
  username: string;
  user?: IUser;
}) => {
  return (
    <TabsList className='flex justify-center gap-0'>
      <TabsTrigger value='posts'>
        <p className='px-[10px] font-dm_sans text-sm sm:text-base opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
          Posts
        </p>

        <div className='mt-[6px] h-[1px] w-0 bg-brand-orange rounded-full group-data-[state=active]:w-4/5 transition-all' />
      </TabsTrigger>

      {user?.username === username && (
        <TabsTrigger value='drafts'>
          <p className='px-[10px] font-dm_sans text-sm sm:text-base opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
            Drafts
          </p>

          <div className='mt-[6px] h-[1px] w-0 bg-brand-orange rounded-full group-data-[state=active]:w-4/5 transition-all' />
        </TabsTrigger>
      )}
    </TabsList>
  );
};
