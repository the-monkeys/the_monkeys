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
      <h1>{data?.user.first_name}</h1>
      <h1>{data?.user.last_name}</h1>
      <h1>{data?.user.userName}</h1>
    </div>
  );
};

export default page;
