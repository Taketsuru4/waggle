# Waggle - Pet Sitting Platform

Εφαρμογή που συνδέει ιδιοκτήτες κατοικιδίων με επαγγελματίες φροντίδας.

## Tech Stack

- **Next.js 16** - React Framework με App Router
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Supabase** - Backend & Authentication
- **Biome** - Linting

## Ξεκινώντας

### 1. Εγκατάσταση dependencies

```bash
npm install
```

### 2. Ρύθμιση Supabase

1. Δημιούργησε ένα project στο [Supabase](https://supabase.com)
2. Αντίγραψε το `.env.local.example` σε `.env.local`
3. Συμπλήρωσε τα credentials από το Supabase dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Εκτέλεση Development Server

```bash
npm run dev
```

Άνοιξε [http://localhost:3000](http://localhost:3000) στο browser.

## Δομή Project

```
waggle/
├── app/              # Next.js App Router pages
├── lib/              # Utility functions & Supabase clients
│   └── supabase/     # Supabase client setup
├── public/           # Static assets
│   └── assets/       # Images & media files
└── middleware.ts     # Supabase auth middleware
```

## Χαρακτηριστικά

- 🐾 Δημιουργία προφίλ επαγγελματία
- 📍 Αναζήτηση ανά περιοχή
- 📞 Άμεση επικοινωνία
- 👤 Authentication με Supabase

## Σκοπός

Η εφαρμογή λειτουργεί ως πλατφόρμα σύνδεσης - δεν διαχειρίζεται πληρωμές.
