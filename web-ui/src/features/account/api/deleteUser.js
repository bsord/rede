import { axios } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const deleteUser = (userId) => {
  return axios.delete(`/users/${userId}`);
};

export const useDeleteUser = (config) => {
  return useMutation({
    onMutate: async (deletedUser) => {
      await queryClient.cancelQueries(['users']);

      const previousUsers = queryClient.getQueryData(['users'])

      queryClient.setQueryData(
        ['users'],
        previousUsers?.filter((user) => user._id !== deletedUser._id)
      );

      return { previousUsers };
    },
    onError: (_, __, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
    ...config,
    mutationFn: deleteUser,
  });
};