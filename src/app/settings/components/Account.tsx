import React from 'react';

import Section from './Section';
import Danger from './account/Danger';
import Email from './account/Email';
import Password from './account/Password';
import Username from './account/Username';
import Visibility from './account/Visibility';

const Account = () => {
  return (
    <div className='mt-5 p-5 space-y-10'>
      <Section sectionTitle='Username'>
        <Username />
      </Section>

      <Section sectionTitle='Password'>
        <Password />
      </Section>

      <Section sectionTitle='Email'>
        <Email />
      </Section>

      <Section sectionTitle='Visibility'>
        <Visibility />
      </Section>

      <Section sectionTitle='Danger'>
        <Danger />
      </Section>
    </div>
  );
};

export default Account;
