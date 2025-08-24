import { IUser } from '@/services/models/user';

import { Section } from './Section';
import { Email } from './account/Email';
import { Password } from './account/Password';
import { Username } from './account/Username';
import { Visibility } from './account/Visibility';

export const Account = ({ data }: { data?: IUser }) => {
  return (
    <>
      {data && (
        <div className='space-y-8'>
          <Section sectionTitle='Change Username'>
            <Username data={data} />
          </Section>

          <Section sectionTitle='Update Password'>
            <Password data={data} />
          </Section>

          <Section sectionTitle='Manage Email'>
            <Email data={data} />
          </Section>

          <Section sectionTitle='Change Visibility' upcoming>
            <Visibility />
          </Section>
        </div>
      )}
    </>
  );
};
