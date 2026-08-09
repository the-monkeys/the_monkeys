import { updateProfileSchema } from '@/lib/schema/settings';
import { GetAuthUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Values = z.infer<typeof updateProfileSchema>;

export default function useUserForm({
  user,
}: {
  user?: GetAuthUserProfileApiResponse | null;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { first_name: '', last_name: '', address: '', bio: '' },
    values: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      address: user?.address || '',
      bio: user?.bio || '',
    },
  });

  return form;
}
