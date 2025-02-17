import axiosInstance from '../api/axiosInstance';
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

export async function updateEmail(values: { username: string; email: string }) {
  const response = await axiosInstance.put(
    `/auth/settings/email/${values.username}`,
    {
      email: values.email,
    }
  );

  return response.data;
}

export async function requestEmailVerification(email: string) {
  const response = await axiosInstance.post(`/auth/req-email-verification`, {
    email: email,
  });

  return response.data;
}
