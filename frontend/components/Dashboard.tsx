"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/lib/types";
import {
  getCurrentProfile,
  createDefaultProfile,
  saveProfile,
} from "@/lib/storage";
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
import { Share2, Copy, Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Load profile on mount
    let currentProfile = getCurrentProfile();
    if (!currentProfile) {
      currentProfile = createDefaultProfile();
      // Persist the created default profile so public share links work
      saveProfile(currentProfile);
    }
    setProfile(currentProfile);
  }, []);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const copyShareLink = async () => {
    if (!profile) return;

    // Create a compact snapshot of the profile so the link works across browsers
    let snapshotParam = "";
    try {
      snapshotParam = encodeURIComponent(
        window.btoa(unescape(encodeURIComponent(JSON.stringify(profile)))),
      );
    } catch (e) {
      // Fallback: omit snapshot if encoding fails
      console.warn("Failed to encode profile snapshot for share link", e);
      snapshotParam = "";
    }

    const shareLink = snapshotParam
      ? `${window.location.origin}/profile/${profile.id}?snapshot=${snapshotParam}`
      : `${window.location.origin}/profile/${profile.id}`;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareLink);
      } else {
        // Fallback for non-secure contexts or older browsers
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
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              {/* Theme Toggle */}
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

              {/* Share Button */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Edit Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <ProfileEditor
                  profile={profile}
                  onProfileUpdate={handleProfileUpdate}
                />
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <LinkManager
                  profile={profile}
                  onProfileUpdate={handleProfileUpdate}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Section */}
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
