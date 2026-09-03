'use client';

import { useRouter } from 'next/navigation';

import { GroupForm } from '@/components/groups/GroupForm';
import { GROUPS_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { useCreateGroup } from '@/hooks/groups/useGroupQueries';
import {
  groupError,
  updateGroup,
  uploadGroupImage,
} from '@/services/groups/groupsApi';
import { GroupBody } from '@/services/groups/groupsTypes';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

export default function NewGroupPage() {
  const { data: session, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const create = useCreateGroup();

  if (!isLoading && !session) {
    router.replace(LOGIN_ROUTE);
    return null;
  }

  const onSubmit = async (
    body: GroupBody,
    images?: { logo?: File; cover?: File }
  ) => {
    try {
      const res = await create.mutateAsync(body);
      const slug = res.group?.slug;
      // Images picked before the group existed are uploaded now and persisted.
      // A failure here must not discard the created group, so it is non-fatal.
      if (slug && (images?.logo || images?.cover)) {
        try {
          const patch: GroupBody = { ...body };
          if (images.logo) {
            const up = await uploadGroupImage(slug, 'logo', images.logo);
            if (up?.url) patch.logo_image = up.url;
          }
          if (images.cover) {
            const up = await uploadGroupImage(slug, 'cover', images.cover);
            if (up?.url) patch.cover_image = up.url;
          }
          if (patch.logo_image || patch.cover_image) {
            await updateGroup(slug, patch);
          }
        } catch {
          toast({
            title: 'Group created, but an image upload failed',
            description: 'You can add it from the edit page.',
          });
        }
      }
      toast({ title: 'Draft created' });
      router.push(slug ? `${GROUPS_ROUTE}/${slug}/manage` : GROUPS_ROUTE);
    } catch (err) {
      toast({ title: 'Could not create group', description: groupError(err) });
    }
  };

  return (
    <div className='mx-auto max-w-2xl'>
      <h1 className='mb-6 font-newsreader text-3xl font-bold md:text-4xl'>
        Start a group
      </h1>
      <GroupForm
        submitLabel='Create draft'
        saving={create.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
