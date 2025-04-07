import { Section } from './Section';
import { ChatNotifications } from './notifications/ChatNotifications';
import { EmailUpdates } from './notifications/EmailUpdates';

export const Notifications = () => {
  return (
    <div className='space-y-8'>
      <Section sectionTitle='Email Updates'>
        <EmailUpdates />
      </Section>

      <Section sectionTitle='WhatsApp Notifications'>
        <ChatNotifications />
      </Section>
    </div>
  );
};
