import { useEffect, useState } from 'react';

const STORAGE_KEY = 'monkeys_donation_popup_last_seen';

export const useDailyDonationPopup = () => {
  const [shouldShowPopup, setShouldShowPopup] = useState(false);

  useEffect(() => {
    const todayDateString = new Date().toLocaleDateString();

    const lastSeenDate = localStorage.getItem(STORAGE_KEY);

    if (lastSeenDate !== todayDateString) {
      const timer = setTimeout(() => setShouldShowPopup(true), 10000); // Show popup after 10 seconds of delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    const todayDateString = new Date().toLocaleDateString();

    localStorage.setItem(STORAGE_KEY, todayDateString);
    setShouldShowPopup(false);
  };

  return { shouldShowPopup, handleClosePopup };
};
