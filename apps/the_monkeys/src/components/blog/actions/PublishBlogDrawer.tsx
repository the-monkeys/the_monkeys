import { useState } from 'react';

import FormSearchSelect from '@/components/FormSearchSelect';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { BLOG_TOPICS_MAX_COUNT } from '@/constants/topics';
import { useScheduleState } from '@/hooks/blog/schedule/useScheduleState';
import useGetAllTopics from '@/hooks/user/useGetAllTopics';
import { OutputData } from '@themonkeys/monkeys-editor';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@the-monkeys/ui/atoms/drawer';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { Switch } from '@the-monkeys/ui/atoms/switch';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';
import { twMerge } from 'tailwind-merge';

import ScheduleDateTimePicker from '../ScheduleDateTimePicker';
import { BlogDescription, BlogImage, BlogTitle } from '../getBlogContent';

interface PublishBlogDrawerProps {
  topics: string[];
  setTopics: React.Dispatch<React.SetStateAction<string[]>>;
  data: OutputData | null;
  setData?: React.Dispatch<React.SetStateAction<OutputData | null>>;
  handlePublish: () => void;
  handleSchedule?: (scheduleTime: string, timezone: string) => void;
  isPublishing: boolean;
}

const INVALID_IMAGE_EXTENSIONS = ['gif', 'apng'];

/**
 * Extracts blog preview metadata (title, description, image) from
 * EditorJS output data.
 */
const extractBlogPreview = (data: OutputData | null) => {
  const title =
    data?.blocks.find((block) => block.id === 'title')?.data.text ?? '';

  const contentBlock = data?.blocks.find((block) => block.type === 'paragraph');
  const description = contentBlock?.data.text ?? 'No Description';

  const imageBlock = data?.blocks.find((block) => block.type === 'image');
  const imageExtension = imageBlock
    ? imageBlock.data.file.url.split('.').pop()
    : null;

  const isValidImage = imageExtension
    ? !INVALID_IMAGE_EXTENSIONS.includes(imageExtension.toLowerCase())
    : false;

  const imageUrl = isValidImage
    ? imageBlock?.data.file.url
    : '/image-placeholder.png';

  const showImageWarning = !isValidImage && !!imageBlock;

  return { title, description, imageUrl, showImageWarning };
};

/**
 * Maps raw topic strings from the API into react-select compatible options.
 */
const toSelectOptions = (
  topics: { topic: string }[] | undefined
): { value: string; label: string }[] =>
  (topics ?? []).map(({ topic }) => ({ value: topic, label: topic }));

export const PublishBlogDrawer = ({
  topics,
  setTopics,
  data,
  setData,
  handlePublish,
  handleSchedule,
  isPublishing,
}: PublishBlogDrawerProps) => {
  const { topics: allTopics } = useGetAllTopics();

  const [isScheduleMode, setIsScheduleMode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const {
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    selectedTimezone,
    setSelectedTimezone,
    validateAndSubmit,
  } = useScheduleState();

  const { title, description, imageUrl, showImageWarning } =
    extractBlogPreview(data);

  const updateTitle = (newTitle: string) => {
    if (!setData) return;
    setData((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) => {
        if (block.id === 'title') {
          return {
            ...block,
            data: {
              ...block.data,
              text: newTitle,
            },
          };
        }
        return block;
      });
      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  const updateDescription = (newDescription: string) => {
    if (!setData) return;
    setData((prev) => {
      if (!prev) return prev;
      const paragraphIndex = prev.blocks.findIndex(
        (block) => block.type === 'paragraph'
      );
      const updatedBlocks = [...prev.blocks];
      if (paragraphIndex !== -1) {
        updatedBlocks[paragraphIndex] = {
          ...updatedBlocks[paragraphIndex],
          data: {
            ...updatedBlocks[paragraphIndex].data,
            text: newDescription,
          },
        };
      } else {
        const newParagraphBlock = {
          id: `para-${Date.now()}`,
          type: 'paragraph',
          data: {
            text: newDescription,
          },
        };
        updatedBlocks.splice(1, 0, newParagraphBlock);
      }
      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  const defaultTopics = topics.map((topic) => ({
    value: topic,
    label: topic,
  }));

  const isTopicsOverLimit = topics.length > BLOG_TOPICS_MAX_COUNT;

  const handleTopicChange = (selected: { value: string; label: string }[]) => {
    setTopics(selected.map((topic) => topic.value));
  };

  const handleActionClick = () => {
    if (isScheduleMode && handleSchedule) {
      validateAndSubmit(handleSchedule);
    } else {
      handlePublish();
    }
  };

  const actionLabel = isPublishing
    ? isScheduleMode
      ? 'Scheduling...'
      : 'Publishing...'
    : isScheduleMode
      ? 'Schedule'
      : 'Publish Now';

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size='sm' title='Publish Blog' className='rounded-full'>
          Publish
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className='!p-0 !pt-4'>
          <DrawerTitle>Publish Post</DrawerTitle>

          <DrawerDescription className='!text-sm'>
            Review your post and choose topics before publishing.
          </DrawerDescription>
        </DrawerHeader>

        <div className='w-full pb-10 px-4 mt-6 sm:mt-8 h-fit max-h-[80vh] overflow-y-auto'>
          <div className='mx-auto max-w-4xl sm:max-w-5xl grid sm:grid-cols-2 gap-8'>
            {/* ---- Left column: Post Preview ---- */}
            <div className='col-span-2 sm:col-span-1 space-y-3'>
              <p className='font-dm_sans font-medium text-base sm:text-lg'>
                Post Preview
              </p>

              <div className='space-y-3'>
                <div className='space-y-1'>
                  <div className='w-full aspect-[3/2] relative rounded-sm overflow-hidden'>
                    <Skeleton className='absolute inset-0 -z-10 w-full h-full' />

                    <BlogImage
                      image={imageUrl}
                      title='Post Image Preview'
                      className='bg-background-light dark:bg-background-dark'
                    />
                  </div>

                  {showImageWarning && (
                    <p className='text-xs sm:text-sm font-normal text-alert-red'>
                      This image can&apos;t be loaded or isn&apos;t supported.
                      Showing a default instead.
                    </p>
                  )}
                </div>

                <div className='space-y-4'>
                  <div className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm opacity-90'>Title</Label>
                      {setData && !isEditingTitle && (
                        <button
                          type='button'
                          onClick={() => setIsEditingTitle(true)}
                          className='p-1 text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark transition-colors rounded-md hover:bg-black/5 dark:hover:bg-white/5'
                          title='Edit Title'
                        >
                          <Icon name='RiPencil' size={14} />
                        </button>
                      )}
                    </div>

                    {isEditingTitle && setData ? (
                      <div className='flex items-center gap-2'>
                        <Input
                          value={title}
                          onChange={(e) => updateTitle(e.target.value)}
                          onBlur={() => setIsEditingTitle(false)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setIsEditingTitle(false);
                            }
                          }}
                          autoFocus
                          className='w-full text-[1.12rem] sm:text-[1.25rem] font-semibold font-newsreader bg-background-light dark:bg-background-dark'
                          placeholder='Enter post title...'
                        />
                        <button
                          type='button'
                          onMouseDown={(e) => {
                            // Prevent blur from firing before onClick
                            e.preventDefault();
                          }}
                          onClick={() => setIsEditingTitle(false)}
                          className='p-2 text-alert-green hover:bg-alert-green/10 transition-colors rounded-md flex-shrink-0'
                          title='Save'
                        >
                          <Icon name='RiCheck' size={18} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setData && setIsEditingTitle(true)}
                        className={twMerge(
                          'group relative flex items-center justify-between w-full text-[1.12rem] sm:text-[1.25rem] font-semibold font-newsreader capitalize tracking-tight py-2 px-3 rounded-md border border-transparent transition-all min-h-[42px]',
                          setData
                            ? 'hover:bg-black/5 dark:hover:bg-white/5 hover:border-border-light dark:hover:border-border-dark cursor-pointer'
                            : ''
                        )}
                      >
                        <span
                          className={twMerge(
                            'w-full break-words',
                            title === 'No Title' || !title
                              ? 'text-text-light/40 dark:text-text-dark/40 font-normal'
                              : 'text-text-light dark:text-text-dark'
                          )}
                        >
                          {title || 'Untitled Post'}
                        </span>
                        {setData && (
                          <Icon
                            name='RiPencil'
                            size={14}
                            className='opacity-0 group-hover:opacity-100 transition-opacity text-text-light/60 dark:text-text-dark/60 ml-2 flex-shrink-0'
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <Label className='text-sm opacity-90'>Description</Label>
                      {setData && !isEditingDescription && (
                        <button
                          type='button'
                          onClick={() => setIsEditingDescription(true)}
                          className='p-1 text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark transition-colors rounded-md hover:bg-black/5 dark:hover:bg-white/5'
                          title='Edit Description'
                        >
                          <Icon name='RiPencil' size={14} />
                        </button>
                      )}
                    </div>

                    {isEditingDescription && setData ? (
                      <div className='flex items-start gap-2'>
                        <TextArea
                          value={
                            description === 'No Description' ? '' : description
                          }
                          onChange={(e) => updateDescription(e.target.value)}
                          onBlur={() => setIsEditingDescription(false)}
                          autoFocus
                          className='w-full text-[0.9rem] sm:text-[1rem] min-h-24 font-normal bg-background-light dark:bg-background-dark'
                          placeholder='Enter post description...'
                        />
                        <button
                          type='button'
                          onMouseDown={(e) => {
                            // Prevent blur from firing before onClick
                            e.preventDefault();
                          }}
                          onClick={() => setIsEditingDescription(false)}
                          className='p-2 text-alert-green hover:bg-alert-green/10 transition-colors rounded-md flex-shrink-0 mt-2'
                          title='Save'
                        >
                          <Icon name='RiCheck' size={18} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setData && setIsEditingDescription(true)}
                        className={twMerge(
                          'group relative flex items-start justify-between w-full text-[0.9rem] sm:text-[1rem] font-normal leading-[1.4] py-2 px-3 rounded-md border border-transparent transition-all min-h-[60px]',
                          setData
                            ? 'hover:bg-black/5 dark:hover:bg-white/5 hover:border-border-light dark:hover:border-border-dark cursor-pointer'
                            : ''
                        )}
                      >
                        <p
                          className={twMerge(
                            'whitespace-pre-wrap break-words w-full',
                            description === 'No Description' || !description
                              ? 'text-text-light/40 dark:text-text-dark/40'
                              : 'text-text-light/90 dark:text-text-dark/90'
                          )}
                        >
                          {description === 'No Description' || !description
                            ? 'Enter post description...'
                            : description}
                        </p>
                        {setData && (
                          <Icon
                            name='RiPencil'
                            size={14}
                            className='opacity-0 group-hover:opacity-100 transition-opacity text-text-light/60 dark:text-text-dark/60 ml-2 mt-1 flex-shrink-0'
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Right column: Topics & Scheduling ---- */}
            <div className='flex flex-col justify-between h-full col-span-2 sm:col-span-1 space-y-6'>
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <Label className='font-dm_sans font-medium'>
                    Topics Included
                  </Label>
                  <p className='font-normal text-xs opacity-90'>
                    You can add up to {BLOG_TOPICS_MAX_COUNT} topics to your
                    blog. Choose from the list or add your own.
                  </p>
                </div>

                <FormSearchSelect
                  defaultSelected={defaultTopics}
                  onChange={handleTopicChange}
                  options={toSelectOptions(allTopics?.topics)}
                  placeholder='Choose suitable topics'
                />

                <div className='flex items-center justify-between'>
                  <p className='px-1 text-sm opacity-90'>
                    Topics added:{' '}
                    <span
                      className={twMerge(
                        'font-medium text-alert-green',
                        isTopicsOverLimit && '!text-alert-red'
                      )}
                    >
                      {topics.length}
                    </span>
                  </p>

                  {isTopicsOverLimit && (
                    <p className='text-xs sm:text-sm font-normal text-alert-red'>
                      Up to {BLOG_TOPICS_MAX_COUNT} topics allowed.
                    </p>
                  )}
                </div>

                {/* Schedule toggle */}
                <div className='pt-4 border-t border-border-light dark:border-border-dark'>
                  <div className='flex items-center justify-between mb-4'>
                    <Label
                      htmlFor='schedule-toggle'
                      className='text-base font-medium cursor-pointer'
                    >
                      Schedule this post
                    </Label>
                    <Switch
                      id='schedule-toggle'
                      checked={isScheduleMode}
                      onCheckedChange={setIsScheduleMode}
                    />
                  </div>

                  {isScheduleMode && (
                    <ScheduleDateTimePicker
                      scheduleDate={scheduleDate}
                      onDateChange={setScheduleDate}
                      scheduleTime={scheduleTime}
                      onTimeChange={setScheduleTime}
                      selectedTimezone={selectedTimezone}
                      onTimezoneChange={setSelectedTimezone}
                    />
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex justify-end gap-2 pt-4 border-t mt-auto'>
                <DrawerClose asChild>
                  <Button variant='secondary'>Continue Writing</Button>
                </DrawerClose>

                <Button
                  type='button'
                  onClick={handleActionClick}
                  disabled={isPublishing}
                  variant='brand'
                >
                  {isPublishing && <Loader />}
                  {actionLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
