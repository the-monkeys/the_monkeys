'use client';

import React, { useState } from 'react';

import LoginModal from '@/components/modals/login/LoginModal';

const LoginPage = () => {
  const [showModal, setShowModal] = useState(true);

  return <div>{showModal && <LoginModal setModal={setShowModal} />}</div>;
};

export default LoginPage;
