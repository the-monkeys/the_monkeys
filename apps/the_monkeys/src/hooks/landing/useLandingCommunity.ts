import {
  landingDiscussionQuery,
  landingGroupQuery,
} from '@/services/landing/communityApi';
import { useQuery } from '@tanstack/react-query';

export function useLandingCommunity() {
  const discussions = useQuery(landingDiscussionQuery);
  const groups = useQuery(landingGroupQuery);
  return { discussions, groups };
}
