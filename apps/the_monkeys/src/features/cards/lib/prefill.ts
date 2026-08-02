import fetcher from '@/services/fileFetcher';
import { IUser } from '@/services/models/user';
import { GetAuthUserProfileApiResponse } from '@/services/profile/userApiTypes';

import { CardContact, SocialLink, SocialNetwork } from '../types';

export interface ProfilePrefill {
  contact: Partial<CardContact>;
  socialLinks: SocialLink[];
}

const trimmed = (value?: string | null): string | undefined => {
  const v = value?.trim();
  return v ? v : undefined;
};

/**
 * Maps the signed-in user's account + profile data onto card fields so a new
 * card starts pre-filled. Only non-empty values are returned; callers should
 * apply this ONLY when the user has not already entered data.
 */
export const buildProfilePrefill = (
  session?: IUser | null,
  profile?: GetAuthUserProfileApiResponse | null
): ProfilePrefill => {
  const contact: Partial<CardContact> = {};

  const firstName =
    trimmed(session?.first_name) ?? trimmed(profile?.first_name);
  const lastName = trimmed(session?.last_name) ?? trimmed(profile?.last_name);
  if (firstName) contact.firstName = firstName;
  if (lastName) contact.lastName = lastName;

  const email = trimmed(session?.email);
  if (email) contact.email = email;

  const phone = trimmed(profile?.contact_number);
  if (phone) contact.phone = phone;

  // Address is intentionally NOT prefilled from the public profile. The card
  // address is private and comes from the user's private address book (or is
  // left blank), so a public address is never silently copied onto a card.

  const links: SocialLink[] = [];
  const push = (network: SocialNetwork, url?: string) => {
    const u = trimmed(url);
    if (u) links.push({ network, url: u });
  };
  push('linkedin', profile?.linkedin);
  push('x', profile?.twitter);
  push('github', profile?.github);
  push('instagram', profile?.instagram);

  return { contact, socialLinks: links };
};

/**
 * Fetches the signed-in user's profile picture and returns it as a self-
 * contained data URL suitable for embedding in a card (so it exports and
 * persists offline). Returns undefined when the user has no picture set.
 */
export const fetchProfileAvatarDataUrl = async (
  username?: string | null
): Promise<string | undefined> => {
  if (!username) return undefined;
  try {
    const blob: Blob = await fetcher(`/storage/profiles/${username}/profile`);
    if (!(blob instanceof Blob) || blob.size === 0) return undefined;
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    // No profile picture (404) or fetch failed — fall back to initials.
    return undefined;
  }
};
