'use client';

import useAuth from '@/hooks/auth/useAuth';

import MobileNav from './MobileNav';
import Nav from './Nav';

const Navbar = () => {
  const { data, isLoading } = useAuth();

  return (
    <>
      <MobileNav isAuthLoading={isLoading} session={data} />
      <Nav isAuthLoading={isLoading} session={data} />
    </>
  );
};

export default Navbar;
