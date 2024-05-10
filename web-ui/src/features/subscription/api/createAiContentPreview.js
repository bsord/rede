import { axios } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const createAiContentPreview = (data) => {
  return axios.post('/ai/content-from-template', data);
};

export const createAiContentPreviewFn = async (data) => {
  const response = await createAiContentPreview(data);
  return response ;
};

export const useCreateAiContentPreview = (config) => {
  return useMutation({
    onMutate: async (newAiContentPreview) => {
      await queryClient.cancelQueries(['aiContentPreview']);

      const previousAiContentPreviews = queryClient.getQueryData(['aiContentPreview']);

      queryClient.setQueryData(['aiContentPreview'], [...(previousAiContentPreviews || []), newAiContentPreview]);
      console.log(previousAiContentPreviews);
      return { previousAiContentPreviews };
    },
    onError: (_, __, context) => {
      console.log(_)
      if (context?.previousAiContentPreviews) {
        queryClient.setQueryData(['aiContentPreview'], context.previousAiContentPreviews);
      }
    },
    onSuccess: (aiContentPreviews) => {
      console.log(aiContentPreviews);
      queryClient.invalidateQueries(['aiContentPreview']);
    },
    ...config,
    mutationFn: createAiContentPreviewFn,
  });
};
