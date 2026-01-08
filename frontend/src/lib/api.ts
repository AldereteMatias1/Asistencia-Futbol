import { API_BASE_URL } from '../config';

export const ADMIN_KEY_STORAGE = 'admin_api_key';

export type ApiError = {
  status: number;
  message: string;
};

export const getAdminKey = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ADMIN_KEY_STORAGE);
};

export const clearAdminKey = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_KEY_STORAGE);
  window.dispatchEvent(new Event('admin-key-cleared'));
};

export async function apiFetch<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    admin?: boolean;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.admin) {
    const key = getAdminKey();
    if (key) {
      headers['x-api-key'] = key;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = 'Error inesperado';
    try {
      const data = (await response.json()) as { message?: string };
      message = data.message ?? message;
    } catch {
      message = response.statusText || message;
    }
    const error: ApiError = {
      status: response.status,
      message,
    };
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
