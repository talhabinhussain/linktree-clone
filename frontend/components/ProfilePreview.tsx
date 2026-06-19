"use client";

import { Profile } from "@/lib/types";
import LinkCard from "./LinkCard";
import { Separator } from "@/components/ui/separator";

interface PublicProfileProps {
  profile: Profile;
}

export default function PublicProfile({ profile }: PublicProfileProps) {
  const containerStyle = {
    backgroundColor: profile.backgroundColor,
  };

  const textColor =
    profile.backgroundColor === "#ffffff" ||
    profile.backgroundColor === "#f3f4f6"
      ? "#000"
      : "#fff";

  return (
    <div style={containerStyle} className="min-h-screen transition-colors">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{profile.avatar}</div>
          <h1 style={{ color: textColor }} className="text-3xl font-bold mb-2">
            {profile.username}
          </h1>
          {profile.bio && (
            <p style={{ color: textColor }} className="text-base opacity-75">
              {profile.bio}
            </p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Links Section */}
        {profile.links.length > 0 ? (
          <div className="space-y-3">
            {profile.links
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  isEditable={false}
                  themeColor={profile.theme}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p style={{ color: textColor }} className="opacity-50">
              No links yet
            </p>
          </div>
        )}

        {/* Footer */}
        <Separator className="my-6" />
        <div
          className="text-center text-xs opacity-50"
          style={{ color: textColor }}
        >
          <p>Created with LinkTree Clone</p>
        </div>
      </div>
    </div>
  );
}
