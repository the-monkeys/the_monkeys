import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';

export const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className='flex items-center gap-1 text-sm opacity-70 hover:opacity-100 transition-opacity'
    >
      <Icon name='RiArrowLeft' size={18} />
      Back
    </button>
  );
};
