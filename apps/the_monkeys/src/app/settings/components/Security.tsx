import { IUser } from '@/services/models/user';

import { Section } from './Section';
import { Danger } from './security/Danger';

export const Security = ({ data }: { data?: IUser }) => {
  return (
    <div className='space-y-8'>
      <Section sectionTitle='Delete Account' isDanger={true}>
        <Danger data={data} />
      </Section>
    </div>
  );
};
