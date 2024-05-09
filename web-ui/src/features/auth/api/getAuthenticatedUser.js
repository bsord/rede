import { axios } from '@/lib/axios'
import { useQuery,useQueryClient  } from '@tanstack/react-query'
import storage from '@/utils/storage'

export const getAuthenticatedUser = () => {
  if(storage.auth.getToken()){
    return axios.get('/auth/me')
  } else {
    return null
  }
  
}

export const useAuthenticatedUser = (config) => {
  return useQuery({
    ...config,
    queryKey: ['authenticated-user'],
    queryFn: getAuthenticatedUser,
    initialData: storage.auth.getAuthenticatedUser ?? null,
  })
}
