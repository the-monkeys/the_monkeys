import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

import WordCloudCanvas from './WordCloudCanvas';

export const WordCloudDialog = ({
  tags,
  username,
  isEligible,
  size = 'default',
}: {
  tags: Record<string, number>;
  username: string;
  isEligible: boolean;
  size?: 'default' | 'sm' | 'lg';
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='brand'
          size={size}
          className='!text-base rounded-xl hover:!bg-brand-orange/85 hover:!text-white'
          title='Create Snapshot'
        >
          Generate Word Cloud
        </Button>
      </DialogTrigger>

      <DialogContent className='flex flex-col gap-4 !max-w-3xl h-fit max-h-[80vh] overflow-y-auto'>
        <DialogHeader className='h-fit'>
          <DialogTitle>Word Cloud</DialogTitle>
          <DialogDescription>
            Common topics in the Author&apos;s writing.
          </DialogDescription>
        </DialogHeader>

        {isEligible ? (
          <WordCloudCanvas tags={tags} username={username} />
        ) : (
          <p className='py-4 text-alert-red text-center sm:text-left'>
            There aren&apos;t enough topics to generate a word cloud.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
