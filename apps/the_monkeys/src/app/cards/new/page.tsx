import { permanentRedirect } from 'next/navigation';

export default function NewCardPage() {
  permanentRedirect('/studio/cards/new');
}
