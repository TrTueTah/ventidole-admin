import { useMutation } from '@tanstack/react-query';
import { uploadFileAPI } from '@/api/file.api';

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (formData: FormData) => uploadFileAPI(formData),
  });
};
