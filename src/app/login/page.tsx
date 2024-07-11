'use client';

import React, { useState } from 'react';

import Container from '@/components/layout/Container';
import LoginModal from '@/components/modals/login/LoginModal';

const LoginPage = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <Container className='min-h-screen'>
      {showModal && <LoginModal setModal={setShowModal} />}
    </Container>
  );
};

export default LoginPage;
