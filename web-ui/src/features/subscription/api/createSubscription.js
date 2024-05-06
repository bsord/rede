import { axios } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const createSubscription = (data) => {
  return axios.post('/subscriptions', data);
};

export const createSubscriptionFn = async (data) => {
  const { subscription } = await createSubscription(data);
  return subscription;
};

export const useCreateSubscription = (config) => {
  return useMutation({
    onMutate: async (newSubscription) => {
      await queryClient.cancelQueries(['subscriptions']);

      const previousSubscriptions = queryClient.getQueryData(['subscriptions']);

      queryClient.setQueryData(['subscriptions'], [...(previousSubscriptions || []), newSubscription]);
      console.log(previousSubscriptions);
      return { previousSubscriptions };
    },
    onError: (_, __, context) => {
      console.log(_)
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(['subscriptions'], context.previousSubscriptions);
      }
    },
    onSuccess: (subscriptions) => {
      console.log(subscriptions);
      queryClient.invalidateQueries(['subscriptions']);
    },
    ...config,
    mutationFn: createSubscriptionFn,
  });
};
