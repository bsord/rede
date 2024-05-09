import { axios } from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'

export const magicLink = (data) => {
  return axios.post('/auth/magic-link', data)
}

export const magicLinkFn = async (data) => {
  const response = await magicLink(data)
  return response
}

export const useMagicLink = (config) => {
  return useMutation({
    ...config,
    mutationFn: magicLinkFn,
  })
}
