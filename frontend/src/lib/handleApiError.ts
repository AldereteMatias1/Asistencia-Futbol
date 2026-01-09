import toast from 'react-hot-toast';
import { ApiError, clearAdminKey } from './api';

type Options = {
  onUnauthorized?: () => void;
};

// ✅ Factory: vos elegís options y te devuelve una función compatible con React Query
export const createApiErrorHandler =
  (options?: Options) =>
  (error: unknown) => {
    const apiError = error as ApiError;

    if (apiError?.status === 401) {
      toast.error('No autorizado');
      clearAdminKey();
      options?.onUnauthorized?.();
      return;
    }

    toast.error(apiError?.message ?? 'Ocurrió un error');
  };

// ✅ Default para usar directo: onError: handleApiError
export const handleApiError = createApiErrorHandler();
