# Linktree Clone - Personal Link-in-Bio Application

A modern, fully-functional Linktree clone built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components. Create beautiful personal profile pages to share your curated links.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Visit `http://localhost:3000` to start creating your profile!

## 📁 Project Structure

This is a **monorepo** containing both frontend and backend:

```
linktree-clone/
├── frontend/                    # Next.js frontend application
│   ├── app/                     # App router pages
│   ├── components/              # React components
│   ├── lib/                     # Utilities and helpers
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── next.config.mjs
│   ├── tsconfig.json
│   └── README.md               # Frontend-specific documentation
│
├── backend/                     # Backend API (future)
├── vercel.json                  # Vercel deployment config
├── .vercelignore                # Vercel build optimization
└── README.md                    # This file
```

## ✨ Features

### 🎯 Profile Management
- Customize your profile with avatar selection (10+ emoji options)
- Add a personal username and bio
- Choose from 10 vibrant theme colors for links
- Select background color (white, light gray, dark gray, almost black)
- Dark/light mode toggle support

### 🔗 Link Management
- Add, edit, delete, and reorder links
- 20+ icon options for visual variety (GitHub, Twitter, LinkedIn, Instagram, YouTube, etc.)
- URL validation (HTTP/HTTPS/mailto support)
- Drag-and-drop ready architecture (prepared for future enhancements)

### 🌐 Public Profile Sharing
- Generate shareable profile URLs (`/profile/[id]`)
- One-click copy-to-clipboard for profile links
- Beautiful read-only profile display
- Responsive design for all devices

### 📱 Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Single-column layout on mobile, grid layout on desktop
- Sticky preview card on desktop

### 🎨 Modern UI/UX
- Built with shadcn/ui components
- Clean, intuitive interface
- Real-time profile preview
- Smooth transitions and interactions

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: React 19 hooks with localStorage persistence
- **Icons**: Lucide React
- **Drag & Drop**: dnd-kit with sortable plugin
- **Theme Management**: next-themes
- **Analytics**: Vercel Analytics
- **Storage**: Browser localStorage (client-side, no backend required)

### Backend (Future)
- Node.js/Express
- Database integration (PostgreSQL, MongoDB)
- Authentication system

## 📚 Documentation

For detailed information about the frontend, see [frontend/README.md](./frontend/README.md)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The project is optimized for deployment on Vercel with monorepo support:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Root Directory**
   - In project Settings → General
   - Set **Root Directory** to `frontend`
   - Click **Save**

4. **Deploy**
   - Vercel automatically deploys on every push to `main`
   - Check deployment status in the Deployments tab

**Project Configuration Files:**
- `vercel.json` - Tells Vercel where the app is located
- `.vercelignore` - Excludes unnecessary files from deployment

## 📊 Data Storage

All data is stored locally in your browser's localStorage:
- **Key**: `linktree_profiles` - Array of all profiles
- **Key**: `linktree_current_profile_id` - Currently active profile ID

⚠️ **Note**: Data persists within the same browser. Clearing browser data will erase all profiles.

## 🎨 Customization

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

### Icon Options
20+ icons available:
- **Social**: GitHub, Twitter, LinkedIn, Instagram, Facebook, YouTube, TikTok
- **Web**: Link, Globe, Website
- **Commerce**: Shopping Bag, Shop
- **Content**: Blog, Book, Music, Video, Portfolio
- **Utility**: Email, Phone, Calendar, Location, Download
- **Star**

## 📈 Performance

- Optimized bundle size with tree-shaking
- Fast initial load with Turbopack
- Real-time updates without page refresh
- Smooth animations and transitions
- Mobile-optimized performance

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Screen reader friendly

## 🔄 Future Enhancements

- ✅ Database integration (Neon, Supabase) for cloud persistence
- ✅ User authentication and multi-user support
- ✅ Link analytics and click tracking
- ✅ Drag-and-drop link reordering with visual feedback
- ✅ Social media integration
- ✅ Custom domain support
- ✅ Link expiration and scheduling
- ✅ Open Graph meta tags for better social sharing
- ✅ Progressive Web App (PWA) support

## 🌐 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

MIT - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests.

## 📞 Support

For issues, questions, or feature requests, please:
1. Check the [frontend README](./frontend/README.md) for detailed documentation
2. Review the code comments in component files
3. Open an issue on GitHub

## 🔗 Links

- **GitHub**: https://github.com/talhabinhussain/linktree-clone
- **Frontend Repo**: `./frontend/`
- **Live Demo**: (Coming soon on Vercel)

---

**Made with ❤️ using Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui**

Last Updated: June 2026





