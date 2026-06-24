# Linktree Clone — Personal Link-in-Bio Application

A modern link-in-bio app built as a monorepo. The **frontend** is a Next.js dashboard for creating and sharing profile pages, backed by a **FastAPI** service with PostgreSQL (Neon) persistence.

## Quick Start

### Prerequisites

- **Frontend:** Node.js 18+, pnpm (or npm/yarn)
- **Backend:** Python 3.13+, [uv](https://docs.astral.sh/uv/), PostgreSQL (e.g. [Neon](https://neon.tech))

### Backend

```bash
cd backend
uv sync

# Create backend/.env with your database connection string:
# DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

uv run fastapi dev app/main.py
```

The API runs at [http://localhost:8000](http://localhost:8000). Health check: `GET /health`.

### Frontend

```bash
cd frontend
pnpm install

# Copy the example env and point at your backend:
# cp .env.local.example .env.local

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to create and manage your profile.

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` for local dev (defaults to `http://127.0.0.1:8000`). In production on Vercel, add the same variable in your project environment settings, pointing to your deployed backend URL.

## Project Structure

```
linktree-clone/
├── frontend/                 # Next.js 16 app (primary UI)
│   ├── app/                  # App Router pages
│   ├── components/           # Dashboard, editors, shadcn/ui
│   ├── lib/                  # Types, storage, constants, icons
│   └── README.md             # Frontend-specific docs
│
├── backend/                  # FastAPI + SQLModel API
│   ├── app/
│   │   ├── main.py           # App entry point
│   │   ├── database/         # SQLModel engine & sessions
│   │   ├── models/           # Profile & Link schemas
│   │   ├── routers/          # Profile & link endpoints
│   │   └── services/         # Business logic
│   ├── pyproject.toml
│   └── uv.lock
│
├── .cursor/                  # Cursor IDE config (shadcn MCP)
├── opencode.json             # OpenCode MCP config
└── README.md                 # This file
```

## Features

### Profile management

- Avatar picker with emoji options
- Username and bio editing
- 10 theme colors and 4 background colors
- Light/dark mode toggle (next-themes)
- Live preview panel on desktop

### Link management

- Add, edit, and delete links
- 30+ Lucide icon options (social, portfolio, commerce, etc.)
- URL validation (`http://`, `https://`, `mailto:`)
- Link cards with theme-colored borders and icons

### Public profile sharing

- Shareable URLs at `/profile/[username]`
- One-click copy-to-clipboard
- Public profiles load live data from the API (works in any browser, no local storage required)
- Responsive public profile layout

### Responsive UI

- Mobile-first layout
- Single-column on mobile, editor + sticky preview on desktop
- Built with shadcn/ui components

## Architecture

| Layer    | Stack                                      | Status                          |
|----------|--------------------------------------------|---------------------------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui | **Active** — connected to FastAPI |
| Backend  | FastAPI, SQLModel, PostgreSQL (psycopg2)   | **Active** — REST API + Neon DB |

The frontend persists profile and link data via the FastAPI backend. Each browser stores only the per-profile `edit_token` in localStorage (key: `edit_token_<username>`) so the owner can edit their page.

## Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State:** React 19 hooks + FastAPI client (`lib/api.ts`)
- **Icons:** Lucide React
- **Theming:** next-themes
- **Analytics:** Vercel Analytics
- **DnD (planned):** @dnd-kit packages installed; reorder UI not yet implemented

### Backend

- **Framework:** FastAPI
- **ORM:** SQLModel
- **Database:** PostgreSQL via `DATABASE_URL`
- **Package manager:** uv
- **Auth model:** Edit tokens (`X-Edit-Token` header) per profile — no user accounts yet

## Backend API

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/health`             | Health check                         |
| POST   | `/profile/`           | Create profile (returns `edit_token`) |
| GET    | `/profile/{username}` | Public profile by username           |
| PUT    | `/profile/{username}` | Update profile (requires edit token) |
| POST   | `/links/{username}`   | Add link (requires edit token)       |
| PUT    | `/links/{link_id}`    | Update link (requires edit token)    |
| DELETE | `/links/{link_id}`    | Delete link (requires edit token)    |

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs) when the backend is running.

## Data Storage

| What | Where |
|------|-------|
| Profiles, links, theme, avatar | PostgreSQL via FastAPI |
| Edit token (per username) | Browser `localStorage` (`edit_token_<username>`) |
| Active profile username | Browser `sessionStorage` (`linktree_current_username`) |
| UI theme (light/dark) | Browser `localStorage` (`linktree_theme`) |

Clearing browser data removes edit tokens — you can still view public profiles, but you won't be able to edit unless you have the token saved elsewhere.

## Customization

### Theme colors

Blue, Red, Green, Amber, Purple, Pink, Cyan, Indigo, Teal, Black

### Background colors

White, Light Gray, Dark Gray, Almost Black

### Icon categories

Social (GitHub, Twitter/X, LinkedIn, Instagram, YouTube, TikTok, Twitch), communication (email, phone), portfolio (globe, code, Figma), content (blog, video, music, shop), and utility icons (calendar, download, location, star, etc.)

## Deployment

### Frontend on Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com/dashboard)
3. Set **Root Directory** to `frontend`
4. Add environment variable `NEXT_PUBLIC_API_URL` pointing to your deployed backend
5. Deploy — Vercel builds with `pnpm build` by default

### Backend

Deploy separately (e.g. Railway, Render, Fly.io) with `DATABASE_URL` set in the environment. Tighten CORS in `backend/app/main.py` to your production frontend URL before going live.

## Development

```bash
# Frontend production build
cd frontend
pnpm build
pnpm start

# Backend with auto-reload
cd backend
uv run fastapi dev app/main.py
```

## Documentation

- [frontend/README.md](./frontend/README.md) — detailed frontend usage and component map

## Roadmap

- [x] Connect frontend to FastAPI backend
- [x] Replace localStorage with PostgreSQL persistence
- [ ] User authentication and multi-user support
- [ ] Drag-and-drop link reordering
- [ ] Link analytics and click tracking
- [ ] Open Graph meta tags for social sharing
- [ ] Custom domain support
- [ ] Progressive Web App (PWA) support

## Browser Support

Chrome/Edge (recommended), Firefox, Safari, and mobile browsers.

## License

MIT — free for personal and commercial use.

## Contributing

Contributions are welcome. Fork the repo and open a pull request.

## Links

- **GitHub:** [talhabinhussain/linktree-clone](https://github.com/talhabinhussain/linktree-clone)
- **Frontend docs:** [frontend/README.md](./frontend/README.md)

---

Built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, and FastAPI.
