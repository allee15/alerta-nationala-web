const AUTH_STORAGE_KEY = 'auth_tokens';
export const AUTH_SESSION_EXPIRED_EVENT = 'auth:session-expired';

const DEFAULT_API_BASE_URL = 'https://alerta-nationala-backend.vercel.app';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, '');

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface Credentials {
  email: string;
  password: string;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

let refreshInFlight: Promise<AuthTokens> | null = null;

function buildUrl(path: string): string {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const maybeMessage = (payload as { message?: unknown }).message;
  if (typeof maybeMessage === 'string' && maybeMessage.trim().length > 0) {
    return maybeMessage;
  }

  return null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeTokens(payload: unknown): AuthTokens | null {
  if (!isObject(payload)) {
    return null;
  }

  const accessCandidates = [
    payload.accessToken,
    payload.access_token,
    payload.token,
    isObject(payload.data) ? payload.data.accessToken : undefined,
    isObject(payload.tokens) ? payload.tokens.accessToken : undefined,
  ];

  const refreshCandidates = [
    payload.refreshToken,
    payload.refresh_token,
    payload.refresh,
    isObject(payload.data) ? payload.data.refreshToken : undefined,
    isObject(payload.tokens) ? payload.tokens.refreshToken : undefined,
  ];

  const accessToken = accessCandidates.find((value) => typeof value === 'string' && value.length > 0);
  const refreshToken = refreshCandidates.find((value) => typeof value === 'string' && value.length > 0);

  if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
    return null;
  }

  return { accessToken, refreshToken };
}

async function request(path: string, options: RequestInit): Promise<unknown> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    ...options,
    headers,
  });

  const rawBody = await response.text();
  const payload = rawBody ? parseJson(rawBody) : null;

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}.`;
    throw new ApiError(extractErrorMessage(payload) ?? fallbackMessage, response.status);
  }

  return payload;
}

function toApiError(payload: unknown, status: number): ApiError {
  const fallbackMessage = `Request failed with status ${status}.`;
  return new ApiError(extractErrorMessage(payload) ?? fallbackMessage, status);
}

function notifySessionExpired(): void {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}

function ensureTokens(payload: unknown): AuthTokens {
  const tokens = normalizeTokens(payload);
  if (!tokens) {
    throw new Error('Raspunsul API nu contine accessToken si refreshToken.');
  }

  return tokens;
}

export function getAuthTokens(): AuthTokens | null {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  const parsed = parseJson(rawValue);
  return normalizeTokens(parsed);
}

export function saveAuthTokens(tokens: AuthTokens): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearAuthTokens(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

async function refreshOnce(): Promise<AuthTokens> {
  if (!refreshInFlight) {
    refreshInFlight = refresh().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

export async function authRequest<TResponse = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<TResponse> {
  const callApi = async (accessToken: string | null) => {
    const headers = new Headers(options.headers);
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(buildUrl(path), {
      credentials: 'include',
      ...options,
      headers,
    });

    const rawBody = await response.text();
    const payload = rawBody ? parseJson(rawBody) : null;

    return { response, payload };
  };

  const initialTokens = getAuthTokens();
  const firstAttempt = await callApi(initialTokens?.accessToken ?? null);

  if (firstAttempt.response.ok) {
    return firstAttempt.payload as TResponse;
  }

  if (firstAttempt.response.status !== 401) {
    throw toApiError(firstAttempt.payload, firstAttempt.response.status);
  }

  try {
    await refreshOnce();
  } catch {
    clearAuthTokens();
    notifySessionExpired();
    throw new Error('Sesiunea a expirat. Te rugam sa te autentifici din nou.');
  }

  const refreshedTokens = getAuthTokens();
  const secondAttempt = await callApi(refreshedTokens?.accessToken ?? null);

  if (secondAttempt.response.ok) {
    return secondAttempt.payload as TResponse;
  }

  if (secondAttempt.response.status === 401) {
    clearAuthTokens();
    notifySessionExpired();
    throw new Error('Sesiunea a expirat. Te rugam sa te autentifici din nou.');
  }

  throw toApiError(secondAttempt.payload, secondAttempt.response.status);
}

export async function login(credentials: Credentials): Promise<AuthTokens> {
  const payload = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  const tokens = ensureTokens(payload);
  saveAuthTokens(tokens);
  return tokens;
}

export async function refresh(): Promise<AuthTokens> {
  const current = getAuthTokens();
  const payload = await request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: current?.refreshToken ?? '' }),
  });

  const tokens = ensureTokens(payload);
  saveAuthTokens(tokens);
  return tokens;
}

export async function logout(): Promise<void> {
  const current = getAuthTokens();

  try {
    await request('/auth/logout', {
      method: 'POST',
      headers: current?.accessToken
        ? {
            Authorization: `Bearer ${current.accessToken}`,
          }
        : undefined,
      body: JSON.stringify({ refreshToken: current?.refreshToken ?? '' }),
    });
  } catch (error) {
    // Unele backend-uri nu expun ruta /auth/logout. In acest caz inchidem sesiunea local.
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error;
    }
  } finally {
    clearAuthTokens();
  }
}
