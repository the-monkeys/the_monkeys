import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/pageHeading';

import Section from '../../components/Section';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cookie Policy',
    description:
      'Discover how Monkeys uses cookies to enhance your experience on our website. Read our detailed Cookie Policy to learn about the types of cookies we use, their purpose, and your rights regarding cookie usage.',
  };
}

const CookiePage = () => {
  return (
    <Container className='px-5 mb-20 min-h-screen sm:w-4/5 w-full space-y-4 md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Cookie Policy' className='py-1' />
        <PageSubheading subheading='08-15-2024' className='opacity-75' />
      </PageHeader>

      <div className='space-y-6 md:space-y-8'>
        <Section title='Introduction'>
          <p>
            Welcome to The Monkeys! We are dedicated to fostering a secure and
            transparent environment for our users.
          </p>

          <p>
            Our Cookie Policy explains how The Monkeys ("we", "us", or "our")
            uses cookies and similar tracking technologies when you visit our
            website.
          </p>
        </Section>

        <Section title='What are cookies?'>
          <p>
            Cookies are small text files that are stored on your device when you
            visit a website. They are widely used to make websites work more
            efficiently, as well as to provide information to the owners of the
            site.
          </p>
        </Section>

        <Section title='How do we use cookies?'>
          <p>We use cookies for the following purposes:</p>

          <ul className='list-inside space-y-2'>
            <li className='ml-4 list-disc'>
              Essential Cookies: These cookies are necessary for the website to
              function properly. They enable basic functions like page
              navigation and access to secure areas of the website. Our website
              cannot function properly without these cookies.
            </li>

            <li className='ml-4 list-disc'>
              Analytics Cookies: These cookies allow us to analyze how visitors
              use our website, so we can measure and improve the performance of
              our site.
            </li>

            <li className='ml-4 list-disc'>
              Advertising Cookies: These cookies are used to personalize the
              advertising content that you see on our website. We may use
              third-party advertising companies to serve ads when you visit our
              website. These companies may use cookies to collect information
              about your visits to this and other websites in order to provide
              relevant advertisements about goods and services that may interest
              you.
            </li>
          </ul>
        </Section>

        <Section title='Your Choices Regarding Cookies'>
          <p>
            You can control and/or delete cookies as you wish. You can delete
            all cookies that are already on your computer, and you can set most
            browsers to prevent them from being placed. If you do this, however,
            you may have to manually adjust some preferences every time you
            visit a site, and some services and functionalities may not work.
          </p>
        </Section>

        <Section title='Changes to This Cookie Policy'>
          <p>
            In our commitment to transparency, any revisions to our Privacy
            Policy will be promptly communicated.
          </p>

          <p>
            We pledge to update this document as necessary, ensuring that users
            remain informed about our data practices and privacy protocols.
          </p>

          <p>
            Any alterations will be duly reflected on this page, providing
            clarity and accountability to our valued community.
          </p>
        </Section>

        <Section title='Contact Us'>
          <p>We welcome your questions and feedback.</p>

          <p>
            If you have any questions about these policies, please contact us:
            <br />
            By mail:{' '}
            <span className='text-secondary-darkGrey dark:text-secondary-white'>
              mail.themonkeys.life@gmail.com
            </span>
          </p>
        </Section>
      </div>
    </Container>
  );
};

export default CookiePage;
