'use client';

import React, { useEffect } from 'react';

import { useSession } from 'next-auth/react';

const page = () => {
  const { data, status } = useSession();
  useEffect(() => {
    console.log(data);
  }, [status]);
  return (
    <div>
      <div className='bg-gray-100 p-4 rounded-md shadow-md'>
        <p className='text-lg font-semibold mb-2'>User Information:</p>
        <div className='mb-2'>
          <p className='text-gray-600'>First Name:</p>
          <h1 className='text-xl font-bold'>{data?.user.first_name}</h1>
        </div>
        <div className='mb-2'>
          <p className='text-gray-600'>Last Name:</p>
          <h1 className='text-xl font-bold'>{data?.user.last_name}</h1>
        </div>
        <div className='mb-2'>
          <p className='text-gray-600'>Username:</p>
          <h1 className='text-lg text-gray-700'>{data?.user.user_name}</h1>
        </div>
        <div>
          <p className='text-gray-600'>Email:</p>
          <h1 className='text-lg text-gray-700'>{data?.user.email}</h1>
        </div>
      </div>
    </div>
  );
};

export default page;
