# Documentation — Random Users UI

Technical documentation for the Random Users UI app: how it's structured, how the code works, and how it's deployed.

## Overview

A single-page React app that fetches users from the FreeAPI Random Users endpoint and renders them as a responsive grid of profile cards with pagination. No backend of its own — it talks directly to the public API from the browser.

- **API:** `GET https://api.freeapi.app/api/v1/public/randomusers?page=<n>&limit=<n>`
- **Response shape:** users at `response.data.data`; pagination metadata (`page`, `totalPages`, `nextPage`, `previousPage`) at `response.data`.

## Tech stack

| Concern | Choice |
|---------|--------|
| UI library | React 19 (functional components + hooks) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Runtime (build) | Node ≥ 22.12 (pinned in `package.json` engines) |
| Hosting | Self-hosted on a VPS via Coolify (Nixpacks build, nginx static serve, Traefik proxy + Let's Encrypt) |

## Project structure

```
random-users-ui/
├── index.html            # Vite entry HTML, mounts #root
├── vite.config.js        # Vite + React + Tailwind plugins
├── package.json          # scripts, deps, engines (node >=22.12)
└── src/
    ├── main.jsx          # React entry: createRoot(...).render(<App />)
    ├── App.jsx           # the whole app (state, fetch, grid, pagination)
    └── index.css         # @import "tailwindcss";
```

## How the code works (`src/App.jsx`)

State (via `useState`):
- `users` — array of users for the current page
- `loading` — true while a request is in flight
- `error` — error message string, or null
- `page` — current page number (1-based)
- `totalPages` — total pages reported by the API

Data flow:
1. `useEffect(..., [page])` runs on mount and whenever `page` changes.
2. It `fetch`es the API for the current page, checks `response.ok` (throws on a bad HTTP status), parses JSON, and stores `result.data.data` into `users` plus `result.data.totalPages` into `totalPages`.
3. `.catch` records any error; `.finally` clears `loading`.

Rendering (ordered guards):
1. If `loading` → show "Loading…".
2. If `error` → show the error in red.
3. Otherwise → render the grid: `users.map(...)` produces one card per user (keyed by `user.login.uuid`), showing photo, name, email, location, and phone. Below the grid, a Prev / "Page X of Y" / Next control bar drives `setPage`, with buttons disabled at the boundaries.

## Local development

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Deployment (Coolify on a VPS)

The app is deployed as a **static site** through Coolify:

1. **Source:** the public GitHub repository.
2. **Build pack:** Nixpacks — auto-detects Vite and runs `npm install` + `npm run build`.
3. **Static serving:** output `dist/` is served by `nginx:alpine`; "Is it a static site?" enabled, Publish Directory `/dist`.
4. **Build Node version:** Coolify env var `NIXPACKS_NODE_VERSION=24` (build-time) — required because Vite 8 / rolldown need Node ≥ 22.12; the builder's default (22.11) is too old. The `engines` field in `package.json` documents the same requirement.
5. **Domain & TLS:** served at `https://random-users.apps.armanruhit.dev` via a Cloudflare wildcard `*.apps` record (DNS only / grey cloud). Traefik (Coolify's proxy) terminates TLS and auto-issues a Let's Encrypt certificate over the port-80 HTTP challenge.
