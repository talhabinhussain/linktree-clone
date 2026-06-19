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
  id: string;
  username: string;
  bio: string;
  avatar: string;
  theme: string; // primary color (hex)
  backgroundColor: string;
  isDarkMode: boolean;
  links: Link[];
  createdAt: string;
}
