import { axios } from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

export const verifyEmail = (data) => {
  return axios.post('/email/verify_email_address', data)
}

export const verifyEmailFn = async (data) => {
  const response = await verifyEmail(data)
  return response
}

export const useVerifyEmail = (config) => {
  return useMutation({
    ...config,
    mutationFn: verifyEmailFn,
  })
}