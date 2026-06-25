"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Copy,
  Check,
  KeyRound,
  Globe,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLogout: () => void;
  recoveryLink: string;
  shareLink: string;
}

export function LogoutDialog({
  open,
  onOpenChange,
  onConfirmLogout,
  recoveryLink,
  shareLink,
}: LogoutDialogProps) {
  const [recoveryCopied, setRecoveryCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showRecoveryLink, setShowRecoveryLink] = useState(false);

  const handleCopy = async (text: string, type: "recovery" | "share") => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      if (type === "recovery") {
        setRecoveryCopied(true);
        setTimeout(() => setRecoveryCopied(false), 2000);
      } else {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] border-border bg-card shadow-2xl p-6 rounded-xl animate-in fade-in-50 zoom-in-95 duration-200">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-center tracking-tight">
            Before you Log Out
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm leading-relaxed">
            Logging out clears your session. Please copy your links, especially
            your{" "}
            <strong className="text-foreground">Secret Recovery Link</strong>.
            Without it, you will permanently lose edit access to this profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-3">
          {/* Recovery Link Section */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 transition-all duration-200 hover:bg-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <KeyRound className="h-3.5 w-3.5" />
                Secret Recovery Link (To Edit)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                  onClick={() => setShowRecoveryLink(!showRecoveryLink)}
                  title={showRecoveryLink ? "Hide recovery link" : "Show recovery link"}
                >
                  {showRecoveryLink ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2.5 text-xs font-medium hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 transition-colors"
                  onClick={() => handleCopy(recoveryLink, "recovery")}
                >
                  {recoveryCopied ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
            <code className="text-xs px-2 py-1.5 rounded bg-amber-500/10 border border-amber-500/10 font-mono select-all break-all block text-left text-muted-foreground max-h-16 overflow-y-auto">
              {showRecoveryLink ? recoveryLink : recoveryLink.replace(/token=[^&]*/, "token=••••••••••••••••••••••••")}
            </code>
          </div>

          {/* Share Link Section */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all duration-200 hover:bg-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Globe className="h-3.5 w-3.5" />
                Public Profile Link (To Share)
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2.5 text-xs font-medium hover:bg-primary/20 text-primary transition-colors"
                onClick={() => handleCopy(shareLink, "share")}
              >
                {shareCopied ? (
                  <>
                    <Check className="h-3 w-3 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <code className="text-xs px-2 py-1.5 rounded bg-primary/10 border border-primary/10 font-mono select-all break-all block text-left text-muted-foreground max-h-16 overflow-y-auto">
              {shareLink}
            </code>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmLogout}
            className="w-full sm:w-auto font-medium flex items-center justify-center gap-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-amber-50  "
          >
            <LogOut className="h-4 w-4  " />
            Yes, Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
