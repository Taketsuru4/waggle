import * as React from "react";
import { BaseEmail } from "./base";
import type { BookingEmailData } from "../types";

export function BookingAcceptedEmail({
  ownerName,
  caregiverName,
  petName,
  startDate,
  endDate,
  bookingUrl,
}: BookingEmailData) {
  return (
    <BaseEmail
      title="Η κράτησή σου έγινε δεκτή!"
      previewText={`Ο ${caregiverName} δέχτηκε την κράτηση για τον/την ${petName}`}
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
        Η κράτησή σου έγινε δεκτή! ✅
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 24px 0",
        }}
      >
        Γεια σου {ownerName}! Ο/Η <strong>{caregiverName}</strong> δέχτηκε την
        κράτησή σου για τον/την <strong>{petName}</strong>.
      </p>

      <div
        style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "8px",
          padding: "20px",
          margin: "24px 0",
        }}
      >
        <table
          role="presentation"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#15803d",
                  fontWeight: "500",
                }}
              >
                Έναρξη:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#166534",
                  fontWeight: "600",
                  textAlign: "right",
                }}
              >
                {startDate}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#15803d",
                  fontWeight: "500",
                }}
              >
                Λήξη:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#166534",
                  fontWeight: "600",
                  textAlign: "right",
                }}
              >
                {endDate}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 24px 0",
        }}
      >
        Μπορείς τώρα να επικοινωνήσεις με τον/την {caregiverName} για να
        συζητήσετε τις λεπτομέρειες της φροντίδας.
      </p>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={bookingUrl}
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
          Δες τις λεπτομέρειες
        </a>
      </div>
    </BaseEmail>
  );
}
