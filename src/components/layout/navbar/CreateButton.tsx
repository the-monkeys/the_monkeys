import Button from '@/components/button';

const CreateButton = () => {
  return (
    <div className='flex flex-col items-center'>
      <Button
        title='Create'
        variant='circular'
        iconName='RiPencilLine'
        animateIcon
      />
      <p className='hidden font-playfair_Display font-medium sm:block'>
        Create
      </p>
    </div>
  );
};

export default CreateButton;
