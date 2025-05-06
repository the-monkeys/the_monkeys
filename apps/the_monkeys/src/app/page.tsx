import { RedirectType, redirect } from 'next/navigation';

export default async function LandingPage() {
  redirect('/feed', RedirectType.replace);
}
