import PageHeading from '@/components/pageHeading';

import PolicySection from '../components/PolicySection';

const Privacy = () => {
  return (
    <div className='px-5'>
      <PageHeading heading='Privacy Policy' />

      <p className='py-4 font-jost text-right text-sm'>
        Effective date: 06/15/2024
      </p>

      <div className='mt-10 space-y-6'>
        <PolicySection title='Introduction'>
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
        </PolicySection>

        <PolicySection title='Information Collection and Use'>
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
        </PolicySection>

        <PolicySection title='How We Use Your Information'>
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
        </PolicySection>

        <PolicySection title='Information Sharing'>
          <p>At The Monkeys, preserving your privacy is paramount.</p>

          <p>
            Consequently, we adhere to stringent protocols regarding the sharing
            of personal information. Such data is never disclosed to external
            entities except under explicit user consent or in compliance with
            legal obligations.
          </p>
        </PolicySection>

        <PolicySection title='Security'>
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
        </PolicySection>

        <PolicySection title='Retention of Data'>
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
        </PolicySection>

        <PolicySection title='Changes to This Privacy Policy'>
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
            By mail: mail.themonkeys.life@gmail.com
          </p>
        </PolicySection>
      </div>
    </div>
  );
};

export default Privacy;
