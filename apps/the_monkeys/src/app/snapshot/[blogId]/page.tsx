import { permanentRedirect } from 'next/navigation';

export default function SnapshotDetailPage({
  params,
}: {
  params: { blogId: string };
}) {
  permanentRedirect(`/studio/snapshot/${encodeURIComponent(params.blogId)}`);
}
