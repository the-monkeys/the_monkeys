const Checkbox = () => {
  return (
    <div className='flex items-center justify-center gap-1'>
      <input type='checkbox' className='focus:outline-none' />
      <p className='font-jost text-sm'>Remember Me</p>
    </div>
  );
};

export default Checkbox;
