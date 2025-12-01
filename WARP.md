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
- `NEXT_PUBLIC_SITE_URL` (Optional) - Site URL for OAuth redirects (defaults to http://localhost:3000)
- `RESEND_API_KEY` - Resend API key for email notifications (get from resend.com)

Supabase credentials are obtained from the Supabase dashboard.
Resend API key is obtained from [resend.com/api-keys](https://resend.com/api-keys).

**See `EMAIL_SETUP.md` for detailed email notification setup instructions.**

## Architecture

### Authentication

The app supports three authentication methods:
- **Email/Password**: Traditional authentication via Supabase
- **Google OAuth**: Sign in with Google account
- **Apple OAuth**: Sign in with Apple ID

**OAuth Setup**: To enable OAuth providers, follow the guide in `docs/oauth-setup.md`. This includes configuring Google Cloud Console and Apple Developer accounts, then enabling the providers in Supabase dashboard.

**OAuth Flow**:
1. User clicks OAuth button (login or signup page)
2. Server action redirects to OAuth provider
3. After authentication, callback route (`app/auth/callback/route.ts`) handles the response
4. Profile is automatically created for new OAuth users with default role "owner"
5. User is redirected to homepage

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
│   ├── auth/         # Authentication
│   │   ├── login/    # Login page & form
│   │   ├── signup/   # Signup page & form
│   │   ├── callback/ # OAuth callback handler
│   │   └── actions.ts # Auth server actions
│   ├── layout.tsx    # Root layout with fonts
│   ├── page.tsx      # Homepage
│   └── globals.css   # Global styles
├── docs/             # Documentation
│   └── oauth-setup.md # OAuth configuration guide
├── lib/              # Shared utilities
│   ├── email/        # Email notification system
│   │   ├── client.ts # Resend client
│   │   ├── types.ts  # Email interfaces
│   │   ├── send.ts   # Send functions
│   │   └── templates/ # React email templates
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
