import { Link, Profile } from './types';

const isBrowser = typeof window !== 'undefined';
const API_URL = isBrowser 
  ? '/backend' 
  : (process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000');

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ApiLink {
  id: number;
  label: string;
  url: string;
  icon: string | null;
  position: number;
  profile_id: number;
}

export interface ApiProfile {
  id: number;
  username: string;
  display_name: string;
  bio: string | null;
  avatar: string | null;
  theme_color: string;
  background_color: string;
  edit_token?: string;
  links?: ApiLink[];
}

export interface CreateProfileData {
  username: string;
  display_name?: string;
  bio?: string | null;
  avatar?: string | null;
  theme_color?: string;
  background_color?: string;
}

export interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  avatar?: string | null;
  theme_color?: string;
  background_color?: string;
}

export interface LinkData {
  label: string;
  url: string;
  icon?: string | null;
  position?: number;
}

function mapApiLink(link: ApiLink): Link {
  return {
    id: String(link.id),
    title: link.label,
    url: link.url,
    icon: link.icon ?? 'link',
    order: link.position,
  };
}

export function mapApiProfileToProfile(apiProfile: ApiProfile): Profile {
  const links = (apiProfile.links ?? []).map(mapApiLink).sort((a, b) => a.order - b.order);

  return {
    id: apiProfile.id,
    username: apiProfile.username,
    displayName: apiProfile.display_name,
    bio: apiProfile.bio ?? '',
    avatar: apiProfile.avatar ?? '👤',
    theme: apiProfile.theme_color,
    backgroundColor: apiProfile.background_color,
    links,
  };
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.detail === 'string') return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join(', ');
    }
  } catch {
    // ignore JSON parse errors
  }
  return response.statusText || 'Request failed';
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  editToken?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (editToken) {
    headers.set('X-Edit-Token', editToken);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function verifySession(token: string): Promise<{ username: string }> {
  return request<{ username: string }>(`/api/auth/verify?token=${encodeURIComponent(token)}`);
}

export async function createProfile(data: CreateProfileData): Promise<ApiProfile> {
  return request<ApiProfile>('/profile/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProfile(username: string): Promise<ApiProfile> {
  return request<ApiProfile>(`/profile/${encodeURIComponent(username)}`);
}

export async function updateProfile(
  username: string,
  data: UpdateProfileData,
  editToken: string,
): Promise<ApiProfile> {
  return request<ApiProfile>(
    `/profile/${encodeURIComponent(username)}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    editToken,
  );
}

export async function addLink(
  username: string,
  data: LinkData,
  editToken: string,
): Promise<ApiLink> {
  return request<ApiLink>(
    `/links/${encodeURIComponent(username)}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    editToken,
  );
}

export async function updateLink(
  linkId: string | number,
  data: LinkData,
  editToken: string,
): Promise<ApiLink> {
  return request<ApiLink>(
    `/links/${encodeURIComponent(String(linkId))}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    editToken,
  );
}

export async function deleteLink(
  linkId: string | number,
  editToken: string,
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>(
    `/links/${encodeURIComponent(String(linkId))}`,
    { method: 'DELETE' },
    editToken,
  );
}

export function generateUsername(): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `user-${suffix}`;
}

export function permissionErrorMessage(error: unknown): string | null {
  if (error instanceof ApiError && error.status === 403) {
    return "You don't have permission to edit this page.";
  }
  return null;
}
