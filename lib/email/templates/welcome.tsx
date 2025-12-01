import * as React from "react";
import { BaseEmail } from "./base";
import type { WelcomeEmailData } from "../types";

export function WelcomeEmail({ userName, userEmail }: WelcomeEmailData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <BaseEmail
      title="Καλώς ήρθες στο Waggle!"
      previewText={`Γεια σου ${userName}! Καλώς ήρθες στην πλατφόρμα pet sitting.`}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "600",
          color: "#1f2937",
          marginTop: 0,
          marginBottom: "16px",
        }}
      >
        Γεια σου {userName}! 👋
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 16px 0",
        }}
      >
        Χαιρόμαστε που μπήκες στην κοινότητα του Waggle! Είμαστε εδώ για να σε
        βοηθήσουμε να βρεις τον καλύτερο caregiver για τα αγαπημένα σου
        κατοικίδια.
      </p>

      <div
        style={{
          backgroundColor: "#f0f9ff",
          borderLeft: "4px solid #2563eb",
          padding: "16px",
          margin: "24px 0",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#1e40af",
            margin: 0,
          }}
        >
          <strong>Επόμενα βήματα:</strong>
          <br />• Συμπλήρωσε το προφίλ σου
          <br />• Πρόσθεσε τα κατοικίδιά σου
          <br />• Αναζήτησε caregivers στην περιοχή σου
          <br />• Κάνε την πρώτη σου κράτηση!
        </p>
      </div>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={`${siteUrl}/dashboard`}
          style={{
            display: "inline-block",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "14px 32px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Πήγαινε στο Dashboard
        </a>
      </div>

      <p
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#6b7280",
          margin: "24px 0 0 0",
        }}
      >
        Αν έχεις οποιαδήποτε ερώτηση, είμαστε εδώ για να βοηθήσουμε!
      </p>
    </BaseEmail>
  );
}
