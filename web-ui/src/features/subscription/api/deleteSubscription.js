import { axios } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const deleteSubscription = (subscriptionId) => {
  return axios.delete(`/subscriptions/${subscriptionId}`);
};

export const useDeleteSubscription = (config) => {
  return useMutation({
    onMutate: async (deletedSubscription) => {
      await queryClient.cancelQueries(['subscriptions']);

      const previousSubscriptions = queryClient.getQueryData(['subscriptions'])

      queryClient.setQueryData(
        ['subscriptions'],
        previousSubscriptions?.filter((subscription) => subscription._id !== deletedSubscription._id)
      );

      return { previousSubscriptions };
    },
    onError: (_, __, context) => {
      if (context?.previousSubscriptions) {
        queryClient.setQueryData(['subscriptions'], context.previousSubscriptions);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptions']);
    },
    ...config,
    mutationFn: deleteSubscription,
  });
};