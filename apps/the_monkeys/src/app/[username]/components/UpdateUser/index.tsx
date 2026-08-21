'use client';

import dynamic from 'next/dynamic';

import { IUser } from '@/services/models/user';
import { useMediaQuery } from '@the-monkeys/ui/hooks/use-media-query';

const UpdateUserDialog = dynamic(() => import('../UpdateUserDialog'));
const UpdateUserDrawer = dynamic(() => import('../UpdateUserDrawer'));

export default function UpdateUser({ data }: { data: IUser }) {
  const isMobile = useMediaQuery('(max-width: 48rem)');

  if (isMobile) return <UpdateUserDrawer data={data} />;

  return <UpdateUserDialog data={data} />;
}
