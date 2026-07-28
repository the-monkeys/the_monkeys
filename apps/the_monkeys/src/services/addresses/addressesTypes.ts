import { ProtoTimestamp } from '../cards/cardsTypes';

// PRIVATE address book entry. Owner-only; never present on public profile data.
export interface UserAddress {
  id: string;
  account_id: string;
  label: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default: boolean;
  created_at?: ProtoTimestamp | string;
  updated_at?: ProtoTimestamp | string;
}

export interface UserAddressInput {
  label: string;
  line1: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}

export interface ListUserAddressesResponse {
  addresses?: UserAddress[];
}
