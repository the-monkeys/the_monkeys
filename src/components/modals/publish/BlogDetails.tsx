import { useState } from 'react';

import Button from '@/components/button';
import Input from '@/components/input';

const BlogDetails = () => {
  const [blogTitle, setBlogTitle] = useState<string>('');

  return (
    <div className='px-4 py-2 flex flex-col gap-4'>
      <Input
        label='Title'
        placeholderText='Add preview title'
        variant='ghost'
        setInputText={setBlogTitle}
        className='w-full text-2xl'
      />

      <Input
        label='Subheading'
        placeholderText='Add preview subheading'
        variant='ghost'
        setInputText={setBlogTitle}
        className='w-full'
      />

      <div className='mt-4 flex items-center gap-2 flex-wrap'>
        <Button title='Save Draft' variant='secondary' className='flex-grow' />
        <Button title='Add Topics' variant='secondary' className='flex-grow' />
        <Button title='Publish' variant='primary' className='w-full' />
      </div>
    </div>
  );
};

export default BlogDetails;
