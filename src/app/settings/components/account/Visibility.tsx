import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const Visibility = () => {
  return (
    <div className='p-1 space-y-2'>
      <p className='font-roboto text-sm opacity-80'>
        Keep yourself anonymous while using Monkeys.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch id='anonymous' disabled />
        <Label htmlFor='anonymous' className='font-roboto text-sm'>
          Go Anonymous
        </Label>
      </div>
    </div>
  );
};
