import { useState } from 'react';

import Image from 'next/image';

import Button from '@/components/button';
import Input from '@/components/input';

const BlogDetails = () => {
  const [blogTitle, setBlogTitle] = useState<string>('');

  return (
    <div className='px-4 py-2 flex flex-col gap-4'>
      <Input
        label='Title'
        placeholderText='Add preview title'
        variant='border'
        setInputText={setBlogTitle}
        className='w-full text-2xl'
      />

      <Input
        label='Subheading'
        placeholderText='Add preview subheading'
        variant='border'
        setInputText={setBlogTitle}
        className='w-full'
      />

      <div className='flex flex-col'>
        <p className='font-josefin_Sans text-lg px-2'>
          Add Topics <span>(up to 3)</span>
        </p>
        <p className='text-xs sm:text-sm opacity-75 font-jost px-2'>
          Including topics provides clarity about the focus of your blog.
        </p>

        <Input
          placeholderText='Add topics'
          variant='area'
          setInputText={setBlogTitle}
          className='mt-2 w-full'
        />
      </div>

      <div className='flex items-center gap-2'>
        <Button title='Save Draft' variant='secondary' className='w-1/2' />
        <Button title='Publish' variant='primary' className='w-1/2' />
      </div>
    </div>
  );
};

export default BlogDetails;
