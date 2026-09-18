import { permanentRedirect } from 'next/navigation';

export default function EditCardPage({
  params,
}: {
  params: { cardId: string };
}) {
  permanentRedirect(`/studio/cards/${encodeURIComponent(params.cardId)}`);
}
