import React from 'react';

import DeleteAccount from './DeleteAccount';
import ProfileVisibility from './ProfileVisibility';
import UpdateUsername from './UpdateUsername';
import VerifyEmail from './VerifyEmail';

const Account = () => {
  return (
    <div className='flex flex-col gap-[34px] mt-[54px]'>
      <UpdateUsername />
      <VerifyEmail />
      <ProfileVisibility />
      <DeleteAccount />
    </div>
  );
};

export default Account;
