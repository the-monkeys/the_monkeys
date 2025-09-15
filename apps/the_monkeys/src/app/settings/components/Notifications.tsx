import { Section } from './Section';
import { ChatNotifications } from './notifications/ChatNotifications';
import { EmailUpdates } from './notifications/EmailUpdates';

export const Notifications = () => {
  return (
    <div className='space-y-8'>
      <Section sectionTitle='Email' upcoming>
        <EmailUpdates />
      </Section>

      <Section sectionTitle='WhatsApp' upcoming>
        <ChatNotifications />
      </Section>
    </div>
  );
};
