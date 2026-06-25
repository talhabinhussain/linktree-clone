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

  const isImageAvatar = profile.avatar.startsWith('data:');

  return (
    <div style={containerStyle} className="min-h-screen transition-colors">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          {/* Avatar - Emoji or Image */}
          <div className="mb-4 flex justify-center">
            <div className="h-24 w-24 rounded-full border-4 border-white/20 bg-black/5 dark:bg-white/5 flex items-center justify-center overflow-hidden shadow-lg transition-all duration-300">
              <div key={profile.avatar} className="animate-fade-in-scale flex items-center justify-center w-full h-full">
                {isImageAvatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl select-none leading-none">{profile.avatar}</span>
                )}
              </div>
            </div>
          </div>
          <h1 style={{ color: textColor }} className="text-3xl font-bold mb-2">
            {profile.displayName}
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
