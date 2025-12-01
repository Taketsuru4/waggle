import * as React from "react";
import { BaseEmail } from "./base";
import type { BookingEmailData } from "../types";

export function BookingCompletedEmail({
  ownerName,
  caregiverName,
  petName,
  bookingUrl,
}: BookingEmailData) {
  return (
    <BaseEmail
      title="Η κράτησή σου ολοκληρώθηκε!"
      previewText={`Πώς ήταν η φροντίδα του ${petName};`}
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
        Η κράτησή σου ολοκληρώθηκε! 🎉
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 24px 0",
        }}
      >
        Γεια σου {ownerName}! Η κράτησή σου με τον/την{" "}
        <strong>{caregiverName}</strong> για τον/την <strong>{petName}</strong>{" "}
        ολοκληρώθηκε επιτυχώς.
      </p>

      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #fde047",
          borderRadius: "8px",
          padding: "20px",
          margin: "24px 0",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#78350f",
            margin: 0,
            textAlign: "center",
          }}
        >
          ⭐ <strong>Πώς ήταν η εμπειρία σου;</strong>
          <br />
          <span style={{ fontSize: "14px" }}>
            Βοήθησε άλλους pet owners αφήνοντας μια κριτική!
          </span>
        </p>
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
          Γράψε κριτική
        </a>
      </div>

      <p
        style={{
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#6b7280",
          margin: "24px 0 0 0",
          textAlign: "center",
        }}
      >
        Ευχαριστούμε που χρησιμοποιείς το Waggle! 🐾
      </p>
    </BaseEmail>
  );
}
