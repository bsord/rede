import { axios } from '@/lib/axios';
import { queryClient } from '@/lib/react-query';
import { useMutation } from '@tanstack/react-query';

export const createAiContentPreview = (data) => {
  return axios.post('/ai/content-from-template', data);
};

export const createAiContentPreviewFn = async (data) => {
  const { preview } = await createAiContentPreview(data);
  return preview ;
};

export const useCreateAiContentPreview = (config) => {
  return useMutation({
    onMutate: async (newAiContentPreview) => {
      await queryClient.cancelQueries(['aiContentPreviews']);

      const previousAiContentPreviews = queryClient.getQueryData(['aiContentPreviews']);

      queryClient.setQueryData(['aiContentPreviews'], [...(previousAiContentPreviews || []), newAiContentPreview]);
      console.log(previousAiContentPreviews);
      return { previousAiContentPreviews };
    },
    onError: (_, __, context) => {
      console.log(_)
      if (context?.previousAiContentPreviews) {
        queryClient.setQueryData(['aiContentPreviews'], context.previousAiContentPreviews);
      }
    },
    onSuccess: (aiContentPreviews) => {
      console.log(aiContentPreviews);
      queryClient.invalidateQueries(['aiContentPreviews']);
    },
    ...config,
    mutationFn: createAiContentPreviewFn,
  });
};
