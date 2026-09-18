import ComposerPage from '@/features/studio/composer/ComposerPage';

export default function EditComposePage({
  params,
}: {
  params: { postId: string };
}) {
  return <ComposerPage postId={params.postId} />;
}
