# Astra Frontend

Astra is a project management frontend built with React, TypeScript, and Vite. It provides a multi-tenant workspace for teams to plan projects, manage tasks, chat in real time, and run video meetings, with user and admin experiences split by route guards and layouts. To view the backend code click on [Astra Backend ](https://github.com/AKHILJOY312/astra-backend).

## Features

- Public landing, authentication, and email verification flows
- Project dashboard, project detail view, and member invites
- Task management with status flows, comments, and attachments
- Workspace messaging with channels and real-time updates via Socket.IO
- Video meetings with lobby and in-room experiences powered by LiveKit
- Billing and plan upgrade flow (Razorpay integration)
- Admin dashboard for users, plans, and billing

## Tech Stack

- React 18 + TypeScript
- Vite 7
- Tailwind CSS 4
- Redux Toolkit for state and thunks
- React Query for server-state caching
- Axios with interceptors
- Socket.IO client and LiveKit components

## Project Structure

- `src/app/` application entry, root layout, and global styles
- `src/components/` UI organized by an atomic design-inspired structure
- `src/context/` React context providers
- `src/hooks/` custom hooks
- `src/redux/` Redux Toolkit store, slices, and thunks
- `src/routes/` route config, guards, and constants
- `src/services/` API layer and gateway services
- `src/styles/` global styles and theme definitions
- `src/types/` shared TypeScript types
- `src/utils/` shared utilities

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20 recommended to match the Dockerfile)
- npm

### Install and Run

1. `npm install`
2. `npm run dev`
3. Open the URL printed by Vite (default: `http://localhost:5173`)

### Build and Preview

1. `npm run build`
2. `npm run preview`

### Lint

- `npm run lint`

## Environment Variables

Vite only exposes variables prefixed with `VITE_`. Add or update values in `.env`.

- `VITE_BACKEND_URL` API base URL (example: `http://localhost:3000/api`)
- `VITE_SOCKET_URL` Socket.IO base URL (example: `http://localhost:3000`)
- `VITE_RAZORPAY_KEY` Razorpay public key for the checkout flow

## Docker

This project ships a multi-stage Docker build that serves the production build via Nginx.

1. `docker build -t astra-frontend .`
2. `docker run -p 5173:80 astra-frontend`

Nginx proxies `/api/*` and `/socket.io/*` to `http://backend:3000`. If your backend host differs, update `nginx.conf`.

## Notes

- Routing is defined in `src/routes/config.ts` and guarded by `src/routes/RouteGuards.tsx`.
- Vite will ignore non-`VITE_` variables in `.env`.
