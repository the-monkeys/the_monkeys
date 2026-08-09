import { DeleteProfilePhotoConfirmation } from '@/components/user/dialogs/deleteProfileDialog';
import { IUser } from '@/services/models/user';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@the-monkeys/ui/atoms/drawer';

import useUpdateProfile from '../../hooks/useUpdateProfile';
import { useUpdateProfileSteps } from '../../store/update-user-profile-steps';
import { updateProfileStepTitles } from '../UpdateUserDialog/UpdateDialogHeader';
import { ProfilePhotoUploader } from '../profile/ProfilePhotoUploader';
import { UpdateDetailsStep } from '../profile/update-dialog/UpdateDetailsStep';

export default function UpdateUserDrawer({ data }: { data: IUser }) {
  const { open, toggleOpen } = useUpdateProfile();

  const steps = useUpdateProfileSteps((state) => state.steps);
  const currentStep = useUpdateProfileSteps((state) => state.currentStep);

  const isDeleteStep = steps[currentStep] === 'delete-image';

  return (
    <Drawer open={open} onOpenChange={toggleOpen}>
      <DrawerTrigger asChild>
        <Button variant='secondary' className='!text-base rounded-full'>
          Update
        </Button>
      </DrawerTrigger>

      <DrawerContent className='px-3 py-4'>
        <DrawerHeader>
          <DrawerTitle>
            {updateProfileStepTitles[steps[currentStep]]}
          </DrawerTitle>
        </DrawerHeader>

        {currentStep === 0 ? (
          <UpdateDetailsStep
            username={data.username}
            onSubmitSuccess={toggleOpen}
          />
        ) : isDeleteStep ? (
          <DeleteProfilePhotoConfirmation username={data.username} />
        ) : (
          <ProfilePhotoUploader
            username={data.username}
            onSuccess={toggleOpen}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
}
