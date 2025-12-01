import * as React from "react";
import { BaseEmail } from "./base";
import type { BookingEmailData } from "../types";

export function BookingDeclinedEmail({
  ownerName,
  caregiverName,
  petName,
  startDate,
  endDate,
}: BookingEmailData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <BaseEmail
      title="Ενημέρωση για την κράτησή σου"
      previewText={`Ο ${caregiverName} δεν μπόρεσε να δεχτεί την κράτηση`}
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
        Ενημέρωση για την κράτησή σου
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 24px 0",
        }}
      >
        Γεια σου {ownerName}! Δυστυχώς, ο/η <strong>{caregiverName}</strong> δεν
        μπόρεσε να δεχτεί την κράτησή σου για τον/την <strong>{petName}</strong>{" "}
        από {startDate} έως {endDate}.
      </p>

      <div
        style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          padding: "20px",
          margin: "24px 0",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#991b1b",
            margin: 0,
          }}
        >
          Μην ανησυχείς! Υπάρχουν πολλοί άλλοι caregivers διαθέσιμοι στην
          περιοχή σου που θα χαρούν να φροντίσουν τον/την {petName}.
        </p>
      </div>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={`${siteUrl}/caregivers`}
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
          Βρες άλλον Caregiver
        </a>
      </div>
    </BaseEmail>
  );
}
