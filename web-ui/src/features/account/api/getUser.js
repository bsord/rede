import { axios } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';

export const getUserById = (id) => {
  console.log(id)
  return axios.get(`/users/${id}`);
};

export const getUserByIdFn = async ({queryKey}) => {
  const [_,userId] = queryKey
  const {user} = await getUserById(userId);
  console.log(user)
  return user;
};

export const useUserById = (userId, enabled) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: getUserByIdFn,
    enabled: enabled
  });
};
