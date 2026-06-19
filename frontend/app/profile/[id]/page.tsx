"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/lib/types";
import { getProfileById } from "@/lib/storage";
import PublicProfile from "@/components/PublicProfile";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    // Reset state when id changes so previous "not found" doesn't persist
    setIsLoading(true);
    setIsNotFound(false);
    setProfile(null);

    const loadSnapshot = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const snapshotParam = params.get("snapshot");
        if (!snapshotParam) return null;

        const decoded = decodeURIComponent(escape(window.atob(snapshotParam)));
        return JSON.parse(decoded) as Profile;
      } catch (e) {
        console.error("Failed to decode snapshot:", e);
        return null;
      }
    };

    if (id) {
      const foundProfile = getProfileById(id);
      if (foundProfile) {
        setProfile(foundProfile);
        setIsNotFound(false);
      } else {
        const snapshotProfile = loadSnapshot();
        if (snapshotProfile) {
          setProfile(snapshotProfile);
          setIsNotFound(false);
        } else {
          setIsNotFound(true);
        }
      }
    } else {
      setIsNotFound(true);
    }

    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (isNotFound || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-3xl font-bold">Profile Not Found</h1>
        <p className="text-muted-foreground">
          This profile doesn&apos;t exist or has been deleted.
        </p>
        <a href="/" className="text-blue-500 hover:underline">
          Create your own profile
        </a>
      </div>
    );
  }

  return <PublicProfile profile={profile} />;
}
