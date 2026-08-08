import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';
import { Separator } from '@the-monkeys/ui/atoms/separator';

import {
  UpdateProfileSteps,
  useUpdateProfileSteps,
} from '../../store/update-user-profile-steps';

const titles: Record<UpdateProfileSteps, string> = {
  details: 'Update Details',
  'select-image': 'Select Photo',
  'confirm-image': 'Confirm Photo',
  'delete-image': 'Delete Profile Photo',
};

export const UpdateDialogHeader = () => {
  const steps = useUpdateProfileSteps((state) => state.steps);
  const currentStep = useUpdateProfileSteps((state) => state.currentStep);
  const handleBack = useUpdateProfileSteps((state) => state.handleBack);
  console.log(steps[currentStep]);

  return (
    <DialogHeader className='flex flex-row items-center relative h-8 shrink-0'>
      {currentStep > 0 && (
        <>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='rounded-full shrink-0 h-8 w-8 p-0 translate-y-[3px]'
            onClick={handleBack}
          >
            <Icon name='RiArrowLeft' />
          </Button>
          <Separator orientation='vertical' className='h-5 mr-2' />
        </>
      )}

      <DialogTitle className='flex-1 text-left py-0 leading-tight'>
        {titles[steps[currentStep]]}
      </DialogTitle>
      <DialogClose asChild>
        <Button
          type='button'
          variant='secondary'
          size='icon'
          className='rounded-full shrink-0 h-8 w-8 p-0'
        >
          <Icon name='RiClose' size={20} />
          <span className='sr-only'>Close</span>
        </Button>
      </DialogClose>
      <DialogDescription className='hidden' />
    </DialogHeader>
  );
};
