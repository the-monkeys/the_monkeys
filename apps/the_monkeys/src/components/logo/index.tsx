import MobileLogo from './MobileLogo';
import WebLogo from './WebLogo';

const Logo = ({ showSubHeading = false }: { showSubHeading?: boolean }) => {
  return (
    <div className='flex flex-col items-start'>
      <MobileLogo /> <WebLogo />
      {showSubHeading && (
        <p className='font-dm_sans text-sm'>Inspire, Inform, Innovate</p>
      )}
    </div>
  );
};

export default Logo;
