/**
 * Data models for Linktree Clone
 */

export interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  color?: string;
  order: number;
}

export interface Profile {
  id: number;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: string;
  backgroundColor: string;
  links: Link[];
}
