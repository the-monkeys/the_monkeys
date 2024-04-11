'use client';

import React, { useState } from 'react';

import LoginModal from '@/components/modals/login/LoginModal';
import SignupModal from '@/components/modals/signup/SignupModal';

const page = () => {
  const [showModal, setShowModal] = useState(true);

  return <div>{showModal && <LoginModal setModal={setShowModal} />}</div>;
};

export default page;
