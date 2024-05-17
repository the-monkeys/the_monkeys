import Image from 'next/image';

import Icon from '@/components/icon/Icon';

const Collaboration = () => {
  return (
    <div className='self-center flex-1 flex flex-col items-center gap-2'>
      <div className='relative py-4 w-full flex items-center justify-center gap-1 overflow-hidden'>
        <div className='p-2 flex items-center justify-center border-4 border-[#E02E2E] bg-[#9E2727] rounded-full'>
          <Icon name='RiUserFill' className='text-secondary-white' />
        </div>

        <div className='p-2 flex items-center justify-center border-4 border-[#2EE08B] bg-[#1E8051] rounded-full'>
          <Icon name='RiUserFill' className='text-secondary-white' />
        </div>
      </div>

      <Image
        src='./collaborative_writing.svg'
        alt=''
        width={500}
        height={500}
      />
    </div>
  );
};

export default Collaboration;
