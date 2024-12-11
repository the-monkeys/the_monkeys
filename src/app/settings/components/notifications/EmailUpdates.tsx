import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const EmailUpdates = () => {
  return (
    <div className='p-1 space-y-2'>
      <p className='font-roboto text-sm opacity-80'>
        Receive latest updates and promotional messages from Monkeys.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch id='emailUpdates' disabled />
        <Label htmlFor='emailUpdates' className='font-roboto text-sm'>
          Receive Updates
        </Label>
      </div>
    </div>
  );
};
