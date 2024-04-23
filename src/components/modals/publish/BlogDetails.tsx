import { useState } from 'react';

import Image from 'next/image';

import Button from '@/components/button';
import Input from '@/components/input';

const BlogDetails = () => {
  const [blogTitle, setBlogTitle] = useState<string>('');

  return (
    <div className='px-4 py-2 flex flex-col gap-2'>
      <div className='p-4 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 flex flex-col items-center gap-4 rounded-lg'>
        <Image
          src={'/preview-image.svg'}
          alt='Coming Soon!!'
          title='Coming Soon!!'
          height={150}
          width={150}
        />

        <p className='text-center font-jost text-sm opacity-75'>
          Enhance the appeal of your blog by including a captivating image that
          draws readers in.
        </p>
      </div>

      <Input
        placeholderText='Add preview title'
        variant='ghost'
        setInputText={setBlogTitle}
        className='w-full text-2xl'
      />

      <Input
        placeholderText='Add preview subheading'
        variant='ghost'
        setInputText={setBlogTitle}
        className='w-full'
      />

      <Button title='Publish Blog' variant='primary' className='mt-4' />
    </div>
  );
};

export default BlogDetails;
