import { FC, useState } from 'react';

type CheckboxProps = {
  title: string;
};

const Checkbox: FC<CheckboxProps> = ({ title }) => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className='flex items-center justify-center gap-1'>
      <div
        className='flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary-monkeyOrange'
        onClick={() => setChecked((prevVal) => !prevVal)}
      >
        {checked && (
          <div className='h-2 w-2 rounded-full bg-primary-monkeyOrange'></div>
        )}
      </div>
      <p className='font-jost text-sm'>{title}</p>
    </div>
  );
};

export default Checkbox;
