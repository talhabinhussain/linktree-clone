'use client';

import { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatar: string) => void;
}

const EMOJI_AVATARS = [
  { emoji: '👤', label: 'user', category: 'people' },
  { emoji: '😊', label: 'smile', category: 'people' },
  { emoji: '😎', label: 'cool', category: 'people' },
  { emoji: '🥸', label: 'disguise', category: 'people' },
  { emoji: '👨', label: 'man', category: 'people' },
  { emoji: '👩', label: 'woman', category: 'people' },
  { emoji: '👨‍💼', label: 'businessman', category: 'people' },
  { emoji: '👩‍💼', label: 'businesswoman', category: 'people' },
  { emoji: '👨‍🎓', label: 'student man', category: 'people' },
  { emoji: '👩‍🎓', label: 'student woman', category: 'people' },
  { emoji: '🧑‍💻', label: 'developer', category: 'people' },
  { emoji: '👨‍🎨', label: 'artist man', category: 'people' },
  { emoji: '🎨', label: 'art', category: 'objects' },
  { emoji: '🚀', label: 'rocket', category: 'objects' },
  { emoji: '⭐', label: 'star', category: 'objects' },
  { emoji: '💡', label: 'idea', category: 'objects' },
  { emoji: '🎯', label: 'target', category: 'objects' },
  { emoji: '🌟', label: 'sparkle', category: 'objects' },
  { emoji: '🔥', label: 'fire', category: 'objects' },
  { emoji: '✨', label: 'sparkles', category: 'objects' },
  { emoji: '🎭', label: 'theater', category: 'objects' },
  { emoji: '🎪', label: 'circus', category: 'objects' },
  { emoji: '🎸', label: 'guitar', category: 'objects' },
  { emoji: '🎬', label: 'movie', category: 'objects' },
  { emoji: '🎤', label: 'microphone', category: 'objects' },
  { emoji: '🎮', label: 'gamepad', category: 'objects' },
  { emoji: '🎲', label: 'dice', category: 'objects' },
  { emoji: '🏆', label: 'trophy', category: 'objects' },
  { emoji: '⚡', label: 'lightning', category: 'objects' },
  { emoji: '🌈', label: 'rainbow', category: 'nature' },
  { emoji: '🌸', label: 'flower', category: 'nature' },
  { emoji: '🌺', label: 'hibiscus', category: 'nature' },
  { emoji: '🌻', label: 'sunflower', category: 'nature' },
  { emoji: '🌷', label: 'tulip', category: 'nature' },
  { emoji: '🌹', label: 'rose', category: 'nature' },
  { emoji: '💐', label: 'bouquet', category: 'nature' },
  { emoji: '🌼', label: 'daisy', category: 'nature' },
  { emoji: '🍀', label: 'clover', category: 'nature' },
  { emoji: '🌿', label: 'herb', category: 'nature' },
  { emoji: '🎁', label: 'gift', category: 'objects' },
  { emoji: '💎', label: 'diamond', category: 'objects' },
  { emoji: '🔮', label: 'crystal ball', category: 'objects' },
  { emoji: '📱', label: 'phone', category: 'objects' },
  { emoji: '💻', label: 'laptop', category: 'objects' },
];

export default function AvatarSelector({ currentAvatar, onSelect }: AvatarSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', 'people', 'objects', 'nature'];

  const filteredEmojis = useMemo(() => {
    let result = EMOJI_AVATARS;

    // Filter by category
    if (activeTab !== 'all') {
      result = result.filter((item) => item.category === activeTab);
    }

    // Filter by search
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      result = result.filter(
        (item) =>
          item.emoji.includes(query) ||
          item.label.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchValue, activeTab]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelect(result);
        setOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
    setSearchValue('');
  };

  const isEmoji = (avatar: string) => {
    // Check if avatar is a base64 image or emoji
    return !avatar.startsWith('data:');
  };

  return (
    <>
      <div className='flex items-center gap-4'>
        {/* Avatar Preview */}
        <div className='relative flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-border bg-muted flex items-center justify-center overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:border-muted-foreground/30'>
          <div key={currentAvatar} className='animate-fade-in-scale flex items-center justify-center w-full h-full'>
            {isEmoji(currentAvatar) ? (
              <span className='text-5xl select-none leading-none'>{currentAvatar}</span>
            ) : (
              <img
                src={currentAvatar}
                alt='Avatar'
                className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
              />
            )}
          </div>
        </div>
        <Button variant='outline' onClick={() => setOpen(true)} size='lg'>
          Change Avatar
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-2xl sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Select Your Avatar</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Search Bar */}
            <div className='sticky top-0 z-10'>
              <Input
                placeholder='Search emojis by name...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='h-10 font-sans'
              />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='all'>All</TabsTrigger>
                <TabsTrigger value='people'>People</TabsTrigger>
                <TabsTrigger value='objects'>Objects</TabsTrigger>
                <TabsTrigger value='nature'>Nature</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className='space-y-4'>
                {/* Emoji Grid */}
                {filteredEmojis.length > 0 ? (
                  <div key={activeTab} className='grid grid-cols-6 gap-2 max-h-80 overflow-y-auto py-2 animate-fade-in-up'>
                    {filteredEmojis.map((item) => (
                      <button
                        key={item.emoji}
                        onClick={() => handleEmojiClick(item.emoji)}
                        className={`
                          flex items-center justify-center p-2 rounded-xl text-4xl
                          transition-all duration-300 ease-out
                          hover:bg-blue-50 hover:scale-115 active:scale-95
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${currentAvatar === item.emoji ? 'bg-blue-100/70 ring-2 ring-blue-500 scale-110 shadow-sm shadow-blue-500/10' : 'bg-muted hover:bg-accent'}
                        `}
                        title={item.label}
                      >
                        {item.emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8 text-muted-foreground'>
                    No emojis found matching "{searchValue}"
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Upload Section */}
            <div className='border-t pt-4 space-y-3'>
              <div className='text-sm font-semibold'>Or upload a custom image</div>
              
              {/* Current Uploaded Image Preview */}
              {!isEmoji(currentAvatar) && (
                <div className='space-y-2'>
                  <div className='bg-muted p-3 rounded-lg'>
                    <img
                      src={currentAvatar}
                      alt='Current avatar'
                      className='h-20 w-20 rounded-lg object-cover mx-auto shadow-sm'
                    />
                  </div>
                  <p className='text-xs text-muted-foreground text-center'>Current uploaded image</p>
                </div>
              )}
              
              <Button
                variant='outline'
                className='w-full'
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className='mr-2 h-4 w-4' />
                {!isEmoji(currentAvatar) ? 'Change Image' : 'Choose Image'}
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
              />
              <p className='text-xs text-muted-foreground'>
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
