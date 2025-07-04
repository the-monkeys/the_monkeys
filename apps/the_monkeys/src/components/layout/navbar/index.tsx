'use client';

import useAuth from '@/hooks/auth/useAuth';

import Nav from './Nav';

const Navbar = () => {
  const { data, isLoading } = useAuth();

  return (
    <>
      <Nav isAuthLoading={isLoading} session={data} />
    </>
  );
};

export default Navbar;
