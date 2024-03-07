import React from 'react';

const Checkbox = () => {
  const [checked, setChecked] = React.useState<boolean>(false);

  return (
    <div className='flex items-center justify-center gap-1'>
      <div
        className='flex h-4 w-4 items-center justify-center border-2 border-primary-monkeyOrange'
        onClick={() => setChecked((prevVal) => !prevVal)}
      >
        {checked && <div className='h-2 w-2 bg-primary-monkeyOrange'></div>}
      </div>
      <p className='font-jost text-sm'>Remember Me</p>
    </div>
  );
};

export default Checkbox;
