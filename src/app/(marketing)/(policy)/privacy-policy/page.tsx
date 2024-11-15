import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/pageHeading';

import { Section } from '../../components/Section';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy',
    description:
      'Explore our privacy policy to understand how we collect, use, and protect your personal information. Read about our commitment to data security and your rights regarding your data.',
  };
}

const PrivacyPolicyPage = () => {
  return (
    <Container className='px-5 mb-20 min-h-screen sm:w-4/5 w-full space-y-4 md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Privacy Policy' className='py-1' />
        <PageSubheading
          subheading='08-15-2024'
          className='text-center opacity-75'
        />
      </PageHeader>

      <div className='space-y-8'>
        <Section title='Introduction'>
          <p>
            Welcome to The Monkeys! We are dedicated to fostering a secure and
            transparent environment for our users.
          </p>

          <p>
            This Privacy Policy serves to elucidate the nature of information we
            collect, how it is utilized, and the comprehensive measures we
            undertake to safeguard your privacy.
          </p>

          <p>
            Our Terms and Conditions (“Terms”) govern all use of our Service and
            together with the Privacy Policy constitutes your agreement with us
            (“agreement”).
          </p>
        </Section>

        <Section title='Information Collection and Use'>
          <p>
            In our pursuit of providing optimal services, we gather various
            types of data to enhance user experience.
          </p>

          <p>
            This encompasses information furnished directly by you, such as
            personal identifiers (e.g., name, email) when registering an account
            or engaging in interactions like leaving comments.
          </p>

          <p>
            Additionally, we collate data derived from your utilization of our
            services, including device details and browsing preferences, to
            refine our offerings.
          </p>
        </Section>

        <Section title='How We Use Your Information'>
          <p>
            The information we gather serves multifaceted purposes aimed at
            bolstering our service provisions.
          </p>

          <p>
            Beyond facilitating the core functionalities of our platform, we
            leverage this data to continually refine and innovate our offerings.
            Moreover, we employ it to tailor your experience, ensuring
            personalized content delivery such as customized search results and
            relevant articles.
          </p>
        </Section>

        <Section title='Information Sharing'>
          <p>At The Monkeys, preserving your privacy is paramount.</p>

          <p>
            Consequently, we adhere to stringent protocols regarding the sharing
            of personal information. Such data is never disclosed to external
            entities except under explicit user consent or in compliance with
            legal obligations.
          </p>
        </Section>

        <Section title='Security'>
          <p>
            Safeguarding the integrity and confidentiality of user data is
            central to our operational ethos. We maintain robust security
            frameworks to thwart unauthorized access, alteration, or
            dissemination of information.
          </p>

          <p>
            Our unwavering commitment extends to fortifying both The Monkeys'
            infrastructure and the privacy rights of our esteemed users.
          </p>
        </Section>

        <Section title='Retention of Data'>
          <p>
            We will retain your Personal Data only for as long as is necessary
            for the purposes set out in this Privacy Policy. We will retain and
            use your Personal Data to the extent necessary to comply with our
            legal obligations (for example, if we are required to retain your
            data to comply with applicable laws), resolve disputes, and enforce
            our legal agreements and policies.
          </p>

          <p>
            We will also retain Usage Data for internal analysis purposes. Usage
            Data is generally retained for a shorter period, except when this
            data is used to strengthen the security or to improve the
            functionality of our Service, or we are legally obligated to retain
            this data for longer time periods.
          </p>
        </Section>

        <Section title='Changes to This Privacy Policy'>
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

export default PrivacyPolicyPage;
