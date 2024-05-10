import { axios } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';

const useUnsubscribe = () => {
  return useMutation({
    mutationFn: (token) => axios.post(`/subscriptions/unsubscribe`, { token }),
    onError: (error) => {
      console.error('Unsubscribe failed:', error.response?.data || error.message);
    }
  });
};

export default useUnsubscribe;