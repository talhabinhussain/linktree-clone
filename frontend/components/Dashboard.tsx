"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/lib/types";
import {
  ApiError,
  getProfile,
  mapApiProfileToProfile,
  permissionErrorMessage,
} from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
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
import { Share2, Copy, Check, KeyRound, LogOut, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { LogoutDialog } from "./LogoutDialog";

export default function Dashboard() {
  const { user, editToken, isAuthenticated, isLoading: authLoading, registerAnonymous, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);
  const [recoveryCopied, setRecoveryCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [showRecoveryLink, setShowRecoveryLink] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (authLoading) return;

      // If not authenticated, auto-register a new anonymous profile first
      if (!isAuthenticated) {
        // Double check: if there is a token in localStorage, we shouldn't auto-register.
        // It means we have credentials but checkSession is still loading or failed.
        const hasToken = typeof window !== "undefined" && !!localStorage.getItem("edit_token");
        if (hasToken) {
          return;
        }

        try {
          const result = await registerAnonymous();
          // After registration the AuthProvider sets isAuthenticated=true
          // and the effect will re-run with the new user.  We can also
          // eagerly load the profile right here using the returned username.
          if (!cancelled) {
            const data = await getProfile(result.username);
            setProfile(mapApiProfileToProfile(data));
            setIsLoading(false);
          }
        } catch (error) {
          if (!cancelled) {
            setLoadError(
              error instanceof Error
                ? error.message
                : "Failed to automatically create user profile.",
            );
            setIsLoading(false);
          }
        }
        return;
      }

      if (!user) return;

      setIsLoading(true);
      setLoadError(null);

      try {
        const data = await getProfile(user.username);
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
    // registerAnonymous is stable (useCallback with []) so it won't re-fire
  }, [authLoading, isAuthenticated, user, registerAnonymous]);

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

  const copyRecoveryLink = async () => {
    if (!editToken) return;

    const recoveryLink = `${window.location.origin}/login?token=${editToken}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(recoveryLink);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = recoveryLink;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setRecoveryCopied(true);
      setTimeout(() => {
        setRecoveryCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy recovery link:", error);
    }
  };

  if (authLoading || isLoading) {
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
        {/* Recovery Link Notification */}
        {editToken ? (
          <Card className="mb-8 border-primary/20 bg-primary/5 shadow-sm overflow-hidden transition-all duration-300">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <KeyRound className="h-4 w-4" />
                  <span>Your Secret Recovery Link</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Anyone with this link can manage your profile. <strong>Keep it safe!</strong> If you clear your browser cookies/cache or lose this link, you will lose edit access to your page forever.
                </p>
                <div className="pt-1 flex items-center gap-2 max-w-full">
                  <code className="text-xs px-2 py-1.5 rounded bg-muted border font-mono select-all break-all flex-1 block text-left">
                    {showRecoveryLink
                      ? `${typeof window !== "undefined" ? window.location.origin : ""}/login?token=${editToken}`
                      : `${typeof window !== "undefined" ? window.location.origin : ""}/login?token=••••••••••••••••••••••••`}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={() => setShowRecoveryLink(!showRecoveryLink)}
                    title={showRecoveryLink ? "Hide recovery link" : "Show recovery link"}
                  >
                    {showRecoveryLink ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyRecoveryLink}
                  className="h-9 font-medium"
                >
                  {recoveryCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      Copy Link
                    </>
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsLogoutDialogOpen(true)}
                  className="h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
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

      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirmLogout={() => {
          setIsLogoutDialogOpen(false);
          logout();
        }}
        recoveryLink={`${typeof window !== "undefined" ? window.location.origin : ""}/login?token=${editToken}`}
        shareLink={`${typeof window !== "undefined" ? window.location.origin : ""}/profile/${profile.username}`}
      />
    </div>
  );
}
