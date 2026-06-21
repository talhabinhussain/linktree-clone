'use client';

import { useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { THEME_COLORS } from '@/lib/constants';
import { Upload, Palette, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: string;
  onSelect: (theme: string) => void;
}

export default function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const filteredColors = useMemo(() => {
    if (!searchValue.trim()) return THEME_COLORS;
    
    const query = searchValue.toLowerCase();
    return THEME_COLORS.filter((color) =>
      color.label.toLowerCase().includes(query)
    );
  }, [searchValue]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSelect(result);
        setOpen(false);
        setSearchValue('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeSelect = (theme: string) => {
    onSelect(theme);
    setOpen(false);
    setSearchValue('');
  };

  const handleColorPick = () => {
    colorInputRef.current?.click();
  };

  const handleColorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    onSelect(color);
    setOpen(false);
    setSearchValue('');
  };

  const getThemeLabel = (value: string) => {
    const theme = THEME_COLORS.find((t) => t.value === value);
    return theme?.label || 'Custom';
  };

  const isCustomTheme = !THEME_COLORS.find((t) => t.value === currentTheme);

  return (
    <>
      {/* Preview Section */}
      <div className='space-y-3'>
        <div className='flex items-center gap-4'>
          <div
            className='h-14 w-14 rounded-lg border-2 border-border shadow-sm'
            style={{ backgroundColor: currentTheme.startsWith('data:') ? '#999' : currentTheme }}
            title={getThemeLabel(currentTheme)}
          />
          <div className='flex-1'>
            <p className='text-sm font-semibold'>{getThemeLabel(currentTheme)}</p>
            {isCustomTheme && (
              <p className='text-xs text-muted-foreground'>Custom color</p>
            )}
          </div>
          <Button variant='outline' onClick={() => setOpen(true)} size='lg'>
            <Palette className='mr-2 h-4 w-4' />
            Change
          </Button>
        </div>

        {/* Preview */}
        <div
          className='rounded-lg p-4 text-white shadow-sm'
          style={{
            backgroundColor: currentTheme.startsWith('data:') ? '#999' : currentTheme,
          }}
        >
          <p className='text-sm font-medium'>Preview: Your links will use this theme</p>
        </div>
      </div>

      {/* Theme Selector Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Select Theme Color</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Search Bar */}
            <div className='sticky top-0 z-10'>
              <Input
                placeholder='Search colors by name...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='h-10'
              />
            </div>

            {/* Preset Colors Grid */}
            <div className='space-y-3'>
              <h3 className='text-sm font-semibold'>Preset Colors</h3>
              {filteredColors.length > 0 ? (
                <div className='grid grid-cols-3 gap-3 max-h-80 overflow-y-auto py-2'>
                  {filteredColors.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => handleThemeSelect(theme.value)}
                      className={`
                        relative flex items-center justify-between p-3 rounded-lg
                        border-2 transition-all duration-200 ease-out
                        hover:shadow-md hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${
                          currentTheme === theme.value
                            ? 'border-primary ring-2 ring-primary ring-offset-2 shadow-md'
                            : 'border-transparent hover:border-gray-200'
                        }
                      `}
                      style={{ backgroundColor: theme.value + '15' }}
                    >
                      <div className='flex items-center gap-2'>
                        <div
                          className='h-6 w-6 rounded border-2 border-gray-300'
                          style={{ backgroundColor: theme.value }}
                        />
                        <span className='text-sm font-medium'>{theme.label}</span>
                      </div>
                      {currentTheme === theme.value && (
                        <Check className='h-4 w-4 text-primary' />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8 text-muted-foreground'>
                  No colors found matching "{searchValue}"
                </div>
              )}
            </div>

            {/* Custom Options */}
            <div className='border-t pt-4 space-y-3'>
              <h3 className='text-sm font-semibold'>Custom Theme</h3>
              
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={handleColorPick}
              >
                <Palette className='mr-2 h-4 w-4' />
                Pick Custom Color
              </Button>

              <div className='text-sm text-muted-foreground text-center py-2'>or</div>

              <Button
                variant='outline'
                className='w-full'
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className='mr-2 h-4 w-4' />
                Upload Theme Image
              </Button>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                className='hidden'
              />
              <input
                ref={colorInputRef}
                type='color'
                value={currentTheme.startsWith('data:') ? '#3b82f6' : currentTheme}
                onChange={handleColorInputChange}
                className='hidden'
              />
              
              <p className='text-xs text-muted-foreground text-center'>
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
