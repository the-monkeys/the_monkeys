import { FC, SetStateAction } from 'react';

import Icon from '../icon/Icon';

type SetPasswordProps = {
  password: string;
  setCriteriaCount?: React.Dispatch<SetStateAction<number>>;
};

const SetPassword: FC<SetPasswordProps> = ({ password, setCriteriaCount }) => {
  const hasMinimumLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Counting criteria
  const criteriaCount =
    Number(hasMinimumLength) +
    Number(hasUpperCase) +
    Number(hasLowerCase) +
    Number(hasNumber) +
    Number(hasSpecialChar);

  if (setCriteriaCount) {
    setCriteriaCount(criteriaCount);
  }

  return (
    <ul className='p-2 flex flex-col gap-1 font-jost text-secondary-lightGrey text-sm'>
      <div className='flex gap-1 items-center justify-end'>
        {hasMinimumLength && <Icon name='RiCheckLine' size={12} />}
        <p className={hasMinimumLength ? 'line-through' : ''}>
          At least 6 characters.
        </p>
      </div>

      <div className='flex gap-1 items-center justify-end'>
        {hasUpperCase && <Icon name='RiCheckLine' size={12} />}
        <p className={hasUpperCase ? 'line-through' : ''}>
          At least 1 upper case letter. (A-Z)
        </p>
      </div>

      <div className='flex gap-1 items-center justify-end'>
        {hasLowerCase && <Icon name='RiCheckLine' size={12} />}
        <p className={hasLowerCase ? 'line-through' : ''}>
          At least 1 lower case letter. (a-z)
        </p>
      </div>

      <div className='flex gap-1 items-center justify-end'>
        {hasNumber && <Icon name='RiCheckLine' size={12} />}
        <p className={hasNumber ? 'line-through' : ''}>
          At least 1 number. (0-9)
        </p>
      </div>

      <div className='flex gap-1 items-center justify-end'>
        {hasSpecialChar && <Icon name='RiCheckLine' size={12} />}
        <p className={hasSpecialChar ? 'line-through' : ''}>
          Exactly 1 special character.
        </p>
      </div>
    </ul>
  );
};

export default SetPassword;
