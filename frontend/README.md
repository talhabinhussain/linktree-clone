# LinkTree Clone - Personal Link-in-Bio Application

A modern, fully-functional Linktree clone built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui components. Create beautiful personal profile pages to share your curated links.

## Features

✨ **Profile Management**
- Customize your profile with avatar selection (10+ emoji options)
- Add a personal username and bio
- Choose from 10 vibrant theme colors for links
- Select background color (white, light gray, dark gray, almost black)
- Dark/light mode toggle support

🔗 **Link Management**
- Add, edit, delete, and reorder links
- 20+ icon options for visual variety (GitHub, Twitter, LinkedIn, Instagram, YouTube, etc.)
- URL validation (HTTP/HTTPS/mailto support)
- Drag-and-drop ready architecture (prepared for future enhancements)

🌐 **Public Profile Sharing**
- Generate shareable profile URLs (`/profile/[id]`)
- One-click copy-to-clipboard for profile links
- Beautiful read-only profile display
- Responsive design for all devices

📱 **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes
- Single-column layout on mobile, grid layout on desktop
- Sticky preview card on desktop

🎨 **Modern UI/UX**
- Built with shadcn/ui components
- Clean, intuitive interface
- Real-time profile preview
- Smooth transitions and interactions

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: React hooks with localStorage persistence
- **Icons**: Lucide React
- **Storage**: Browser localStorage (client-side, no backend required)

## Getting Started

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000` and start creating your profile!

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Dashboard home page
│   ├── layout.tsx               # Root layout with theme provider
│   ├── globals.css              # Global styles and CSS variables
│   └── profile/
│       └── [id]/
│           └── page.tsx         # Public profile page
│
├── components/
│   ├── Dashboard.tsx            # Main dashboard component
│   ├── ProfileEditor.tsx        # Profile customization
│   ├── ProfilePreview.tsx       # Live preview card
│   ├── LinkManager.tsx          # Link management UI
│   ├── LinkCard.tsx             # Individual link display
│   ├── PublicProfile.tsx        # Public profile view
│   ├── ThemeProvider.tsx        # Next-themes wrapper
│   └── ui/                      # shadcn/ui components
│
├── lib/
│   ├── types.ts                 # TypeScript types and interfaces
│   ├── storage.ts               # localStorage utilities
│   ├── constants.ts             # Icon and color options
│   └── utils.ts                 # Helper utilities
```

## Usage

### Creating Your Profile

1. **Visit the Dashboard** at `http://localhost:3000`
2. **Customize Your Profile**:
   - Select an avatar emoji
   - Enter your username
   - Write your bio
   - Choose theme and background colors
   - Click "Save Changes"

3. **Add Links**:
   - Click the "Links" tab
   - Click "Add Link"
   - Enter link title, URL, and choose an icon
   - Submit the form
   - Links appear on your profile immediately

4. **Share Your Profile**:
   - Click the "Share Profile" button
   - Your profile URL is copied to clipboard
   - Share the URL with anyone to showcase your links

### Viewing Public Profiles

Public profiles are accessed via `/profile/[id]` where `[id]` is the unique profile identifier. Profiles display in a beautiful, centered layout with:
- Profile avatar and name
- User bio
- All user's links with custom colors and icons
- "Created with LinkTree Clone" footer

## Data Storage

All data is stored locally in your browser's localStorage:
- **Key**: `linktree_profiles` - Array of all profiles
- **Key**: `linktree_current_profile_id` - Currently active profile ID

**Note**: Data persists within the same browser. Clearing browser data will erase all profiles.

## Future Enhancements

- Database integration (Neon, Supabase) for cloud persistence
- User authentication and multi-user support
- Link analytics and click tracking
- Drag-and-drop link reordering with visual feedback
- Social media integration
- Custom domain support
- Link expiration and scheduling
- Open Graph meta tags for better social sharing
- Progressive Web App (PWA) support

## Color System

### Theme Colors
- Blue (#3b82f6)
- Red (#ef4444)
- Green (#10b981)
- Amber (#f59e0b)
- Purple (#8b5cf6)
- Pink (#ec4899)
- Cyan (#06b6d4)
- Indigo (#6366f1)
- Teal (#14b8a6)
- Black (#000000)

### Background Colors
- White (#ffffff)
- Light Gray (#f3f4f6)
- Dark Gray (#1f2937)
- Almost Black (#111827)

## Icon Options

20+ icons available for links including:
- Social: GitHub, Twitter, LinkedIn, Instagram, Facebook, YouTube, TikTok
- Web: Link, Globe, Website
- Commerce: Shopping Bag, Shop
- Content: Blog, Book, Music, Video, Portfolio
- Utility: Email, Phone, Calendar, Location, Download
- Star

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized bundle size with tree-shaking
- Fast initial load with Turbopack
- Real-time updates without page refresh
- Smooth animations and transitions
- Mobile-optimized performance

## Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Screen reader friendly

## License

MIT - Feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feature requests, refer to the inline documentation in the code or check the component files for detailed comments.

---

**Made with ❤️ using Next.js, TypeScript, and shadcn/ui**
