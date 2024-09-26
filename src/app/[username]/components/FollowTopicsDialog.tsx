'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useGetProfileTopics } from '@/hooks/useGetProfileTopics';
import axiosInstance from '@/services/api/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { IoAddOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { mutate } from 'swr';
import { z } from 'zod';

type Topic = {
  topic: string;
  category?: string;
};

const formSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
});

export default function TopicSelector() {
  const { username } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { avaliableTopics, isTopicsLoading, error } = useGetProfileTopics();
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { data: session, status } = useSession();
  const sampleTopics: Topic[] = !isTopicsLoading && avaliableTopics.topics;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  useEffect(() => {
    setSelectedTopics([]);
  }, [open]);

  useEffect(() => {
    if (sampleTopics) {
      setFilteredTopics(
        sampleTopics.filter((topic) =>
          topic.topic.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }
  }, [inputValue, sampleTopics]);

  const handleAddTopic = (values: z.infer<typeof formSchema>) => {
    const topicToAdd = sampleTopics.find(
      (t) => t.topic.toLowerCase() === values.topic.toLowerCase()
    );
    if (
      topicToAdd &&
      !selectedTopics.some(
        (t) => t.topic.toLowerCase() === topicToAdd.topic.toLowerCase()
      )
    ) {
      setSelectedTopics((prev) => [...prev, topicToAdd]);
      form.reset({ topic: '' });
      setInputValue('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setSelectedTopics((prev) => prev.filter((t) => t.topic !== topicToRemove));
  };

  const handleSave = async () => {
    setLoading(true);
    const token = session?.user?.token || '';
    const topics = selectedTopics.map((item) => item.topic);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/follow-topics/${username}`,
        {
          topics,
        },
        {
          headers: {
            Authorization: token && `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Topics have been saved successfully',
      });
      setOpen(false);
      mutate(`/user/public/${username}`);
      window.location.reload();
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to save topics. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4 pl-0 space-y-4'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline' className='flex items-center gap-2'>
            <IoAddOutline />
            <span className='font-josefin_Sans text-base'>Add Topics</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Select a Topic</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddTopic)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='topic'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Topic
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          {...field}
                          placeholder='Select a topic'
                          value={inputValue}
                          onChange={(e) => {
                            setInputValue(e.target.value);
                            field.onChange(e);
                          }}
                          className='w-full border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:ring-offset-2'
                        />
                        {inputValue.length != 0 &&
                          filteredTopics.length > 0 && (
                            <ul className='absolute z-10 w-full mt-1 bg-secondary-darkGrey border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
                              {filteredTopics.map((topic, index) => (
                                <li
                                  key={index}
                                  className='px-4 py-2 cursor-pointer'
                                  onClick={() => {
                                    setInputValue(topic.topic);
                                    field.onChange(topic.topic);
                                    setFilteredTopics([]);
                                  }}
                                >
                                  #{topic.topic}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' size='sm'>
                Add Topic
              </Button>
            </form>
          </Form>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold font-josefin_Sans'>
              Selected Topics:
            </h3>
            {selectedTopics.length === 0 ? (
              <p className='text-secondary-lightGrey'>No topics selected</p>
            ) : (
              <div className='flex flex-wrap gap-2  '>
                {selectedTopics.map((topic, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-2 border border-primary-monkeyOrange px-2 py-1 rounded-full'
                  >
                    <span className='font-josefin_Sans'>#{topic.topic}</span>
                    <button
                      onClick={() => handleRemoveTopic(topic.topic)}
                      className='text-red-500 hover'
                    >
                      <RxCross2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={handleSave}
            className='mt-4'
            disabled={loading || selectedTopics.length === 0}
          >
            {loading && <Loader className='mr-2' />}
            Save Topics
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
