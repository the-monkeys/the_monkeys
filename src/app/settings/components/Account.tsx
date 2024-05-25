import React from 'react';

import Section from './Section';
import DeleteAccount from './account/DeleteAccount';
import ProfileVisibility from './account/ProfileVisibility';
import UpdateUsername from './account/UpdateUsername';
import VerifyEmail from './account/VerifyEmail';

const Account = () => {
  return (
    <div className='mt-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-10'>
      <Section sectionTitle='Username'>
        <UpdateUsername />
      </Section>

      <Section sectionTitle='Email'>
        <VerifyEmail />
      </Section>

      <Section sectionTitle='Profile Visibility'>
        <ProfileVisibility />
      </Section>

      <Section sectionTitle='Delete Account'>
        <DeleteAccount />
      </Section>
    </div>
  );
};

export default Account;
