"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/lib/types";
import {
  ApiError,
  createProfile,
  generateUsername,
  getProfile,
  mapApiProfileToProfile,
  permissionErrorMessage,
} from "@/lib/api";
import {
  getEditToken,
  resolveActiveUsername,
  saveEditToken,
  setCurrentUsername,
} from "@/lib/editToken";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileEditor from "./ProfileEditor";
import LinkManager from "./LinkManager";
import ProfilePreview from "./ProfilePreview";
import { DashboardSkeleton } from "./ProfileSkeleton";
import { Share2, Copy, Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

const DEFAULT_PROFILE = {
  display_name: "My Profile",
  bio: "Welcome to my link collection",
  avatar: "👤",
  theme_color: "#3b82f6",
  background_color: "#ffffff",
};

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const activeUsername = resolveActiveUsername();

        if (activeUsername) {
          const data = await getProfile(activeUsername);
          if (!cancelled) {
            setCurrentUsername(activeUsername);
            setProfile(mapApiProfileToProfile(data));
          }
          return;
        }

        const username = generateUsername();
        const created = await createProfile({ username, ...DEFAULT_PROFILE });
        saveEditToken(username, created.edit_token!);
        setCurrentUsername(username);

        const data = await getProfile(username);
        if (!cancelled) {
          setProfile(mapApiProfileToProfile(data));
        }
      } catch (error) {
        if (!cancelled) {
          const permissionError = permissionErrorMessage(error);
          if (permissionError) {
            setLoadError(permissionError);
          } else if (error instanceof ApiError && error.status === 404) {
            setLoadError("Your saved profile could not be found. Refresh to create a new one.");
          } else {
            setLoadError(
              error instanceof Error
                ? error.message
                : "Failed to load profile. Is the backend running?",
            );
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const copyShareLink = async () => {
    if (!profile) return;

    const shareLink = `${window.location.origin}/profile/${profile.username}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (loadError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Unable to load dashboard</h1>
        <p className="text-muted-foreground max-w-md">
          {loadError ?? "Something went wrong while loading your profile."}
        </p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  const editToken = getEditToken(profile.username);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">LinkTree Clone</h1>
              <p className="text-muted-foreground">
                Manage your personal link-in-bio
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              <Button onClick={copyShareLink}>
                <Share2 className="w-4 h-4 mr-2" />
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  "Share Profile"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!editToken && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            You don&apos;t have permission to edit this page. View-only mode —
            changes cannot be saved.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <ProfileEditor
                  profile={profile}
                  editToken={editToken}
                  onProfileUpdate={handleProfileUpdate}
                />
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <LinkManager
                  profile={profile}
                  editToken={editToken}
                  onProfileUpdate={handleProfileUpdate}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your profile looks to others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfilePreview profile={profile} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
