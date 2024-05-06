import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const getSubscriptions = () => {
  return axios.get(`/subscriptions`);
};

export const getSubscriptionsFn = async () => {
  const { subscriptions } = await getSubscriptions();
  return subscriptions;
};

export const useSubscriptions = (config) => {
  return useQuery({
    ...config,
    queryKey: ['subscriptions'],
    queryFn: getSubscriptionsFn,
  });
};

export const getSubscriptionById = (id) => {
  console.log(id)
  return axios.get(`/subscriptions/${id}`);
};

export const getSubscriptionByIdFn = async ({queryKey}) => {
  const [_,subscriptionId] = queryKey
  const {subscription} = await getSubscriptionById(subscriptionId);
  console.log(subscription)
  return subscription;
};

export const useSubscriptionById = (subscriptionId, enabled) => {
  return useQuery({
    queryKey: ['subscriptions', subscriptionId],
    queryFn: getSubscriptionByIdFn,
    enabled: enabled
  });
};
