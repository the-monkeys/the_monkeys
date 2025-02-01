import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import moment from 'moment';

export const PublishBlogDialog = ({
  handlePublish,
  isPublishing,
}: {
  handlePublish: () => void;
  isPublishing: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' title='Publish Blog' className='rounded-full'>
          Publish
        </Button>
      </DialogTrigger>

      <DialogContent className='!max-w-xl'>
        <DialogTitle>Ready to Share?</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <div className='space-y-2'>
          <p className='opacity-80'>
            Once published, your post will be visible to everyone. You can edit
            it later, but changes will be reflected publicly.
          </p>
        </div>

        <div className='pt-4'>
          <Button
            type='button'
            className='w-fit float-right'
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing && <Loader />}
            {isPublishing ? 'Publishing' : 'Publish Now'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
