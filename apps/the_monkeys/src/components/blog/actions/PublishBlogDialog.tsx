import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
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
        <Button
          variant='brand'
          size='sm'
          title='Publish Blog'
          className='rounded-full'
        >
          Publish
        </Button>
      </DialogTrigger>

      <DialogContent className='!max-w-xl'>
        <DialogTitle>Ready to Share?</DialogTitle>

        <DialogDescription className='hidden'></DialogDescription>

        <div className='space-y-6'>
          <p>
            Once published, your post will be visible to everyone. You can edit
            it later, but changes will be reflected publicly.
          </p>

          <div className='space-y-2'>
            <p className='font-dm_sans font-medium text-sm'>Topics Included</p>

            {topics.length ? (
              <div className='flex gap-3 flex-wrap'>
                {topics.map((topic, index) => {
                  return (
                    <div className='flex items-center gap-[2px]' key={index}>
                      <Icon
                        name='RiHashtag'
                        type='NIL'
                        className='text-brand-orange'
                        size={18}
                      />

                      <p className='text-sm'>{topic}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className='py-2 text-sm opacity-90'>No topics added yet.</p>
            )}
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
