# OAuth Setup Guide

This guide explains how to configure Google and Apple OAuth authentication for the Waggle app.

## Overview

The app now supports three authentication methods:
- Email/Password (existing)
- Google OAuth (new)
- Apple OAuth (new)

## Prerequisites

- Supabase project setup
- Access to Supabase dashboard
- Google Cloud Console access (for Google OAuth)
- Apple Developer account (for Apple OAuth)

## Implementation Files

The OAuth implementation consists of:

1. **Server Actions** (`app/auth/actions.ts`)
   - `signInWithGoogle()` - Initiates Google OAuth flow
   - `signInWithApple()` - Initiates Apple OAuth flow

2. **Callback Handler** (`app/auth/callback/route.ts`)
   - Processes OAuth callbacks
   - Exchanges authorization code for session
   - Creates user profile if it doesn't exist

3. **UI Components** (`app/auth/login/login-form.tsx`)
   - Google login button with icon
   - Apple login button with icon
   - Visual separator between OAuth and email/password

## Supabase Configuration

### 1. Enable Google OAuth Provider

1. Go to Supabase Dashboard → Authentication → Providers
2. Find "Google" and click to configure
3. Set up Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Add authorized redirect URIs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
4. Paste Client ID and Client Secret in Supabase
5. Enable the provider

### 2. Enable Apple OAuth Provider

1. Go to Supabase Dashboard → Authentication → Providers
2. Find "Apple" and click to configure
3. Set up Apple OAuth credentials:
   - Go to [Apple Developer Portal](https://developer.apple.com/)
   - Create a Services ID
   - Configure Sign in with Apple
   - Add redirect URLs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Create a private key for Sign in with Apple
   - Note your Team ID, Services ID, and Key ID
4. Paste credentials in Supabase:
   - Services ID
   - Team ID
   - Key ID
   - Private Key (paste the contents of the .p8 file)
5. Enable the provider

## Environment Variables

Add to your `.env.local` file:

```bash
# Optional: Set site URL for OAuth redirects
# Defaults to http://localhost:3000 in development
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

For development, the app will automatically use `http://localhost:3000` (or whatever port Next.js uses).

## OAuth Flow

1. User clicks "Συνέχεια με Google" or "Συνέχεια με Apple"
2. Server action initiates OAuth flow with Supabase
3. User is redirected to Google/Apple for authentication
4. After successful authentication, user is redirected to `/auth/callback`
5. Callback handler:
   - Exchanges authorization code for session
   - Checks if user profile exists
   - Creates profile with OAuth data if needed (full_name, default role: "owner")
   - Redirects to homepage

## Profile Creation

When a user signs in with OAuth for the first time:
- A profile is automatically created in the `profiles` table
- `full_name` is extracted from OAuth provider metadata
- Default `role` is set to "owner"
- If profile already exists, no changes are made

## Testing

1. Ensure Supabase OAuth providers are configured
2. Start development server: `npm run dev`
3. Navigate to `/auth/login`
4. You should see:
   - Google login button with icon
   - Apple login button with icon
   - Separator line with "ή συνέχισε με email"
   - Email/password form below

**Note**: OAuth will only work after you configure the providers in Supabase dashboard. Until then, clicking the buttons will result in an error.

## Troubleshooting

### OAuth button click does nothing
- Check browser console for errors
- Verify Supabase providers are enabled
- Check that redirect URLs are correctly configured

### "Invalid OAuth state" error
- Verify callback URL matches what's configured in Google/Apple
- Check that the URL is exactly: `https://<your-project-ref>.supabase.co/auth/v1/callback`

### User profile not created
- Check Supabase logs in dashboard
- Verify `profiles` table exists and has correct structure
- Check that RLS policies allow insert

### Dark mode issues
- All OAuth buttons support dark mode
- Icons and text adapt to current theme

## Next Steps

To also add OAuth to the signup page:
1. Import `signInWithGoogle` and `signInWithApple` in `app/auth/signup/signup-form.tsx`
2. Add the same OAuth buttons section as in login form
3. OAuth flow remains identical - profile creation is automatic
