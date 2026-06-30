import { useEffect, useState } from 'react';

import { STORAGE_KEY, delayTimer } from '@/utils/donationHook';

export const useDailyDonationPopup = () => {
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  const todayDateString = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    let lastSeenDate: string | null = null;

    try {
      if (typeof window !== 'undefined') {
        lastSeenDate = localStorage.getItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Donation hook: Unable to read from localStorage', error);
    }

    if (lastSeenDate !== todayDateString) {
      const timer = setTimeout(() => setShouldShowPopup(true), delayTimer);
      return () => clearTimeout(timer);
    }
  }, [todayDateString]);

  const handleClosePopup = () => {
    try {
      localStorage.setItem(STORAGE_KEY, todayDateString);
    } catch (error) {
      console.warn('Donation hook: Unable to write to localStorage', error);
    } finally {
      setShouldShowPopup(false);
    }
  };

  return { shouldShowPopup, handleClosePopup };
};
