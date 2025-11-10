# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Waggle is a pet sitting platform that connects pet owners with professional caregivers. Built as a connection platform without payment processing.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19.2
- TypeScript (strict mode)
- Tailwind CSS 4
- Supabase (authentication & backend)
- Biome (linting & formatting)
- React Compiler enabled

## Development Commands

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev  # Runs on http://localhost:3000
```

### Build & Production
```bash
npm run build  # Build for production
npm start      # Start production server
```

### Code Quality
```bash
npm run lint    # Run Biome linting
npm run format  # Format code with Biome
```

## Environment Configuration

Copy `.env.local.example` to `.env.local` and configure:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

These are obtained from the Supabase dashboard.

## Architecture

### Supabase Client Pattern

The project uses separate client initialization for browser and server contexts:

**Browser Client** (`lib/supabase/client.ts`):
- Uses `createBrowserClient` from `@supabase/ssr`
- For client components and client-side operations
- Import: `import { createClient } from '@/lib/supabase/client'`

**Server Client** (`lib/supabase/server.ts`):
- Uses `createServerClient` from `@supabase/ssr`
- For Server Components, Route Handlers, and Server Actions
- Handles cookie management for SSR
- Import: `import { createClient } from '@/lib/supabase/server'`

**Always use the appropriate client based on the execution context.** Using the wrong client will cause authentication issues.

### Middleware

`middleware.ts` handles:
- Automatic session refresh for authenticated users
- Cookie management for Supabase auth across requests
- Runs on all routes except static assets (`_next/static`, `_next/image`, images)

### Path Aliases

TypeScript is configured with `@/*` path alias pointing to the project root:
```typescript
import { createClient } from '@/lib/supabase/client'
```

### Next.js Configuration

- **React Compiler**: Enabled (`reactCompiler: true`)
- **App Router**: Using Next.js 16 app directory structure
- **TypeScript**: Strict mode enabled with ES2017 target

## Code Style & Linting

Biome is configured with:
- 2-space indentation
- Auto-organize imports on save
- Next.js and React recommended rules
- Git integration enabled
- Custom rule: `noUnknownAtRules` disabled for Tailwind CSS compatibility

**When making changes:**
- Run `npm run format` before committing
- Biome will auto-organize imports
- Follow existing patterns for consistency

## Project Structure

```
waggle/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout with fonts
│   ├── page.tsx      # Homepage
│   └── globals.css   # Global styles
├── lib/              # Shared utilities
│   └── supabase/     # Supabase client utilities
│       ├── client.ts # Browser client
│       └── server.ts # Server client
├── public/           # Static assets
│   └── assets/       # Images & media
└── middleware.ts     # Auth & session handling
```

## Key Features to Implement

Based on README, the platform focuses on:
- Professional caregiver profile creation
- Location-based search
- Direct contact/communication
- Supabase authentication

## TypeScript Guidelines

- Strict mode is enabled
- Use proper typing for Supabase responses
- Non-null assertions (`!`) are used for environment variables (ensure `.env.local` is properly configured)
- JSX pragma: `react-jsx` (no need to import React in files)
