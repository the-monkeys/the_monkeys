import FormSearchSelect from '@/components/FormSearchSelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BLOG_TOPICS_MAX_COUNT } from '@/constants/topics';
import useGetAllTopics from '@/hooks/user/useGetAllTopics';
import { twMerge } from 'tailwind-merge';

export const ChooseTopicDialog = ({
  blogTopics,
  setBlogTopics,
}: {
  blogTopics: string[];
  setBlogTopics: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { topics } = useGetAllTopics();

  const defaultTopics = blogTopics.map((topic) => {
    return { value: topic, label: topic };
  });

  const formatTopics = () => {
    const topicsArray: { value: string; label: string }[] = [];

    for (const topic of topics?.topics || []) {
      topicsArray.push({ value: topic.topic, label: topic.topic });
    }

    return topicsArray;
  };

  const handleTopicChange = (selected: { value: string; label: string }[]) => {
    const selectedTopics = selected.map((topic) => topic.value);

    setBlogTopics(selectedTopics);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='secondary'
          size='sm'
          title='Add Topics'
          className='rounded-full'
        >
          Choose Topics {`(${blogTopics.length})`}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add / Choose Topics</DialogTitle>

          <DialogDescription className='!text-sm'>
            You can add up to 15 topics to your blog. Choose from the list or
            add your own.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-1'>
          <Label className='px-1 text-sm'>Choose Topics</Label>
          <FormSearchSelect
            defaultSelected={defaultTopics}
            onChange={handleTopicChange}
            options={formatTopics() || []}
            placeholder='Choose suitable topics'
          />
        </div>

        <div className='flex items-center justify-end'>
          <p className='px-1 text-sm'>
            Topics added:{' '}
            <span
              className={twMerge(
                'font-dm_sans font-medium',
                blogTopics.length > BLOG_TOPICS_MAX_COUNT && 'text-alert-red'
              )}
            >
              {blogTopics.length}
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
