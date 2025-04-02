import { Label } from '@the-monkeys/ui/atoms/label';
import { Switch } from '@the-monkeys/ui/atoms/switch';

export const Visibility = () => {
  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>
        Keep yourself anonymous while using Monkeys.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch id='anonymous' disabled />
        <Label htmlFor='anonymous' className='text-sm'>
          Go Anonymous
        </Label>
      </div>
    </div>
  );
};
