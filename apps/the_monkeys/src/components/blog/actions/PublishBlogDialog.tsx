import { Loader } from '@/components/loader';
import { HashTopicLinksContainer } from '@/components/topics/topicsContainer';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

export const PublishBlogDialog = ({
  topics,
  handlePublish,
  isPublishing,
}: {
  topics: string[];
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

        <div className='space-y-3'>
          <p className='opacity-80'>
            Once published, your post will be visible to everyone. You can edit
            it later, but changes will be reflected publicly.
          </p>

          <div className='space-y-1'>
            <p className='text-sm opacity-80'>Topics:</p>
            <HashTopicLinksContainer topics={topics} />
          </div>
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
