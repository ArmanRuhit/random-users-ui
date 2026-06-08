# Random Users UI

A React app that fetches users from the [FreeAPI Random Users](https://api.freeapi.app/api/v1/public/randomusers) endpoint and displays them as a responsive grid of profile cards, with pagination and loading/error states.

> Built for the Web Dev Cohort 2026 assignment.

## Live demo

🔗 _Add your deployed URL here after deploying (e.g. Vercel)._

## Features

- Fetches users from the FreeAPI Random Users API
- Responsive card grid (1 / 2 / 3 columns by screen size)
- Each card shows photo, name, email, location, and phone
- Loading and error states (handles failed requests, not just network errors)
- Pagination with Next / Prev controls and disabled states at the boundaries

## Tech stack

- **React** (functional components + hooks: `useState`, `useEffect`)
- **Vite** — dev server and production build
- **Tailwind CSS v4** — utility-first styling

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

## API

`GET https://api.freeapi.app/api/v1/public/randomusers?page=<n>&limit=<n>`

The user array is at `response.data.data`; pagination metadata (`page`, `totalPages`, `nextPage`, `previousPage`) is on `response.data`.
