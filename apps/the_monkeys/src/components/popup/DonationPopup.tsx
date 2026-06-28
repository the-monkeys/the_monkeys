'use client';

import { RiCloseLine } from 'react-icons/ri';
import { useDailyDonationPopup } from '@/hooks/donationPopup/useDailyDonationPopup';

const DonationPopup = () => {
    const { shouldShowPopup, handleClosePopup } = useDailyDonationPopup();

    if (!shouldShowPopup) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            onClick={handleClosePopup}
        >
            <div 
                className="relative w-full max-w-md p-6 m-4 bg-white dark:bg-background-dark shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-900"
                onClick={(e) => e.stopPropagation()}
            >
                
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 pr-6">Support Monkeys</h3>

                    <button
                        onClick={handleClosePopup}
                        className="text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                        title="Close"
                    >
                        <RiCloseLine size={24} />
                    </button>
                </div>

                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    Monkeys is a research-first writing platform built for tech research, education, and open-source engineering. We are inviting supporters to help us keep the lights on and push the work forward.
                </p>
                
                <div className="flex">
                    <a
                        href="https://razorpay.me/@buddhicintakaprivatelimited"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2.5 text-sm text-center font-medium bg-brand-orange text-white rounded-lg hover:brightness-110 transition-all cursor-pointer"
                    >
                        Donate
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DonationPopup;