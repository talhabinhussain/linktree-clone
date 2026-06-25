"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  
  const [tokenInput, setTokenInput] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle auto-login if token is in query parameters
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      handleAutoLogin(token);
    }
  }, [searchParams]);

  // If already authenticated and not verifying, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && status !== "verifying" && status !== "success") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, status, router]);

  const handleAutoLogin = async (token: string) => {
    setStatus("verifying");
    const success = await login(token);
    if (success) {
      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setStatus("error");
      setErrorMessage("The recovery token in the URL is invalid or has expired.");
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedToken = tokenInput.trim();
    if (!trimmedToken) {
      setErrorMessage("Please enter a token.");
      setStatus("error");
      return;
    }

    setStatus("verifying");
    setErrorMessage("");

    const success = await login(trimmedToken);
    if (success) {
      setStatus("success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else {
      setStatus("error");
      setErrorMessage("Invalid recovery token. Please check the UUID and try again.");
    }
  };

  if (status === "verifying" || status === "success") {
    return (
      <Card className="w-full max-w-md border-border/40 shadow-2xl backdrop-blur-md bg-card/90">
        <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center space-y-4">
          {status === "verifying" ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <h2 className="text-xl font-semibold tracking-tight">Verifying Session</h2>
              <p className="text-sm text-muted-foreground">Checking recovery token against NeonDB...</p>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-emerald-500">Session Verified!</h2>
              <p className="text-sm text-muted-foreground">Redirecting you to your dashboard...</p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border/40 shadow-2xl backdrop-blur-md bg-card/90 transition-all duration-300 hover:shadow-primary/5">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center flex items-center justify-center gap-2">
          <KeyRound className="h-6 w-6 text-primary" />
          Recovery Login
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Enter your secret UUID edit token to log back in to your profile
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleManualLogin}>
        <CardContent className="space-y-4 pt-4">
          {status === "error" && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2 animate-shake">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm font-medium">Secret Edit Token (UUID)</Label>
            <Input
              id="token"
              placeholder="e.g., 12345678-abcd-1234-abcd-1234567890ab"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="font-mono text-xs h-10 border-input/60 focus-visible:ring-primary/45"
              autoFocus
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 pt-6 pb-6">
          <Button type="submit" className="w-full h-10 flex items-center justify-center gap-2 group">
            Restore Session
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/")}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel & Return Home
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 px-4 relative overflow-hidden">
      {/* Decorative gradient blur blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <Suspense
        fallback={
          <Card className="w-full max-w-md border-border/40 shadow-2xl backdrop-blur-md bg-card/90">
            <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <h2 className="text-xl font-semibold tracking-tight">Loading</h2>
            </CardContent>
          </Card>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
