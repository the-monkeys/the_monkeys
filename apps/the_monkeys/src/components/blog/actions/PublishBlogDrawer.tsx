import FormSearchSelect from '@/components/FormSearchSelect';
import { Loader } from '@/components/loader';
import { BLOG_TOPICS_MAX_COUNT } from '@/constants/topics';
import useGetAllTopics from '@/hooks/user/useGetAllTopics';
import { OutputData } from '@editorjs/editorjs';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@the-monkeys/ui/atoms/drawer';
import { Label } from '@the-monkeys/ui/atoms/label';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';
import { twMerge } from 'tailwind-merge';

import { BlogDescription, BlogImage, BlogTitle } from '../getBlogContent';

export const PublishBlogDrawer = ({
  topics,
  setTopics,
  data,
  handlePublish,
  isPublishing,
}: {
  topics: string[];
  setTopics: React.Dispatch<React.SetStateAction<string[]>>;
  data: OutputData | null;
  handlePublish: () => void;
  isPublishing: boolean;
}) => {
  const { topics: allTopics } = useGetAllTopics();

  const title =
    data?.blocks.find((block) => block.id === 'title')?.data.text || 'No Title';
  const contentBlock = data?.blocks.find((block) => block.type === 'paragraph');
  const content = contentBlock?.data.text ?? 'No Description';

  const imageBlock = data?.blocks.find((block) => block.type === 'image');
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
            <div className='col-span-2 sm:col-span-1 space-y-3'>
              <p className='font-dm_sans font-medium text-base sm:text-lg'>
                Post Preview
              </p>

              <div className={`space-y-3`}>
                <div className='space-y-1'>
                  <div className='w-full aspect-[3/2] relative rounded-sm overflow-hidden'>
                    <Skeleton className='absolute inset-0 -z-10 w-full h-full' />

                    <BlogImage
                      image={imageUrl}
                      title='Post Image Preview'
                      className='bg-background-light dark:bg-background-dark'
                    />
                  </div>
                  {(invalidImage || imageBlock === undefined) && (
                    <p className='text-xs sm:text-sm font-normal text-alert-red'>
                      This image can&apos;t be loaded or isn&apos;t supported.
                      Showing a default instead.
                    </p>
                  )}
                </div>
                <div className='space-y-3'>
                  <div className='space-y-1'>
                    <Label className='text-sm opacity-90'>Title</Label>
                    <BlogTitle
                      className='font-semibold text-[1.12rem] sm:text-[1.25rem] leading-[1.4] line-clamp-2'
                      title={title}
                    />
                  </div>
                  <div className='space-y-1'>
                    <Label className='text-sm opacity-90'>Description</Label>
                    <BlogDescription
                      className='text-[0.9rem] sm:text-[1rem] line-clamp-3 sm:line-clamp-2'
                      description={content}
                    />
                  </div>
                </div>
              </div>
            </div>

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
                  options={formatTopics() || []}
                  placeholder='Choose suitable topics'
                />

                <div className='flex items-center justify-between'>
                  <p className='px-1 text-sm opacity-90'>
                    Topics added:{' '}
                    <span
                      className={twMerge(
                        'font-medium text-alert-green',
                        topics.length > BLOG_TOPICS_MAX_COUNT &&
                          '!text-alert-red'
                      )}
                    >
                      {topics.length}
                    </span>
                  </p>

                  {topics.length > BLOG_TOPICS_MAX_COUNT && (
                    <p className='text-xs sm:text-sm font-normal text-alert-red'>
                      Up to {BLOG_TOPICS_MAX_COUNT} topics allowed.
                    </p>
                  )}
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-4'>
                <DrawerClose asChild>
                  <Button variant='secondary'>Continue Writing</Button>
                </DrawerClose>

                <Button
                  type='button'
                  onClick={handlePublish}
                  disabled={isPublishing}
                  variant={'brand'}
                >
                  {isPublishing && <Loader />}
                  {isPublishing ? 'Publishing...' : 'Publish Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
