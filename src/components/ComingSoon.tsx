'use client';

import { useState } from 'react';

import Image from 'next/image';

import LoginModal from './modals/login/LoginModal';

const ComingSoon = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className='mb-20 flex min-h-screen w-4/5 flex-col items-center justify-center md:w-3/5'>
      <h1 className='mb-4 text-center font-playfair_Display text-3xl font-extrabold md:text-4xl'>
        We&apos;re Coming Soon!
      </h1>

      <p className='mb-2 text-center font-josefin_Sans text-xl md:text-2xl'>
        Our website is currently under construction!
      </p>

      <Image
        src={'/coming-soon.svg'}
        alt='Coming Soon!!'
        title='Coming Soon!!'
        height={300}
        width={300}
        onClick={() => setShowModal((prevValue) => !prevValue)}
      />

      <p className='mt-4 text-center font-jost text-base text-secondary-lightGrey md:text-lg'>
        Get ready to be part of the excitement and be the first to experience
        our grand reveal. Stay tuned for updates and announcements. Thank you
        for your anticipation and patience!
      </p>
      {showModal && <LoginModal setModal={setShowModal} />}
    </div>
  );
};

export default ComingSoon;
