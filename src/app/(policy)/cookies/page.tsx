import { Metadata, ResolvingMetadata } from 'next';

import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';

import PolicySection from '../components/PolicySection';
import PolicyUpdate from '../components/PolicyUpdate';

export async function generateMetadata(
  { params }: { params: { username: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;

  return {
    title: `Monkeys - Cookie Policy`,
    description: 'Learn about our cookie policy at Monkeys.',
  };
}

const CookiePage = () => {
  return (
    <Container className='px-5 mb-20 min-h-screen sm:w-4/5 w-full'>
      <PageHeading heading='Cookie Policy' />

      <PolicyUpdate />

      <div className='mt-10 space-y-6'>
        <PolicySection title='Introduction'>
          <p>
            Welcome to The Monkeys! We are dedicated to fostering a secure and
            transparent environment for our users.
          </p>

          <p>
            Our Cookie Policy explains how The Monkeys ("we", "us", or "our")
            uses cookies and similar tracking technologies when you visit our
            website.
          </p>
        </PolicySection>

        <PolicySection title='What are cookies?'>
          <p>
            Cookies are small text files that are stored on your device when you
            visit a website. They are widely used to make websites work more
            efficiently, as well as to provide information to the owners of the
            site.
          </p>
        </PolicySection>

        <PolicySection title='How do we use cookies?'>
          <p>We use cookies for the following purposes:</p>

          <ul className='list-inside space-y-1'>
            <li className='ml-8 list-disc'>
              Essential Cookies: These cookies are necessary for the website to
              function properly. They enable basic functions like page
              navigation and access to secure areas of the website. Our website
              cannot function properly without these cookies.
            </li>

            <li className='ml-8 list-disc'>
              Analytics Cookies: These cookies allow us to analyze how visitors
              use our website, so we can measure and improve the performance of
              our site.
            </li>

            <li className='ml-8 list-disc'>
              Advertising Cookies: These cookies are used to personalize the
              advertising content that you see on our website. We may use
              third-party advertising companies to serve ads when you visit our
              website. These companies may use cookies to collect information
              about your visits to this and other websites in order to provide
              relevant advertisements about goods and services that may interest
              you.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title='Your Choices Regarding Cookies'>
          <p>
            You can control and/or delete cookies as you wish. You can delete
            all cookies that are already on your computer, and you can set most
            browsers to prevent them from being placed. If you do this, however,
            you may have to manually adjust some preferences every time you
            visit a site, and some services and functionalities may not work.
          </p>
        </PolicySection>

        <PolicySection title='Changes to This Cookie Policy'>
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
        </PolicySection>

        <PolicySection title='Contact Us'>
          <p>We welcome your questions and feedback.</p>

          <p>
            If you have any questions about these policies, please contact us:
            <br />
            By mail:{' '}
            <span className='text-secondary-darkGrey dark:text-secondary-white'>
              mail.themonkeys.life@gmail.com
            </span>
          </p>
        </PolicySection>
      </div>
    </Container>
  );
};

export default CookiePage;
