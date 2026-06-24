'use client';

import { useState } from 'react';
import { Link as LinkType, Profile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import LinkCard from './LinkCard';
import IconPreview from './IconPreview';
import { DeleteLinkDialog } from './DeleteLinkDialog';
import { ICON_OPTIONS } from '@/lib/constants';
import {
  addLink,
  deleteLink,
  getProfile,
  mapApiProfileToProfile,
  permissionErrorMessage,
  updateLink,
} from '@/lib/api';

interface LinkManagerProps {
  profile: Profile;
  editToken: string | null;
  onProfileUpdate: (profile: Profile) => void;
}

export default function LinkManager({ profile, editToken, onProfileUpdate }: LinkManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; linkId: string; linkTitle: string }>({
    open: false,
    linkId: '',
    linkTitle: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'link',
  });

  const refreshProfile = async () => {
    const refreshed = await getProfile(profile.username);
    onProfileUpdate(mapApiProfileToProfile(refreshed));
  };

  const openAddDialog = () => {
    setEditingLink(null);
    setFormData({ title: '', url: '', icon: 'link' });
    setError(null);
    setIsOpen(true);
  };

  const openEditDialog = (link: LinkType) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon,
    });
    setError(null);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!editToken) {
      setError("You don't have permission to edit this page.");
      return;
    }

    if (!formData.title.trim() || !formData.url.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://') && !formData.url.startsWith('mailto:')) {
      setError('Please enter a valid URL (starting with http://, https://, or mailto:)');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (editingLink) {
        await updateLink(
          editingLink.id,
          {
            label: formData.title,
            url: formData.url,
            icon: formData.icon,
            position: editingLink.order,
          },
          editToken,
        );
      } else {
        await addLink(
          profile.username,
          {
            label: formData.title,
            url: formData.url,
            icon: formData.icon,
            position: profile.links.length,
          },
          editToken,
        );
      }

      await refreshProfile();
      setIsOpen(false);
      setEditingLink(null);
    } catch (err) {
      setError(
        permissionErrorMessage(err) ??
          (err instanceof Error ? err.message : 'Failed to save link'),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (linkId: string) => {
    const link = profile.links.find((l) => l.id === linkId);
    if (link) {
      setDeleteDialog({
        open: true,
        linkId,
        linkTitle: link.title,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!editToken) {
      setError("You don't have permission to edit this page.");
      setDeleteDialog({ open: false, linkId: '', linkTitle: '' });
      return;
    }

    try {
      await deleteLink(deleteDialog.linkId, editToken);
      await refreshProfile();
    } catch (err) {
      setError(
        permissionErrorMessage(err) ??
          (err instanceof Error ? err.message : 'Failed to delete link'),
      );
    }

    setDeleteDialog({ open: false, linkId: '', linkTitle: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, linkId: '', linkTitle: '' });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Manage Links</CardTitle>
              <CardDescription>Add, edit, or remove links from your profile</CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} size='sm' disabled={!editToken}>
                <Plus className='w-4 h-4 mr-2' />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</DialogTitle>
                <DialogDescription>
                  {editingLink ? 'Update your link details' : 'Create a new link for your profile'}
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Link Title</Label>
                  <Input
                    id='title'
                    placeholder='e.g., My Website'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='url'>URL</Label>
                  <Input
                    id='url'
                    placeholder='https://example.com'
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='icon'>Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger id='icon'>
                      <div className='flex items-center gap-2'>
                        <IconPreview iconName={formData.icon} size={18} />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className='flex items-center gap-2'>
                            <IconPreview iconName={option.value} size={16} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <p className='text-sm text-destructive' role='alert'>
                    {error}
                  </p>
                )}

                <Button onClick={handleSave} className='w-full' disabled={isSaving || !editToken}>
                  {isSaving ? 'Saving...' : editingLink ? 'Update Link' : 'Add Link'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {error && !isOpen && (
          <p className='text-sm text-destructive mb-4' role='alert'>
            {error}
          </p>
        )}

        <DeleteLinkDialog
          open={deleteDialog.open}
          linkTitle={deleteDialog.linkTitle}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
        {profile.links.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-muted-foreground mb-4'>No links yet. Create your first link to get started!</p>
            <Button onClick={openAddDialog} variant='outline' disabled={!editToken}>
              Add Your First Link
            </Button>
          </div>
        ) : (
          <div className='space-y-3'>
            {profile.links
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  isEditable={Boolean(editToken)}
                  themeColor={profile.theme}
                  onEdit={() => openEditDialog(link)}
                  onDelete={() => handleDeleteClick(link.id)}
                />
              ))}
          </div>
        )}

        <div className='mt-4 pt-4 border-t'>
          <Badge variant='secondary'>{profile.links.length} link(s)</Badge>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
