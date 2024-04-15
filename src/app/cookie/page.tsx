const Cookie = () => {
  return (
    <>
      <div className='py-10 sm:py-16 flex flex-col items-center gap-2'>
        <p className='w-fit font-josefin_Sans text-base sm:text-lg md:text-xl font-semibold text-center border-b-1 border-primary-monkeyOrange opacity-75'>
          Monkeys
        </p>
        <h1 className='font-playfair_Display text-3xl sm:text-4xl md:text-5xl font-bold'>
          Cookie Policy
        </h1>
      </div>
      <div className='px-5 flex flex-col items-start gap-2'>
        <p className='font-jost text-sm sm:text-base mb-4 opacity-75'>
          Effective date: 04/15/2024
        </p>

        <div className='my-2'>
          <h2 className='font-josefin_Sans text-2xl mb-4 font-semibold'>
            Introduction
          </h2>
          <p className='my-4 font-jost text-justify'>
            Welcome to The Monkeys! We are dedicated to fostering a secure and
            transparent environment for our users.
          </p>
          <p className='my-4 font-jost text-justify'>
            Our Cookie Policy explains how The Monkeys ("we", "us", or "our")
            uses cookies and similar tracking technologies when you visit our
            website.
          </p>
        </div>

        <div className='my-2'>
          <h2 className='font-josefin_Sans text-2xl mb-4 font-semibold'>
            What are cookies?
          </h2>
          <p className='my-4 font-jost text-justify'>
            Cookies are small text files that are stored on your device when you
            visit a website. They are widely used to make websites work more
            efficiently, as well as to provide information to the owners of the
            site.
          </p>
        </div>

        <div className='my-2'>
          <h2 className='font-josefin_Sans text-2xl mb-4 font-semibold'>
            How do we use cookies?
          </h2>
          <p className='my-4 font-jost text-justify'>
            We use cookies for the following purposes:
          </p>
          <ul className='my-2 font-jost text-justify list-inside'>
            <li className='my-2 ml-8 list-disc'>
              <span className='font-medium'>Essential Cookies</span>: These
              cookies are necessary for the website to function properly. They
              enable basic functions like page navigation and access to secure
              areas of the website. Our website cannot function properly without
              these cookies.
            </li>
            <li className='my-2 ml-8 list-disc'>
              <span className='font-medium'>Analytics Cookies</span>: These
              cookies allow us to analyze how visitors use our website, so we
              can measure and improve the performance of our site.
            </li>
            <li className='my-2 ml-8 list-disc'>
              <span className='font-medium'>Advertising Cookies</span>: These
              cookies are used to personalize the advertising content that you
              see on our website. We may use third-party advertising companies
              to serve ads when you visit our website. These companies may use
              cookies to collect information about your visits to this and other
              websites in order to provide relevant advertisements about goods
              and services that may interest you.
            </li>
          </ul>
        </div>

        <div className='my-2'>
          <h2 className='font-josefin_Sans text-2xl mb-4 font-semibold'>
            Your Choices Regarding Cookies
          </h2>
          <p className='my-4 font-jost text-justify'>
            You can control and/or delete cookies as you wish. You can delete
            all cookies that are already on your computer, and you can set most
            browsers to prevent them from being placed. If you do this, however,
            you may have to manually adjust some preferences every time you
            visit a site, and some services and functionalities may not work.
          </p>
        </div>

        <div className='my-2'>
          <h2 className='font-josefin_Sans text-2xl mb-4 font-semibold'>
            Changes to This Cookie Policy
          </h2>
          <p className='my-4 font-jost text-justify'>
            In our commitment to transparency, any revisions to our Privacy
            Policy will be promptly communicated.
          </p>
          <p className='my-4 font-jost text-justify'>
            We pledge to update this document as necessary, ensuring that users
            remain informed about our data practices and privacy protocols.
          </p>
          <p className='my-4 font-jost text-justify'>
            Any alterations will be duly reflected on this page, providing
            clarity and accountability to our valued community.
          </p>
        </div>

        <div className='my-2'>
          <h2 className='font-josefin_Sans text-2xl mb-4 font-semibold'>
            Contact Us
          </h2>
          <p className='my-4 font-jost text-justify'>
            We welcome your questions and feedback.
          </p>
          <p className='my-4 font-jost text-justify'>
            If you have any questions about these Terms of Use, please contact
            us:
            <br />
            By mail: mail.themonkeys.life@gmail.com
          </p>
        </div>
      </div>
    </>
  );
};

export default Cookie;
