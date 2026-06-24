'use client';

import { Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { BACKGROUND_COLORS } from '@/lib/constants';
import AvatarSelector from '@/components/AvatarSelector';
import ThemeSelector from '@/components/ThemeSelector';
import {
  getProfile,
  mapApiProfileToProfile,
  permissionErrorMessage,
  updateProfile,
} from '@/lib/api';

interface ProfileEditorProps {
  profile: Profile;
  editToken: string | null;
  onProfileUpdate: (profile: Profile) => void;
}

export default function ProfileEditor({ profile, editToken, onProfileUpdate }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    bio: profile.bio,
    avatar: profile.avatar,
    theme: profile.theme,
    backgroundColor: profile.backgroundColor,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!editToken) {
      setError("You don't have permission to edit this page.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await updateProfile(
        profile.username,
        {
          display_name: formData.displayName.trim() || 'My Profile',
          bio: formData.bio.trim(),
          avatar: formData.avatar,
          theme_color: formData.theme,
          background_color: formData.backgroundColor,
        },
        editToken,
      );

      const refreshed = await getProfile(profile.username);
      onProfileUpdate(mapApiProfileToProfile(refreshed));
    } catch (err) {
      setError(
        permissionErrorMessage(err) ??
          (err instanceof Error ? err.message : 'Failed to save profile'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Customize your public profile appearance</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='profile-url'>Profile URL</Label>
          <Input
            id='profile-url'
            value={`/profile/${profile.username}`}
            readOnly
            disabled
            className='text-muted-foreground'
          />
        </div>

        <div className='space-y-3'>
          <Label>Avatar</Label>
          <AvatarSelector
            currentAvatar={formData.avatar}
            onSelect={(avatar) => setFormData({ ...formData, avatar })}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='displayName'>Display Name</Label>
          <Input
            id='displayName'
            placeholder='Your Name'
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='bio'>Bio</Label>
          <Textarea
            id='bio'
            placeholder='Tell your visitors a bit about yourself...'
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
          />
        </div>

        <div className='space-y-3'>
          <Label>Theme Color</Label>
          <ThemeSelector
            currentTheme={formData.theme}
            onSelect={(theme) => setFormData({ ...formData, theme })}
          />
        </div>

        <div className='space-y-3'>
          <Label>Background Color</Label>
          <div className='grid grid-cols-2 gap-2'>
            {BACKGROUND_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setFormData({ ...formData, backgroundColor: color.value })}
                className={`p-3 rounded-lg transition-all border-2 ${
                  formData.backgroundColor === color.value ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: color.value,
                  borderColor: formData.backgroundColor === color.value ? '#000' : '#ccc',
                  color: color.value === '#ffffff' || color.value === '#f3f4f6' ? '#000' : '#fff',
                }}
                title={color.label}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className='text-sm text-destructive' role='alert'>
            {error}
          </p>
        )}

        <Button onClick={handleSave} disabled={isSaving || !editToken} className='w-full'>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
