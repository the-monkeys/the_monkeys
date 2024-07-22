import { twMerge } from 'tailwind-merge';

const LetterButton = ({
  letter,
  className,
  onClick,
}: {
  letter: string;
  className?: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        className,
        'group size-8 sm:size-10 flex items-center justify-center rounded-full'
      )}
    >
      <p className='font-jost text-sm sm:text-base font-medium text-secondary-darkGrey dark:text-secondary-white group-hover:text-primary-monkeyOrange'>
        {letter}
      </p>
    </button>
  );
};

export default LetterButton;
