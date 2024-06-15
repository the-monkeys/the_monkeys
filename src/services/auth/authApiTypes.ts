interface getResetPasswordTokenRequest {
  user: string;
  evpw: string;
}

interface getResetPasswordTokenApiResponse {
  response: UserInfo;
}

interface UserInfo {
  status_code: number;
  token: string;
  user_id: number;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
}
