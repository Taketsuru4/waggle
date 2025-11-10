# Waggle Database Schema

## Πώς να εφαρμόσεις το schema

### Μέθοδος 1: Μέσω Supabase Dashboard
1. Άνοιξε το [Supabase Dashboard](https://app.supabase.com)
2. Πήγαινε στο project σου
3. Κλικ στο **SQL Editor** από το αριστερό μενού
4. Κλικ **New Query**
5. Αντίγραψε το περιεχόμενο του `migrations/20250110_initial_schema.sql`
6. Κλικ **Run**

### Μέθοδος 2: Μέσω Supabase CLI (προτεινόμενο)
```bash
# Εγκατάσταση Supabase CLI
npm install -g supabase

# Login
supabase login

# Link με το project σου
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Schema Overview

### Core Tables

#### `profiles`
Επεκτείνει το `auth.users` του Supabase με επιπλέον πληροφορίες χρήστη.
- Δημιουργείται αυτόματα μέσω trigger όταν κάποιος κάνει sign up
- Roles: `owner`, `caregiver`, `both`

#### `caregiver_profiles`
Προφίλ για caregivers με:
- Bio, εμπειρία, τιμές
- Τοποθεσία (PostGIS για geographic queries)
- Τι είδη κατοικιδίων δέχονται
- Verification status

#### `pets`
Τα κατοικίδια των owners:
- Όνομα, τύπος, ράτσα
- Ειδικές ανάγκες
- Photos

#### `bookings`
Κρατήσεις μεταξύ owners και caregivers:
- Status: pending → accepted/declined → completed/cancelled
- Ημερομηνίες
- Σημειώσεις από owner και caregiver

#### `reviews`
Αξιολογήσεις για caregivers:
- Rating 1-5
- Μόνο από completed bookings
- Ένα review ανά booking

#### `caregiver_images`
Portfolio φωτογραφιών για caregivers

### Security (RLS Policies)

✅ **Profiles**: Public read, own write  
✅ **Caregiver profiles**: Public read, own write  
✅ **Pets**: Private (μόνο ο owner)  
✅ **Bookings**: Visible στον owner και caregiver  
✅ **Reviews**: Public read, owners μπορούν να γράψουν  
✅ **Images**: Public read, caregivers manage their own

### Key Features

- **PostGIS Integration**: Location-based search για caregivers
- **Auto Profile Creation**: Trigger που δημιουργεί profile στο signup
- **Auto Timestamps**: `created_at` και `updated_at` ενημερώνονται αυτόματα
- **Data Validation**: Constraints για valid dates, ratings κλπ
- **Cascading Deletes**: Αν διαγραφεί user, διαγράφονται όλα τα δεδομένα του

## TypeScript Types

Μετά το migration, μπορείς να generate TypeScript types:

```bash
npx supabase gen types typescript --project-id your-project-ref > lib/database.types.ts
```

## Next Steps

1. ✅ Apply το migration
2. Enable PostGIS extension στο Supabase (αν δεν είναι ήδη enabled)
3. Test το schema με mock data
4. Δημιούργησε TypeScript types
5. Φτιάξε τα authentication flows
