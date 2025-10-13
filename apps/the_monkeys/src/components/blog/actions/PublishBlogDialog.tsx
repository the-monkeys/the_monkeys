'use client';

import { useState } from 'react';

import Image from 'next/image';

import FormSearchSelect from '@/components/FormSearchSelect';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { BLOG_TOPICS_MAX_COUNT } from '@/constants/topics';
import useGetAllTopics from '@/hooks/user/useGetAllTopics';
import { OutputData } from '@editorjs/editorjs';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Label } from '@the-monkeys/ui/atoms/label';
import { twMerge } from 'tailwind-merge';

export const PublishBlogDialog = ({
  topics,
  setTopics,
  data,
  handlePublish,
  isPublishing,
}: {
  topics: string[];
  setTopics: React.Dispatch<React.SetStateAction<string[]>>;
  data: OutputData;
  handlePublish: () => void;
  isPublishing: boolean;
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
    'desktop'
  );
  const { topics: allTopics } = useGetAllTopics();

  const title =
    data.blocks.find((block) => block.id === 'title')?.data.text || 'No Title';
  const contentBlock = data.blocks.find((block) => block.type === 'paragraph');
  // slice the content to first 200 characters for preview
  // Also remove &nbsp; and other HTML entities if any
  const content = contentBlock
    ? contentBlock.data.text.slice(0, 200).replace(/&nbsp;/g, ' ')
    : 'No Content';

  const imageBlock = data.blocks.find((block) => block.type === 'image');
  const imageExtension = imageBlock
    ? imageBlock.data.file.url.split('.').pop()
    : null;
  // Validate image extension
  const invalidImageExtensions = ['gif', 'apng'];
  const isValidImage = imageExtension
    ? !invalidImageExtensions.includes(imageExtension.toLowerCase())
    : false;
  // If image is not valid, use placeholder
  const imageUrl = isValidImage
    ? imageBlock?.data.file.url
    : '/image-placeholder.png';
  const invalidImage = !isValidImage && imageBlock;

  const defaultTopics = topics.map((topic) => {
    return { value: topic, label: topic };
  });

  const formatTopics = () => {
    const topicsArray: { value: string; label: string }[] = [];

    for (const topic of allTopics?.topics || []) {
      topicsArray.push({ value: topic.topic, label: topic.topic });
    }

    return topicsArray;
  };

  const handleTopicChange = (selected: { value: string; label: string }[]) => {
    const selectedTopics = selected.map((topic) => topic.value);
    setTopics(selectedTopics);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' title='Publish Blog' className='rounded-full'>
          Publish
        </Button>
      </DialogTrigger>

      <DialogContent className='!max-w-4xl'>
        <div>
          <DialogTitle className='font-dm_sans text-2xl font-bold'>
            Ready to Share?
          </DialogTitle>
          <DialogDescription className='max-w-2xl font-dm_sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6'>
            Once published, your post will be visible to everyone. You can edit
            it later, but changes will be reflected publicly.
          </DialogDescription>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {/* Preview Column */}
          <div className='space-y-3'>
            <div className='flex flex-row justify-between items-center'>
              <p className='font-dm_sans font-semibold text-sm text-neutral-700 dark:text-neutral-300'>
                Preview
              </p>
              <Button
                type='button'
                variant={'outline'}
                size={'icon'}
                onClick={() =>
                  setPreviewMode(
                    previewMode === 'desktop' ? 'mobile' : 'desktop'
                  )
                }
                className='p-0 bg-transparent border-none cursor-pointer hidden md:flex'
                aria-label='Toggle preview mode'
              >
                <Icon
                  name={
                    previewMode === 'desktop'
                      ? 'RiComputerLine'
                      : 'RiSmartphoneLine'
                  }
                  type='NIL'
                  className='text-brand-orange'
                  size={16}
                />
              </Button>
            </div>
            <div
              className={`${previewMode === 'mobile' ? 'border border-neutral-300 dark:border-neutral-700 rounded-lg p-4 w-[375px] mx-auto' : ''} space-y-3`}
            >
              <div className='space-y-1'>
                {/* maintain the ratio of 16:9, crop the image if needed */}
                <Image
                  src={imageUrl}
                  alt='Preview'
                  width={400}
                  height={300}
                  className={`w-full ${previewMode === 'mobile' ? 'h-48' : 'h-60'} border border-neutral-200 dark:border-neutral-700 object-contain`}
                />
                {invalidImage && (
                  <p className='text-xs font-normal text-alert-red'>
                    The first image type is not supported. Displaying a
                    placeholder instead.
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <h3
                  className={`font-dm_sans font-bold text-xl leading-tight text-neutral-900 dark:text-neutral-100 line-clamp-2`}
                >
                  {title}
                </h3>
                <p className='font-dm_sans text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3'>
                  {content}
                </p>
              </div>
            </div>
          </div>

          {/* Topics and Publish Button Column */}
          <div className='flex flex-col justify-between space-y-6'>
            <div className='space-y-3'>
              <div className='space-y-1'>
                <Label className='font-dm_sans font-semibold text-sm text-neutral-700 dark:text-neutral-300'>
                  Topics Included
                </Label>
                <p className='font-normal text-xs text-neutral-500'>
                  You can add up to {BLOG_TOPICS_MAX_COUNT} topics to your blog.
                  Choose from the list or add your own.
                </p>
              </div>

              <FormSearchSelect
                defaultSelected={defaultTopics}
                onChange={handleTopicChange}
                options={formatTopics() || []}
                placeholder='Choose suitable topics'
              />

              <div className='flex items-center justify-between'>
                <p className='px-1 text-sm text-neutral-500'>
                  Topics added:{' '}
                  <span
                    className={twMerge(
                      'font-dm_sans font-medium text-neutral-700 dark:text-neutral-300',
                      topics.length > BLOG_TOPICS_MAX_COUNT && '!text-alert-red'
                    )}
                  >
                    {topics.length}
                  </span>
                </p>
              </div>
            </div>

            <div className='flex justify-end pt-4'>
              <Button
                type='button'
                className='font-dm_sans font-semibold'
                onClick={handlePublish}
                disabled={isPublishing}
              >
                {isPublishing && <Loader />}
                {isPublishing ? 'Publishing...' : 'Publish Now'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
