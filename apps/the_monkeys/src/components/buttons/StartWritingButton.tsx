'use client';

import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { CREATE_ROUTE } from '@/constants/routeConstants';
import { Button, ButtonProps } from '@the-monkeys/ui/atoms/button';

interface StartWritingButtonProps extends ButtonProps {
  label?: string;
  showIcon?: boolean;
}

export const StartWritingButton = ({
  label = 'Start Writing',
  showIcon = true,
  className,
  ...props
}: StartWritingButtonProps) => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(CREATE_ROUTE);
  };

  return (
    <Button {...props} className={className} onClick={handleCreate}>
      {showIcon && (
        <Icon
          name='RiPencil'
          className='mr-1.5 group-hover:animate-icon-shake opacity-90'
        />
      )}
      {label}
    </Button>
  );
};
