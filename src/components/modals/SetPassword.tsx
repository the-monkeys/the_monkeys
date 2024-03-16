import { FC, SetStateAction } from 'react';

import Icon from '../icon/Icon';

type SetPasswordProps = {
  password: string;
  setCriteriaCount?: React.Dispatch<SetStateAction<number>>;
};

const SetPassword: FC<SetPasswordProps> = ({ password, setCriteriaCount }) => {
  const hasMinimumLength = password.length >= 6;
  // const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  // const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Counting criteria
  const criteriaCount =
    Number(hasMinimumLength) +
    // Number(hasUpperCase) +
    Number(hasLowerCase) +
    Number(hasNumber);
  // Number(hasSpecialChar);

  if (setCriteriaCount) {
    setCriteriaCount(criteriaCount);
  }

  return (
    <ul className='p-2 flex flex-col gap-1 font-jost text-secondary-lightGrey text-sm'>
      <div className='flex gap-1 items-center'>
        <p>At least 6 characters.</p>
        {hasMinimumLength && (
          <Icon name='RiCheckLine' size={16} className='text-alert-green' />
        )}
      </div>

      {/* <div className='flex gap-1 items-center'>
        <p>
        At least 1 upper case letter. (A-Z)
        </p>
        {hasUpperCase && <Icon name='RiCheckLine' size={16}  className='text-alert-green'/>}
      </div> */}

      <div className='flex gap-1 items-center'>
        <p>At least 1 lower case letter. (a-z)</p>
        {hasLowerCase && (
          <Icon name='RiCheckLine' size={16} className='text-alert-green' />
        )}
      </div>

      <div className='flex gap-1 items-center'>
        <p>At least 1 number. (0-9)</p>
        {hasNumber && (
          <Icon name='RiCheckLine' size={16} className='text-alert-green' />
        )}
      </div>

      {/* <div className='flex gap-1 items-center'>
        <p>
        Exactly 1 special character.
        </p>
        {hasSpecialChar && <Icon name='RiCheckLine' size={16} className='text-alert-green' />}
      </div> */}
    </ul>
  );
};

export default SetPassword;
