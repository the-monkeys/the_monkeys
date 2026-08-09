import { IUser } from '@/services/models/user';
import { useMediaQuery } from '@the-monkeys/ui/hooks/use-media-query';

import UpdateUserDialog from '../UpdateUserDialog';

export default function UpdateUser({ data }: { data: IUser }) {
  const isMobile = useMediaQuery("'(max-width: 48rem)'");

  if (isMobile) return <UpdateUserDialog data={data} />;

  return <UpdateUserDialog data={data} />;
}
