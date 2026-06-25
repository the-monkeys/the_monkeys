'use client';

import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
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
    const blogId = Math.random().toString(36).substring(7);
    router.push(`/edit/${blogId}?isNew=true`);
  };

  return (
    <Button {...props} className={className} onClick={handleCreate}>
      {showIcon && (
        <Icon
          name='RiPencil'
          className='mr-[6px] group-hover:animate-icon-shake opacity-90'
        />
      )}
      {label}
    </Button>
  );
};
