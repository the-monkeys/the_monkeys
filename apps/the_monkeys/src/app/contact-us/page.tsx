import { BackgroundWaves } from '@/components/branding/BackgroundWaves';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

import ContactForm from './components/ContactForm';

const ContactPage = () => {
  return (
    <Container className='p-4 pb-12 max-w-7xl space-y-10 md:space-y-16'>
      <div className='relative py-6 h-[120px] w-full flex items-center justify-center'>
        <div className='absolute top-0 left-0 h-full w-full -z-10 opacity-80'>
          <BackgroundWaves />
        </div>

        <PageHeader>
          <PageHeading heading='Contact Our Team' className='py-1' />
          <PageSubheading
            subheading='Let us know how we can help.'
            className='text-center'
          />
        </PageHeader>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
        <div className='col-span-2 md:col-span-1 flex flex-col gap-10'>
          <div className='space-y-3'>
            <h2 className='font-dm_sans font-semibold text-2xl sm:text-3xl md:text-4xl'>
              Questions or Ideas
              <span className='font-dm_sans font-semibold text-brand-orange'>
                ?
              </span>
            </h2>

            <p className='text-sm md:text-base opacity-90'>
              We&apos;d love to hear from you, whether it&apos;s a{' '}
              <span className='font-medium'>feedback</span> or a{' '}
              <span className='font-medium'>collaboration</span> enquiry. Send
              us a message anytime!
            </p>
          </div>

          <div className='hidden md:grid grid-cols-2 gap-2 md:gap-4'>
            <div className='p-4 col-span-1 rounded-md border border-brand-orange/40 bg-brand-orange/10 hover:border-brand-orange space-y-2'>
              <Icon
                name='RiLightbulb'
                type='Fill'
                className='text-brand-orange'
              />

              <div className='space-y-1'>
                <h4 className='font-medium'>Suggest Features</h4>
                <p className='hidden sm:block text-sm opacity-90'>
                  We&apos;re always looking for inspiration.
                </p>
              </div>
            </div>

            <div className='p-4 col-span-1 rounded-md border border-brand-orange/40 bg-brand-orange/10 hover:border-brand-orange space-y-2'>
              <Icon
                name='RiMessage3'
                type='Fill'
                className='text-brand-orange'
              />

              <div className='space-y-1'>
                <h4 className='font-medium'>Share Feedback</h4>
                <p className='hidden sm:block text-sm opacity-90'>
                  Share what you love or what we can improve.
                </p>
              </div>
            </div>

            <div className='p-4 col-span-1 rounded-md border border-brand-orange/40 bg-brand-orange/10 hover:border-brand-orange space-y-2'>
              <Icon name='RiBug' type='Fill' className='text-brand-orange' />

              <div className='space-y-1'>
                <h4 className='font-medium'>Report an Issue</h4>
                <p className='hidden sm:block text-sm opacity-90'>
                  Report it on GitHub and help us improve.
                </p>
              </div>
            </div>

            <div className='p-4 col-span-1 rounded-md border border-brand-orange/40 bg-brand-orange/10 hover:border-brand-orange space-y-2'>
              <Icon
                name='RiMessage'
                type='Fill'
                className='text-brand-orange'
              />

              <div className='space-y-1'>
                <h4 className='font-medium'>General Enquiries</h4>
                <p className='hidden sm:block text-sm opacity-90'>
                  For anything else, our team is happy to help.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='col-span-2 md:col-span-1'>
          <ContactForm />
        </div>
      </div>
    </Container>
  );
};

export default ContactPage;
