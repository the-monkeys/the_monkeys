import axiosInstance from '../api/axiosInstance';
import axiosInstanceV2 from '../api/axiosInstanceV2';
import { IUser } from '../models/user';

export async function updateUserName({
  username,
  newUsername,
}: {
  username: string;
  newUsername: string;
}) {
  const resp = await axiosInstance.put<IUser>(
    `/auth/settings/username/${username}`,
    { username: newUsername }
  );

  return resp.data;
}

export async function updatePassword(values: {
  username: string;
  currentPassword: string;
  password: string;
}) {
  const resp = await axiosInstance.put<IUser>(
    `/auth/settings/password/${values.username}`,
    {
      current_password: values.currentPassword,
      new_password: values.password,
    }
  );

  return resp.data;
}

// OTP-based email change flow
export async function initiateEmailChange(values: {
  username: string;
  newEmail: string;
}) {
  const response = await axiosInstance.post(
    `/auth/settings/email/initiate/${values.username}`,
    { new_email: values.newEmail }
  );
  return response.data;
}

export async function verifyEmailChangeOTP(values: {
  username: string;
  newEmail: string;
  otpCode: string;
}) {
  const response = await axiosInstance.post(
    `/auth/settings/email/verify-otp/${values.username}`,
    { new_email: values.newEmail, otp_code: values.otpCode }
  );
  return response.data;
}

export async function resendEmailChangeOTP(values: {
  username: string;
  newEmail: string;
}) {
  const response = await axiosInstance.post(
    `/auth/settings/email/resend-otp/${values.username}`,
    { new_email: values.newEmail }
  );
  return response.data;
}

export async function requestEmailVerification(email: string) {
  const response = await axiosInstance.post(`/auth/req-email-verification`, {
    email: email,
  });

  return response.data;
}

export async function deleteUser(username: string) {
  const response = await axiosInstance.delete(`/user/${username}`);

  return response.data;
}

export const followTopicApi = async (username: string, topic: string) => {
  return axiosInstance.put(`/user/follow-topics/${username}`, {
    topics: [topic],
  });
};

export const unfollowTopicApi = async (username: string, topic: string) => {
  return axiosInstance.put(`/user/un-follow-topics/${username}`, {
    topics: [topic],
  });
};

export async function uploadProfileImage(username: string, file: File) {
  const formData = new FormData();
  formData.append('profile_pic', file);

  const response = await axiosInstanceV2.post(
    `/storage/profiles/${username}/profile`,
    formData
  );

  return response.data;
}
