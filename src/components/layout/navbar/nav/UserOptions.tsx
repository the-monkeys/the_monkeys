import React, { FC, SetStateAction } from 'react';

type UserOptionsProps = {
  setUserOptions: React.Dispatch<SetStateAction<boolean>>;
};

const UserOptions: FC<UserOptionsProps> = ({ setUserOptions }) => {
  return (
    <div
      className='absolute right-0 top-8 h-52 w-52 bg-primary-monkeyBlack'
      onMouseEnter={() => setUserOptions(true)}
      onMouseLeave={() => setUserOptions(false)}
    >
      <p>User Options</p>
    </div>
  );
};

export default UserOptions;
