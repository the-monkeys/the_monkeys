export interface GetPublicUserApiResponse {
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  address: string;
  created_at: Timestamp;
}

interface Timestamp {
  seconds: number;
  nanos: number;
}
