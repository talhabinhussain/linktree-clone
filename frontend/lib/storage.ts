/**
 * localStorage helpers for Profile management
 */

import { Profile, Link } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'linktree_profiles';
const CURRENT_PROFILE_KEY = 'linktree_current_profile_id';

/**
 * Generate a unique profile ID
 */
export function generateProfileId(): string {
  return uuidv4();
}

/**
 * Generate a unique link ID
 */
export function generateLinkId(): string {
  return uuidv4();
}

/**
 * Get all profiles from localStorage
 */
export function getAllProfiles(): Profile[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading profiles from storage:', error);
    return [];
  }
}

/**
 * Get a single profile by ID
 */
export function getProfileById(id: string): Profile | null {
  const profiles = getAllProfiles();
  return profiles.find((p) => p.id === id) || null;
}

/**
 * Save a profile to localStorage
 */
export function saveProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    const profiles = getAllProfiles();
    const existingIndex = profiles.findIndex((p) => p.id === profile.id);

    if (existingIndex > -1) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    setCurrentProfileId(profile.id);
  } catch (error) {
    console.error('Error saving profile to storage:', error);
  }
}

/**
 * Delete a profile by ID
 */
export function deleteProfile(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const profiles = getAllProfiles();
    const filtered = profiles.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // Clear current profile if deleted
    if (getCurrentProfileId() === id) {
      clearCurrentProfileId();
    }
  } catch (error) {
    console.error('Error deleting profile from storage:', error);
  }
}

/**
 * Set the current profile ID
 */
export function setCurrentProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_PROFILE_KEY, id);
}

/**
 * Get the current profile ID
 */
export function getCurrentProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_PROFILE_KEY);
}

/**
 * Clear the current profile ID
 */
export function clearCurrentProfileId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_PROFILE_KEY);
}

/**
 * Get the current profile
 */
export function getCurrentProfile(): Profile | null {
  const id = getCurrentProfileId();
  if (!id) return null;
  return getProfileById(id);
}

/**
 * Create a new default profile
 */
export function createDefaultProfile(): Profile {
  const id = generateProfileId();
  return {
    id,
    username: 'My Profile',
    bio: 'Welcome to my link collection',
    avatar: '👤',
    theme: '#3b82f6', // blue
    backgroundColor: '#ffffff',
    isDarkMode: false,
    links: [],
    createdAt: new Date().toISOString(),
  };
}

/**
 * Add a link to a profile
 */
export function addLinkToProfile(profileId: string, link: Omit<Link, 'id' | 'order'>): Profile | null {
  const profile = getProfileById(profileId);
  if (!profile) return null;

  const newLink: Link = {
    ...link,
    id: generateLinkId(),
    order: profile.links.length,
  };

  profile.links.push(newLink);
  saveProfile(profile);
  return profile;
}

/**
 * Update a link in a profile
 */
export function updateLinkInProfile(profileId: string, linkId: string, updates: Partial<Link>): Profile | null {
  const profile = getProfileById(profileId);
  if (!profile) return null;

  const linkIndex = profile.links.findIndex((l) => l.id === linkId);
  if (linkIndex === -1) return null;

  profile.links[linkIndex] = {
    ...profile.links[linkIndex],
    ...updates,
  };

  saveProfile(profile);
  return profile;
}

/**
 * Delete a link from a profile
 */
export function deleteLinkFromProfile(profileId: string, linkId: string): Profile | null {
  const profile = getProfileById(profileId);
  if (!profile) return null;

  profile.links = profile.links.filter((l) => l.id !== linkId);

  // Reorder remaining links
  profile.links.forEach((link, index) => {
    link.order = index;
  });

  saveProfile(profile);
  return profile;
}

/**
 * Reorder links in a profile
 */
export function reorderLinksInProfile(profileId: string, links: Link[]): Profile | null {
  const profile = getProfileById(profileId);
  if (!profile) return null;

  profile.links = links.map((link, index) => ({
    ...link,
    order: index,
  }));

  saveProfile(profile);
  return profile;
}
