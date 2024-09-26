'use client';

import { useState } from 'react';

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
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { CiEdit } from 'react-icons/ci';
import { RxCross2 } from 'react-icons/rx';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditTopics({
  user,
  mutate,
}: {
  user: { topics: string[] };
  mutate: any;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<string[]>(user?.topics || []);
  const [removedTopics, setRemovedTopics] = useState<string[]>([]);
  const { data: session } = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });
  const { username } = useParams();
  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics((prev) => prev.filter((t) => t !== topicToRemove));
    setRemovedTopics((prev) => [...prev, topicToRemove]);
  };

  const handleSave = async () => {
    setLoading(true);
    const token = session?.user?.token || '';
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/user/un-follow-topics/${username}`,
        {
          topics: removedTopics,
        },
        {
          headers: {
            Authorization: token && `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setTopics((prevTopics) =>
        prevTopics.filter((topic) => !removedTopics.includes(topic))
      );
      setRemovedTopics([]);
      // mutate(`/user/public/${username}`);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Topics have been updated successfully',
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to update topics. Please try again.',
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
            <CiEdit size={20} />
            <span className='font-josefin_Sans text-base'>Edit Topics</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Topics</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold font-josefin_Sans'>
                Your Topics:
              </h3>
              {topics.length === 0 ? (
                <p className='text-muted-foreground'>No topics selected</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {topics.map((topic, index) => (
                    <span
                      key={index}
                      className='rounded-xl border font-jost border-primary-monkeyOrange text-primary-monkeyOrange p-2 flex items-center'
                    >
                      #{topic}
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleRemoveTopic(topic)}
                        className='ml-2 p-0 h-auto'
                        aria-label={`Remove ${topic}`}
                      >
                        <RxCross2 size={14} />
                      </Button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleSave}
              className='w-full'
              disabled={loading || removedTopics.length === 0}
            >
              {loading && <Loader className='mr-2' />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className='flex flex-wrap gap-2'>
        {topics.map((topic, index) => (
          <span
            key={index}
            className='rounded-xl border font-jost border-primary-monkeyOrange text-primary-monkeyOrange p-2'
          >
            #{topic}
          </span>
        ))}
      </div>
    </div>
  );
}
