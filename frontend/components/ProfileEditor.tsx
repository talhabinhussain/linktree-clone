'use client';

import { Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { saveProfile } from '@/lib/storage';
import { THEME_COLORS, BACKGROUND_COLORS } from '@/lib/constants';

interface ProfileEditorProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
}

export default function ProfileEditor({ profile, onProfileUpdate }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    username: profile.username,
    bio: profile.bio,
    avatar: profile.avatar,
    theme: profile.theme,
    backgroundColor: profile.backgroundColor,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated: Profile = {
        ...profile,
        username: formData.username.trim() || 'My Profile',
        bio: formData.bio.trim(),
        avatar: formData.avatar,
        theme: formData.theme,
        backgroundColor: formData.backgroundColor,
      };

      saveProfile(updated);
      onProfileUpdate(updated);
    } finally {
      setIsSaving(false);
    }
  };

  const EMOJI_AVATARS = ['👤', '😊', '🎨', '🚀', '⭐', '💡', '🎯', '🌟', '🔥', '✨'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Customize your public profile appearance</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Avatar Section */}
        <div className='space-y-3'>
          <Label>Avatar</Label>
          <div className='flex items-center gap-3'>
            <div className='text-4xl'>{formData.avatar}</div>
            <div className='grid grid-cols-5 gap-2'>
              {EMOJI_AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setFormData({ ...formData, avatar: emoji })}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    formData.avatar === emoji ? 'ring-2 ring-offset-2' : 'hover:bg-muted'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Username */}
        <div className='space-y-2'>
          <Label htmlFor='username'>Username</Label>
          <Input
            id='username'
            placeholder='Your Name'
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>

        {/* Bio */}
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

        {/* Theme Color */}
        <div className='space-y-3'>
          <Label>Theme Color</Label>
          <div className='grid grid-cols-5 gap-2'>
            {THEME_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setFormData({ ...formData, theme: color.value })}
                className={`p-3 rounded-lg transition-all ${
                  formData.theme === color.value ? 'ring-2 ring-offset-2' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
          </div>
          <Select value={formData.theme} onValueChange={(value) => setFormData({ ...formData, theme: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='#3b82f6'>Blue</SelectItem>
              <SelectItem value='#ef4444'>Red</SelectItem>
              <SelectItem value='#10b981'>Green</SelectItem>
              <SelectItem value='#f59e0b'>Amber</SelectItem>
              <SelectItem value='#8b5cf6'>Purple</SelectItem>
              <SelectItem value='#ec4899'>Pink</SelectItem>
              <SelectItem value='#06b6d4'>Cyan</SelectItem>
              <SelectItem value='#6366f1'>Indigo</SelectItem>
              <SelectItem value='#14b8a6'>Teal</SelectItem>
              <SelectItem value='#000000'>Black</SelectItem>
            </SelectContent>
          </Select>
          <div className='p-3 rounded-lg' style={{ backgroundColor: formData.theme, color: 'white' }}>
            <p className='text-sm font-medium'>Preview: Links will use this color</p>
          </div>
        </div>

        {/* Background Color */}
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

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} className='w-full'>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
}
