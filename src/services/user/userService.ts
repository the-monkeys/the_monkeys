import axiosInstance from '@/services/api/axiosInstance';

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
