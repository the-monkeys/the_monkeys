import { Section } from './Section';
import { Email } from './account/Email';
import { Password } from './account/Password';
import { Username } from './account/Username';
import { Visibility } from './account/Visibility';

export const Account = () => {
  return (
    <div className='space-y-8'>
      <Section sectionTitle='Change Username'>
        <Username />
      </Section>

      <Section sectionTitle='Update Password'>
        <Password />
      </Section>

      <Section sectionTitle='Manage Email'>
        <Email />
      </Section>

      <Section sectionTitle='Change Visibility'>
        <Visibility />
      </Section>
    </div>
  );
};
