'use client';

import { useDailyDonationPopup } from '@/hooks/donationPopup/useDailyDonationPopup';
import { paymentGatewayRedirectLink } from '@/utils/paymentGatewayInfo';
import { RiCloseLine } from 'react-icons/ri';

import DonationHeartVisual from './DonationHeartVisual';

const DonationPopup = () => {
  const { shouldShowPopup, handleClosePopup } = useDailyDonationPopup();

  if (!shouldShowPopup) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6'
      onClick={handleClosePopup}
    >
      <div
        className='relative w-full max-w-6xl max-h-[90vh] lg:max-h-none overflow-y-auto lg:overflow-visible bg-white dark:bg-background-dark shadow-2xl rounded-[32px] flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClosePopup}
          className='absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 text-gray-400 bg-foreground-light dark:bg-foreground-dark hover:text-gray-900 hover:dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors rounded-full hover:bg-gray-50'
          title='Close'
        >
          <RiCloseLine size={24} />
        </button>

        <div className='flex-1 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center'>
          <div className='flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16'>
            <div className='flex-1 min-w-0 space-y-3 lg:space-y-4 z-10 w-full max-w-xl pt-8 sm:pt-0 text-center lg:text-left'>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.05]'>
                Fuel research<span className='text-brand-orange'>.</span>{' '}
                <br className='hidden md:block' /> Empower engineers
                <span className='text-brand-orange'>.</span>
              </h2>

              <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0'>
                Monkeys is a research-first writing platform built for tech
                research, education, and open-source engineering. Partner with
                us to keep the servers running and fuel the next generation of
                engineers.
              </p>

              <div className='pt-1'>
                <a
                  href={paymentGatewayRedirectLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={handleClosePopup}
                  className='inline-block px-8 py-4 text-base md:text-lg font-semibold bg-brand-orange text-white rounded-md hover:brightness-110 transition-all'
                >
                  Donate Now
                </a>
              </div>
            </div>

            <DonationHeartVisual />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationPopup;
