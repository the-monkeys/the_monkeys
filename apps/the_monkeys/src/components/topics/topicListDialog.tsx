import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

import { TopicLabelLink } from './topicLabels';

export default function TopicListDialog({ topics }: { topics: string[] }) {
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <p className='p-1 text-sm opacity-90 underline underline-offset-2'>
            show more...
          </p>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Topics</DialogTitle>
            <DialogClose />
          </DialogHeader>
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
