export interface IsFollowedResponse {
  status: string;
  isFollowing?: boolean;
}

export interface FollowDataResponse {
  users: {
    username: string;
    first_name: string;
    last_name: string;
  }[];
}

export interface GetPublicUserProfileApiResponse {
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  address: string;
  twitter: string;
  github: string;
  linkedin: string;
  instagram: string;
  created_at: Timestamp;
  topics?: string[];
}

export interface GetProfileInfoByUserIdResponse {
  account_id: string;
  username: string;
  first_name: string;
  last_name: string;
}
export interface GetAuthUserProfileApiResponse {
  account_id: string;
  date_of_birth: string;
  updated_at: Timestamp;
  user_status: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  address: string;
  contact_number: string;
  twitter: string;
  github: string;
  linkedin: string;
  instagram: string;
  created_at: Timestamp;
}

interface Timestamp {
  seconds: number;
  nanos: number;
}
