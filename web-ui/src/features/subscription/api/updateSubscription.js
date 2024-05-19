import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const updateSubscription = (subscription) => {
  return axios.post(`/subscriptions/${subscription._id}`, subscription);
};

export const useUpdateSubscription = (config) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...config,
    onMutate: async (updatedSubscription) => {
      console.log(await queryClient.getQueryData(['subscriptions']));
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['subscriptions'] });

      // Snapshot the previous value
      const previousSubscriptions = queryClient.getQueryData(['subscriptions']);

      // Optimistically update to the new value
      queryClient.setQueryData(['subscriptions'], (old) => {
        if (!Array.isArray(old)) {
          return [updatedSubscription];
        }
        return [...old, updatedSubscription];
      });

      // Return a context object with the snapshotted value
      return { previousSubscriptions };
    },
    onError: (err, updatedSubscription, context) => {
      queryClient.setQueryData(['subscriptions'], context.previousSubscriptions);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    mutationFn: updateSubscription,
  });
};
