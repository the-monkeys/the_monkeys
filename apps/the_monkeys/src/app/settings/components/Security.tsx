import { Section } from './Section';
import { Danger } from './security/Danger';

export const Security = () => {
  return (
    <div className='space-y-8'>
      <Section sectionTitle='Delete Account' isDanger={true}>
        <Danger />
      </Section>
    </div>
  );
};
