'use client';

import { useState } from 'react';

import FormSearchSelect from '@/components/FormSearchSelect';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { publishSteps } from '@/constants/modal';
import useGetAllCategories from '@/hooks/usetGetAllCategories';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Modal from '..';
import ModalContent from '../layout/ModalContent';
import ModalFooter from '../layout/ModalFooter';
import ModalHeader from '../layout/ModalHeader';
import Step1 from './step1';
import Step2 from './step2';

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
  const { categories, isError, isLoading } = useGetAllCategories();
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
    console.log(values);
    setSelectedTags(values.topics); // Update selected tags
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

  const formatCategories = () => {
    const categoriesArray: { value: string; label: string }[] = [];
    for (const category in categories?.category) {
      categoriesArray.push({ value: category, label: category });
    }
    return categoriesArray;
  };

  return (
    <Modal setModal={setModal}>
      <ModalHeader>
        <h1 className='font-playfair_Display text-2xl sm:text-3xl text-center font-semibold'>
          {publishStep?.heading}
        </h1>

        {publishStep.subHeading && (
          <p className='mt-2 font-jost text-sm sm:text-base opacity-75 text-center'>
            {publishStep.subHeading}
          </p>
        )}
      </ModalHeader>

      <ModalContent className='space-y-2'>
        <p className='font-josefin_Sans'>
          Choose topics (at most 5)
          <span className='block opacity-75 text-sm'>
            Topics provide readers with a glimpse into the content of your blog.
          </span>
        </p>

        <div className='py-2 flex items-center gap-2 flex-wrap'>
          {selectedTopics.map((topic) => (
            <Badge variant='outline' key={topic.value} className='text-xl'>
              {topic.label}
            </Badge>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='topics'
              render={({ field }) => {
                return (
                  <FormItem className='space-y-1 flex flex-col justify-start'>
                    <p className='font-jost text-sm'>
                      Select Topics
                      <span className='text-destructive'>*</span>
                    </p>

                    <FormControl>
                      <FormSearchSelect
                        defaultSelected={selectedTopics}
                        onChange={handleTopicChange}
                        onInputChange={(e) => {
                          if (e) {
                            setInstrumentSearch(e);
                          }
                        }}
                        options={formatCategories() || []}
                        placeholder='add suitable topics'
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
        <p className='text-center font-jost text-sm opacity-75'>
          Modifications made here will solely affect the presentation of your
          blog, without altering the actual content of your blog.
        </p>
      </ModalFooter>
    </Modal>
  );
};

export default PublishModal;
