import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

export const ShowcaseProfileDialog = ({ username }: { username?: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='size-[30px] flex items-center justify-center'>
          <Icon name='RiEye' type='Fill' className='text-white' />
        </button>
      </DialogTrigger>

      <DialogContent className='w-fit flex items-center justify-center !bg-transparent !shadow-none'>
        <DialogTitle className='hidden'></DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <ProfileFrame className='mx-4 !rounded-none size-[200px] md:size-[300px] ring-2 ring-foreground-light dark:ring-foreground-dark'>
          <ProfileImage username={username} />
        </ProfileFrame>
      </DialogContent>
    </Dialog>
  );
};
