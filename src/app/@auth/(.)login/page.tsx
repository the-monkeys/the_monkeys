'use client';

import React, { useState } from 'react';

import LoginModal from '@/components/modals/login/LoginModal';

const Page = () => {
  const [showModal, setShowModal] = useState(true);

  return <div>{showModal && <LoginModal setModal={setShowModal} />}</div>;
};

export default Page;
