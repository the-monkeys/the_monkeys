import Icon, { IconName } from '../icon';
import LinksRedirectArrow from '../links/LinksRedirectArrow';

const SocialCard = ({
  icon,
  title,
  text,
  link,
}: {
  icon: IconName;
  title: string;
  text: string;
  link: string;
}) => {
  return (
    <div className='col-span-2 sm:col-span-1 p-4 flex flex-col justify-between bg-foreground-light/25 dark:bg-foreground-dark/25 border-1 border-border-light dark:border-border-dark rounded-md space-y-4'>
      <Icon name={icon} className='opacity-80' />

      <div className='space-y-1'>
        <LinksRedirectArrow link={link}>
          <h2 className='font-dm_sans font-medium text-base md:text-lg'>
            {title}
          </h2>
        </LinksRedirectArrow>

        <p className='text-xs md:text-sm opacity-80'>{text}</p>
      </div>
    </div>
  );
};

export default SocialCard;
