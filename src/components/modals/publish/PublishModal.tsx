'use client';

import { useState } from 'react';

import FormSearchSelect from '@/components/FormSearchSelect';
import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { publishSteps } from '@/constants/modal';
import useGetAllTopics from '@/hooks/user/useGetAllTopics';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Modal from '..';
import ModalContent from '../layout/ModalContent';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';

export type PublishStep = {
  id: number;
  heading: string;
  subHeading?: string;
};

const formSchema = z.object({
  topics: z
    .array(z.string())
    .max(5, { message: 'Please select at most 5 topics' }),
});

const PublishModal = ({
  setModal,
  setSelectedTags,
  blogId,
  handlePublishStep,
  publishedBlogLoading,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  blogId: string;
  handlePublishStep: () => void;
  publishedBlogLoading: boolean;
}) => {
  const [publishStep, setPublishStep] = useState<PublishStep>(publishSteps[0]);
  const { topics } = useGetAllTopics();
  const [instrumentSearch, setInstrumentSearch] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<
    { value: string; label: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topics: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSelectedTags(values.topics);
    handlePublishStep();
  }

  const handleTopicChange = (selected: { value: string; label: string }[]) => {
    setSelectedTopics(selected);
    form.setValue(
      'topics',
      selected.map((topic) => topic.value)
    );
  };

  const handleTopicRemove = (value: string) => {
    const updatedTopics = selectedTopics.filter(
      (topic) => topic.value !== value
    );
    setSelectedTopics(updatedTopics);
    form.setValue(
      'topics',
      updatedTopics.map((topic) => topic.value)
    );
  };

  const formatTopics = () => {
    const topicsArray: { value: string; label: string }[] = [];

    for (const topic of topics?.topics || []) {
      topicsArray.push({ value: topic.topic, label: topic.topic });
    }

    return topicsArray;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader>
        <h1 className='font-playfair_Display text-2xl sm:text-3xl text-center font-semibold'>
          {publishStep?.heading}
        </h1>

        {publishStep.subHeading && (
          <p className='mt-2 font-dm_sans text-sm sm:text-base opacity-80 text-center'>
            {publishStep.subHeading}
          </p>
        )}
      </ModalHeader>

      <ModalContent className='space-y-4'>
        {selectedTopics.length ? (
          <div className='flex items-center gap-x-1 gap-y-2 flex-wrap'>
            {selectedTopics.map((topic) => (
              <Badge
                key={topic.value}
                variant='secondary'
                className='font-dm_sans text-base sm:text-base hover:bg-opacity-100 dark:hover:bg-opacity-100'
              >
                {topic.label}
              </Badge>
            ))}
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='topics'
              render={({ field }) => {
                return (
                  <FormItem className='space-y-1 flex flex-col justify-start'>
                    <FormLabel className='font-roboto text-sm'>
                      Choose Topics*
                    </FormLabel>

                    <FormDescription></FormDescription>

                    <FormControl>
                      <FormSearchSelect
                        defaultSelected={selectedTopics}
                        onChange={handleTopicChange}
                        onInputChange={(e) => {
                          if (e) {
                            setInstrumentSearch(e);
                          }
                        }}
                        options={formatTopics() || []}
                        placeholder='Add suitable topics'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className='pt-6 flex gap-2 items-center'>
              <Button
                type='submit'
                disabled={publishedBlogLoading}
                className='flex-1'
              >
                Publish {publishedBlogLoading && <Loader />}
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>

      <ModalFooter>
        <p className='font-roboto text-xs text-foreground-dark dark:text-foreground-light text-center'>
          Modifications made here will solely affect the presentation of your
          blog, without altering the actual content of your blog.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default PublishModal;
