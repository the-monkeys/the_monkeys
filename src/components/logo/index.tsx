'use client';

import { useEffect, useState } from 'react';

import MobileLogo from './MobileLogo';
import WebLogo from './WebLogo';

interface LogoProps {
  showMobileLogo?: boolean;
  showSubHeading?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  showMobileLogo = false,
  showSubHeading = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='flex flex-col items-start'>
      {showMobileLogo && isMobile ? <MobileLogo /> : <WebLogo />}
      {showSubHeading && (
        <p className='font-josefin_Sans'>Inspire, Inform, & Innovate</p>
      )}
    </div>
  );
};

export default Logo;
