'use client';

import { useState } from 'react';

import FormSearchSelect from '@/components/FormSearchSelect';
import Icon from '@/components/icon';
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
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  // step 1:Call API to get all categories
  // step 2:format the categories to be used in the select component
  // step 3:Handle form with select upto 5 topics
  // step 4:Handle the selected topics
  // step 5:Handle the submit event
  // step 6:Handle the topic change
  // step 7:Handle the topic remove
  // step 8:Format the categories
  // step 9:Return the JSX
  // step 10:Export the PublishModal component

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleTopicChange = (selected: { value: string; label: string }) => {
    setSelectedTopics((prev) => {
      if (prev.find((topic) => topic.value === selected.value)) {
        return prev;
      }
      return [...prev, selected];
    });
  };

  const handleTopicRemove = (value: string) => {
    setSelectedTopics((prev) => prev.filter((topic) => topic.value !== value));
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

        <div className='flex items-center gap-2 flex-wrap'>
          {selectedTopics.map((topic) => (
            <div
              key={topic.value}
              className='flex items-center gap-1 bg-primary-monkeyOrange p-2 rounded-full'
            >
              <span>{topic.label}</span>
              <button
                type='button'
                onClick={() => handleTopicRemove(topic.value)}
                className='text-primary-monkeyWhite'
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='topics'
              render={({ field }) => {
                return (
                  <FormItem className='space-y-0 flex flex-col justify-start'>
                    <p className='text-sm mt-2'>
                      Select Topics
                      <span className='text-destructive'>*</span>
                    </p>
                    <FormControl>
                      <FormSearchSelect
                        defaultSelected={undefined}
                        onChange={(e) => {
                          field.onChange(e.value);
                          handleTopicChange(e);
                        }}
                        onInputChange={(e) => {
                          if (e) {
                            setInstrumentSearch(e);
                          }
                        }}
                        options={formatCategories() || []}
                        placeholder='Select Topics'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className='pt-6 flex gap-2 items-center'>
              <Button
                className='flex-1'
                onClick={() => setPublishStep(publishSteps[0])}
              >
                Publish
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
