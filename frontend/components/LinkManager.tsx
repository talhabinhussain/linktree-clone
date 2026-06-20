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
import { generateLinkId, updateLinkInProfile, addLinkToProfile, deleteLinkFromProfile } from '@/lib/storage';

interface LinkManagerProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
}

export default function LinkManager({ profile, onProfileUpdate }: LinkManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
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

  const openAddDialog = () => {
    setEditingLink(null);
    setFormData({ title: '', url: '', icon: 'link' });
    setIsOpen(true);
  };

  const openEditDialog = (link: LinkType) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      icon: link.icon,
    });
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://') && !formData.url.startsWith('mailto:')) {
      alert('Please enter a valid URL (starting with http://, https://, or mailto:)');
      return;
    }

    let updated: Profile | null = null;

    if (editingLink) {
      updated = updateLinkInProfile(profile.id, editingLink.id, {
        title: formData.title,
        url: formData.url,
        icon: formData.icon,
      });
    } else {
      updated = addLinkToProfile(profile.id, {
        title: formData.title,
        url: formData.url,
        icon: formData.icon,
      });
    }

    if (updated) {
      onProfileUpdate(updated);
      setIsOpen(false);
      setEditingLink(null);
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

  const handleDeleteConfirm = () => {
    const updated = deleteLinkFromProfile(profile.id, deleteDialog.linkId);
    if (updated) {
      onProfileUpdate(updated);
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
              <Button onClick={openAddDialog} size='sm'>
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

                <Button onClick={handleSave} className='w-full'>
                  {editingLink ? 'Update Link' : 'Add Link'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <DeleteLinkDialog
          open={deleteDialog.open}
          linkTitle={deleteDialog.linkTitle}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
        {profile.links.length === 0 ? (
          <div className='text-center py-8'>
            <p className='text-muted-foreground mb-4'>No links yet. Create your first link to get started!</p>
            <Button onClick={openAddDialog} variant='outline'>
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
                  isEditable={true}
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
