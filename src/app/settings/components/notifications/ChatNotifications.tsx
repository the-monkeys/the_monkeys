import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const ChatNotifications = () => {
  return (
    <div className='p-1 space-y-2'>
      <p className='font-roboto text-sm opacity-80'>
        Get notifications via WhatsApp.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch id='anonymous' disabled />
        <Label htmlFor='anonymous' className='font-roboto text-sm'>
          Get Notifications
        </Label>
      </div>
    </div>
  );
};
