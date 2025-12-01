import * as React from "react";
import { BaseEmail } from "./base";
import type { BookingEmailData } from "../types";

export function BookingCancelledEmail({
  ownerName,
  caregiverName,
  petName,
  startDate,
  endDate,
  bookingUrl,
}: BookingEmailData) {
  return (
    <BaseEmail
      title="Κράτηση ακυρώθηκε"
      previewText={`Η κράτηση για τον/την ${petName} ακυρώθηκε`}
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
        Κράτηση ακυρώθηκε
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 24px 0",
        }}
      >
        Γεια σου {caregiverName}! Ο/Η <strong>{ownerName}</strong> ακύρωσε την
        κράτηση για τον/την <strong>{petName}</strong>.
      </p>

      <div
        style={{
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
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
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Ημερομηνίες:
              </td>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#1f2937",
                  fontWeight: "600",
                  textAlign: "right",
                }}
              >
                {startDate} - {endDate}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
          Δες λεπτομέρειες
        </a>
      </div>
    </BaseEmail>
  );
}
