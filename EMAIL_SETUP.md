# Email Notification System - Setup & Testing Guide

## Overview

Το Waggle χρησιμοποιεί το [Resend](https://resend.com) για email notifications. Τα emails στέλνονται αυτόματα για σημαντικά events όπως bookings, reviews και νέοι χρήστες.

## Email Types

### 1. Welcome Email
- **Trigger**: Κατά την εγγραφή νέου χρήστη
- **Recipient**: Ο νέος χρήστης
- **Content**: Καλωσόρισμα και επόμενα βήματα

### 2. Booking Request
- **Trigger**: Όταν ένας owner δημιουργεί νέα κράτηση
- **Recipient**: Ο caregiver
- **Content**: Λεπτομέρειες κράτησης και link για αποδοχή/απόρριψη

### 3. Booking Accepted
- **Trigger**: Όταν ένας caregiver αποδέχεται κράτηση
- **Recipient**: Ο owner
- **Content**: Επιβεβαίωση αποδοχής με λεπτομέρειες

### 4. Booking Declined
- **Trigger**: Όταν ένας caregiver απορρίπτει κράτηση
- **Recipient**: Ο owner
- **Content**: Ειδοποίηση απόρριψης με link για αναζήτηση άλλων caregivers

### 5. Booking Cancelled
- **Trigger**: Όταν ένας owner ακυρώνει κράτηση
- **Recipient**: Ο caregiver
- **Content**: Ειδοποίηση ακύρωσης

### 6. Booking Completed
- **Trigger**: Όταν ολοκληρώνεται μια κράτηση
- **Recipient**: Ο owner
- **Content**: Prompt για αξιολόγηση του caregiver

### 7. New Review
- **Trigger**: Όταν ένας owner αφήνει αξιολόγηση (future implementation)
- **Recipient**: Ο caregiver
- **Content**: Η νέα αξιολόγηση με stars και comment

## Setup Instructions

### 1. Create Resend Account

1. Πήγαινε στο [resend.com](https://resend.com)
2. Δημιούργησε λογαριασμό (Free tier: 3,000 emails/month, 100/day)
3. Verify το email σου

### 2. Get API Key

1. Πήγαινε στο [API Keys](https://resend.com/api-keys)
2. Δημιούργησε νέο API key
3. Αντίγραψε το key (αρχίζει με `re_`)

### 3. Configure Environment

Πρόσθεσε το API key στο `.env.local`:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

### 4. (Optional) Verify Domain

Για production, πρέπει να verify το domain σου:

1. Πήγαινε στο [Domains](https://resend.com/domains)
2. Πρόσθεσε το domain σου
3. Πρόσθεσε τα DNS records που σου δίνει το Resend
4. Περίμενε verification (συνήθως μερικά λεπτά)
5. Άλλαξε το `FROM_EMAIL` στο `lib/email/send.ts`:
   ```typescript
   const FROM_EMAIL = "Waggle <noreply@yourdomain.com>";
   ```

**Note**: Για development, μπορείς να χρησιμοποιήσεις το default `onboarding@resend.dev` (αλλά θα στέλνει μόνο στο verified email σου).

## Testing

### Development Testing

1. Βεβαιώσου ότι έχεις set το `RESEND_API_KEY` στο `.env.local`
2. Restart το dev server:
   ```bash
   npm run dev
   ```

### Test Scenarios

#### Test Welcome Email
```bash
# Signup με νέο user μέσω UI
# http://localhost:3000/auth/signup
```

#### Test Booking Emails
```bash
# 1. Login ως owner
# 2. Δημιούργησε νέα κράτηση
# 3. Login ως caregiver (σε άλλο browser/incognito)
# 4. Accept/Decline την κράτηση
# 5. Ελέγχε τα emails
```

### Check Email Logs

1. Πήγαινε στο [Resend Dashboard](https://resend.com/emails)
2. Δες τα sent emails
3. Μπορείς να δεις:
   - Email status (sent, delivered, bounced)
   - Preview του email
   - Error logs (αν υπάρχουν)

### Test Email Templates

Για να δεις πως φαίνονται τα emails χωρίς να τα στείλεις, μπορείς να χρησιμοποιήσεις το Resend Preview:

```typescript
// Example: lib/email/test-preview.ts
import { WelcomeEmail } from "./templates/welcome";

const html = await renderAsync(
  <WelcomeEmail userName="Test User" userEmail="test@example.com" />
);
console.log(html);
```

## Troubleshooting

### Emails δεν στέλνονται

1. **Ελέγχε το API key**:
   - Βεβαιώσου ότι το `RESEND_API_KEY` είναι set στο `.env.local`
   - Ελέγχε ότι το key είναι valid (αρχίζει με `re_`)

2. **Ελέγχε τα logs**:
   ```bash
   # Terminal output θα δείχνει errors
   # e.g., "Failed to send welcome email: ..."
   ```

3. **Ελέγχε το Resend Dashboard**:
   - Πήγαινε στο [Logs](https://resend.com/logs)
   - Ελέγχε για failed requests

### Emails πηγαίνουν στο spam

1. **Verify το domain** (βλέπε παραπάνω)
2. **Πρόσθεσε SPF/DKIM records** (το Resend τα δίνει όταν verify το domain)
3. **Χρησιμοποίησε professional email template** (ήδη done ✓)

### Rate Limits

- **Free tier**: 100 emails/day, 3,000/month
- **Solution**: Upgrade σε paid plan ή περίμενε reset

## Error Handling

Το email system έχει graceful error handling:

- Τα emails στέλνονται **asynchronously** (δεν block user actions)
- Errors **log** αλλά **δεν throw** (δεν σπάνε το app)
- Users βλέπουν in-app notifications ανεξάρτητα από emails

```typescript
// Example από auth/actions.ts
sendWelcomeEmail({
  userName: user.full_name,
  userEmail: user.email,
}).catch((error) => {
  console.error("Failed to send welcome email:", error);
  // User can still use the app
});
```

## Production Checklist

- [ ] Verify domain στο Resend
- [ ] Άλλαξε `FROM_EMAIL` σε production domain
- [ ] Set `RESEND_API_KEY` στο production environment
- [ ] Set `NEXT_PUBLIC_SITE_URL` στο production URL
- [ ] Test όλα τα email types σε production
- [ ] Monitor email delivery rates
- [ ] Set up email forwarding/replies (optional)

## File Structure

```
lib/email/
├── client.ts           # Resend client initialization
├── types.ts            # TypeScript interfaces
├── send.ts             # Send functions for each email type
└── templates/
    ├── base.tsx        # Base email layout
    ├── welcome.tsx
    ├── booking-request.tsx
    ├── booking-accepted.tsx
    ├── booking-declined.tsx
    ├── booking-cancelled.tsx
    ├── booking-completed.tsx
    └── new-review.tsx
```

## Future Enhancements

- [ ] Email preferences (allow users to opt-out of certain emails)
- [ ] Email scheduling (e.g., reminder 1 day before booking)
- [ ] Email analytics (open rates, click rates)
- [ ] Multi-language support (currently Greek only)
- [ ] SMS notifications (via Twilio or similar)
