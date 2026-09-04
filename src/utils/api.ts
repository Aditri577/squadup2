export const TOKEN_KEY = 'squadup_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

export async function api<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();
  const hasBody = options.body !== undefined;

  const res = await fetch(path, {
    method: options.method || 'GET',
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: hasBody ? JSON.stringify(options.body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const fallbackMessage = res.status === 404 
      ? 'Backend API server is not reachable on port 3000. Please make sure "npm run dev" is running.'
      : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, data?.error || fallbackMessage);
  }
  return data as T;
}

export async function fetchDemoMode(): Promise<boolean> {
  try {
    const config = await api<{ demoMode: boolean }>('/api/config');
    return !!config.demoMode;
  } catch {
    return false;
  }
}
