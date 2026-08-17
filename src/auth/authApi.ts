export type AuthApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
};

export async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({ success: false, message: 'Something went wrong' }));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data as T;
}
