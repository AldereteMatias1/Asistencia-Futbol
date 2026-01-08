import toast from 'react-hot-toast';
import { ApiError, clearAdminKey } from './api';

type Options = {
  onUnauthorized?: () => void;
};

export const handleApiError = (error: unknown, options?: Options) => {
  const apiError = error as ApiError;
  if (apiError?.status === 401) {
    toast.error('No autorizado');
    clearAdminKey();
    options?.onUnauthorized?.();
    return;
  }

  toast.error(apiError?.message ?? 'Ocurrió un error');
};
