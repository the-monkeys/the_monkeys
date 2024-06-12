import React from 'react';

import Section from './Section';
import DeleteAccount from './account/DeleteAccount';
import ProfileVisibility from './account/ProfileVisibility';
import UpdateUsername from './account/UpdateUsername';
import VerifyEmail from './account/VerifyEmail';

const Account = () => {
  return (
    <div className='mt-5 p-5 space-y-10'>
      <Section sectionTitle='Username'>
        <UpdateUsername />
      </Section>

      <Section sectionTitle='Email'>
        <VerifyEmail />
      </Section>

      <Section sectionTitle='Visibility'>
        <ProfileVisibility />
      </Section>

      <Section sectionTitle='Danger'>
        <DeleteAccount />
      </Section>
    </div>
  );
};

export default Account;
