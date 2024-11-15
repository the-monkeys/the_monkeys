import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/pageHeading';

import { Section } from '../components/Section';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Use',
    description:
      'Read the terms of use for Monkeys to understand the rules and guidelines for using our website and services. Learn about acceptance of terms, user responsibilities, prohibited uses etc.',
  };
}

const TermsPage = () => {
  return (
    <Container className='px-5 mb-20 min-h-screen sm:w-4/5 w-full space-y-4 md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Terms of Use' className='py-1' />
        <PageSubheading
          subheading='08-15-2024'
          className='text-center opacity-75'
        />
      </PageHeader>

      <div className='space-y-8'>
        <Section title='Introduction'>
          <p>
            Welcome to themonkeys.live (“Company”, “we”, “our”, “us”)! As you
            have just clicked our Terms of Use, please pause, grab a cup of
            coffee and carefully read the following points. It will take you
            approximately 15 minutes.
          </p>

          <p>
            Our Privacy Policy also governs your use of our Service and explains
            how we collect, safeguard and disclose information that results from
            your use of our web pages. Please read it here
            https://themonkeys.live/privacy.
          </p>

          <p>
            Your agreement with us includes these Terms and our Privacy Policy
            (“Agreements”). You acknowledge that you have read and understood
            Agreements, and agree to be bound of them.
          </p>

          <p>Thank you for being responsible.</p>
        </Section>

        <Section title='Acceptance of Terms'>
          <p>
            By using our website, you agree to the Terms of Use. If you do not
            agree to these terms, you should not use this site. Your continued
            use of the site after any modifications to these terms constitutes
            acceptance of those changes.
          </p>
        </Section>

        <Section title='License to Use Site'>
          <p>
            The Monkeys grants you a limited, revocable, non-exclusive license
            to access and make personal use of this site.
          </p>

          <p>
            This license does not include any resale or commercial use of the
            site or its contents; any derivative use of this site or its
            contents; any downloading or copying of account information for the
            benefit of another merchant; or any use of data mining, robots, or
            similar data gathering and extraction tools.
          </p>

          <p>
            You may not frame or utilize framing techniques to enclose any
            trademark, logo, or other proprietary information (including images,
            text, page layout, or form) of The Monkeys without express written
            consent. Any unauthorized use terminates the permission or license
            granted by The Monkeys.
          </p>
        </Section>

        <Section title='User Responsibilities'>
          <p>
            Users are solely responsible for any content they post on The
            Monkeys. By posting content, you warrant and represent that you own
            or otherwise control all of the rights to your content and that the
            content is accurate, does not violate these Terms of Use, and will
            not cause injury to any person or entity.
          </p>

          <p>
            We reserve the right to remove any content that we believe violates
            these Terms of Use or is otherwise objectionable, without prior
            notice and at our sole discretion.
          </p>
        </Section>

        <Section title='Intellectual Property'>
          <p>
            All content on this site, including text, graphics, logos, images,
            audio clips, video clips, digital downloads, data compilations, and
            software, is the property of The Monkeys or its content suppliers
            and is protected by international copyright laws.
          </p>

          <p>
            The compilation of all content on this site is the exclusive
            property of The Monkeys and is protected by international copyright
            laws. All software used on this site is the property of The Monkeys
            or its software suppliers and is protected by international
            copyright laws.
          </p>
        </Section>

        <Section title='Prohibited Uses'>
          <p>
            You may use Service only for lawful purposes and in accordance with
            Terms. You agree not to use Service:
          </p>

          <ul className='list-inside space-y-2'>
            <li className='ml-4 list-disc'>
              In any way that violates any applicable national or international
              law or regulation.
            </li>

            <li className='ml-4 list-disc'>
              For the purpose of exploiting, harming, or attempting to exploit
              or harm minors in any way by exposing them to inappropriate
              content or otherwise.
            </li>

            <li className='ml-4 list-disc'>
              In any way that infringes upon the rights of others, or in any way
              is illegal, threatening, fraudulent, or harmful, or in connection
              with any unlawful, illegal, fraudulent, or harmful purpose or
              activity.
            </li>

            <li className='ml-4 list-disc'>
              To engage in any other conduct that restricts or inhibits anyone’s
              use or enjoyment of Service, or which, as determined by us, may
              harm or offend Company or users of Service or expose them to
              liability.
            </li>
          </ul>
        </Section>

        <Section title='Termination'>
          <p>
            We may terminate or suspend your account and bar access to Service
            immediately, without prior notice or liability, under our sole
            discretion, for any reason whatsoever and without limitation,
            including but not limited to a breach of Terms.
          </p>

          <p>
            If you wish to terminate your account, you may simply discontinue
            using Service.
          </p>

          <p>
            All provisions of Terms which by their nature should survive
            termination shall survive termination, including, without
            limitation, ownership provisions, warranty disclaimers, indemnity
            and limitations of liability.
          </p>
        </Section>

        <Section title='Changes to Terms of Use'>
          <p>
            We reserve the right to update or modify these Terms of Use at any
            time without prior notice. It is your responsibility to review these
            Terms of Use periodically for changes.
          </p>

          <p>
            Your continued use of the site following the posting of any changes
            to these Terms of Use constitutes acceptance of those changes.
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

export default TermsPage;
