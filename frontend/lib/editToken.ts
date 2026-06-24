const EDIT_TOKEN_PREFIX = "edit_token_";
const CURRENT_USERNAME_KEY = "linktree_current_username";

function editTokenKey(username: string): string {
  return `${EDIT_TOKEN_PREFIX}${username}`;
}

export function saveEditToken(username: string, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(editTokenKey(username), token);
}

export function getEditToken(username: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(editTokenKey(username));
}

export function removeEditToken(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(editTokenKey(username));
}

export function getOwnedUsernames(): string[] {
  if (typeof window === "undefined") return [];
  const usernames: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(EDIT_TOKEN_PREFIX)) {
      usernames.push(key.slice(EDIT_TOKEN_PREFIX.length));
    }
  }
  return usernames;
}

export function setCurrentUsername(username: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CURRENT_USERNAME_KEY, username);
}

export function getCurrentUsername(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(CURRENT_USERNAME_KEY);
}

export function clearCurrentUsername(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CURRENT_USERNAME_KEY);
}

export function resolveActiveUsername(): string | null {
  return getCurrentUsername() ?? getOwnedUsernames()[0] ?? null;
}
