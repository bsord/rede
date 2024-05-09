import { useMutation, useQueryClient } from '@tanstack/react-query'
import storage from '@/utils/storage'
import { useNavigate } from 'react-router-dom'

export const logoutFn = async () => {
  await storage.auth.clearToken()
  await storage.auth.clearAuthenticatedUser()
}

export const useLogout = (config) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    onSuccess: async () => {
      await queryClient.setQueryData(['authenticated-user'], '')
      navigate('/')
    },
    ...config,
    mutationFn: logoutFn,
  })
}
