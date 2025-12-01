import * as React from "react";
import { BaseEmail } from "./base";
import type { ReviewEmailData } from "../types";

export function NewReviewEmail({
  caregiverName,
  ownerName,
  rating,
  comment,
  caregiverProfileUrl,
}: ReviewEmailData) {
  const stars = "⭐".repeat(rating);

  return (
    <BaseEmail
      title="Έλαβες νέα κριτική!"
      previewText={`Ο ${ownerName} σου άφησε ${rating} αστέρια`}
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
        Έλαβες νέα κριτική! ⭐
      </h2>

      <p
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "#4b5563",
          margin: "0 0 24px 0",
        }}
      >
        Γεια σου {caregiverName}! Ο/Η <strong>{ownerName}</strong> σου άφησε μια
        νέα κριτική.
      </p>

      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "1px solid #fde047",
          borderRadius: "8px",
          padding: "24px",
          margin: "24px 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            marginBottom: "12px",
          }}
        >
          {stars}
        </div>
        <p
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#78350f",
            margin: "0 0 8px 0",
          }}
        >
          {rating}/5 Αστέρια
        </p>
        {comment && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "6px",
              padding: "16px",
              marginTop: "16px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#1f2937",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              "{comment}"
            </p>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", margin: "32px 0" }}>
        <a
          href={caregiverProfileUrl}
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
          Δες το προφίλ σου
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
        Συνέχισε την εξαιρετική δουλειά! 🐾
      </p>
    </BaseEmail>
  );
}
