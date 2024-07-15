interface getResetPasswordTokenRequest {
  user: string;
  evpw: string;
}

interface verifyEmailVerificationTokenRequest {
  user: string;
  evpw: string;
}

interface getResetPasswordTokenApiResponse {
  response: UserInfo;
}

interface verifyEmailVerificationTokenApiResponse {
  response: {
    status_code: number;
    token: string;
  };
}

interface UserInfo {
  status_code: number;
  token: string;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}
