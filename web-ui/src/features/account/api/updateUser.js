import { axios } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const updateUser = (user) => {
  return axios.post(`/users/${user._id}`, user);
};

export const useUpdateUser = (config) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...config,
    onMutate: async (updatedUser) => {
      console.log(await queryClient.getQueryData(['users']));
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['users']);

      // Optimistically update to the new value
      queryClient.setQueryData(['users'], (old) => {
        if (!Array.isArray(old)) {
          return [updatedUser];
        }
        return [...old, updatedUser];
      });

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, updatedUser, context) => {
      queryClient.setQueryData(['users'], context.previousUsers);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    mutationFn: updateUser,
  });
};
