import { Label } from '@the-monkeys/ui/atoms/label';
import { Switch } from '@the-monkeys/ui/atoms/switch';

export const EmailUpdates = () => {
  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>
        Receive latest updates and promotional messages from Monkeys.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch id='emailUpdates' disabled />
        <Label htmlFor='emailUpdates' className='text-sm'>
          Receive Updates
        </Label>
      </div>
    </div>
  );
};
