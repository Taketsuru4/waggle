import * as React from "react";
import { BaseEmail } from "./base";
import type { BookingEmailData } from "../types";

export function BookingRequestEmail({
  ownerName,
  caregiverName,
  petName,
  startDate,
  endDate,
  bookingUrl,
}: BookingEmailData) {
  return (
    <BaseEmail
      title="Νέα αίτηση κράτησης"
      previewText={`Ο ${ownerName} σε ζήτησε για φροντίδα του ${petName}`}
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
        Νέα αίτηση κράτησης! 🐾
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 24px 0",
        }}
      >
        Γεια σου {caregiverName}! Έχεις μια νέα αίτηση κράτησης από τον/την{" "}
        <strong>{ownerName}</strong>.
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
                Κατοικίδιο:
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
                {petName}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Έναρξη:
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
                {startDate}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "8px 0",
                  fontSize: "14px",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                Λήξη:
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
                {endDate}
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
          Δες την κράτηση
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
        Μπορείς να δεχτείς ή να απορρίψεις την κράτηση από το dashboard σου.
      </p>
    </BaseEmail>
  );
}
