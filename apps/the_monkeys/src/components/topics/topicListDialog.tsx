import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

import { TopicLabelLink } from './topicLabels';

export default function TopicListDialog({ topics }: { topics: string[] }) {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button variant='link' size='sm'>
            show all...
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle>Topics</DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>

          <div className='flex flex-row flex-wrap gap-2'>
            {topics.map((topic, idx) => (
              <TopicLabelLink key={idx} topic={topic} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
