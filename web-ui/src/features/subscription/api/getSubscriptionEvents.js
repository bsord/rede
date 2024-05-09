import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const getSubscriptionEventsBySubscriptionId = (id) => {
  return axios.get(`/subscriptions/${id}/events`);
};

export const getSubscriptionEventsBySubscriptionIdFn = async ({queryKey}) => {
  const [_,subscriptionId] = queryKey
  const {events} = await getSubscriptionEventsBySubscriptionId(subscriptionId);
  return events;
};

export const useSubscriptionEventsBySubscriptionId = (subscriptionId, enabled) => {
  return useQuery({
    queryKey: ['subscription_events', subscriptionId],
    queryFn: getSubscriptionEventsBySubscriptionIdFn,
    enabled: enabled
  });
};
