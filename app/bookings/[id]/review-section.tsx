"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "@/components/review-form";
import { EditableReviewCard } from "@/components/editable-review-card";
import { checkExistingReview } from "@/app/reviews/actions";

interface ReviewSectionProps {
  bookingId: string;
  bookingStatus: string;
  caregiverName: string;
  isOwner: boolean;
}

export function ReviewSection({
  bookingId,
  bookingStatus,
  caregiverName,
  isOwner,
}: ReviewSectionProps) {
  const [existingReview, setExistingReview] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOwner && bookingStatus === "completed") {
      checkExistingReview(bookingId).then((result) => {
        if (result.exists && result.review) {
          setExistingReview(result.review);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [bookingId, isOwner, bookingStatus]);

  // Don't show anything if not owner or booking not completed
  if (!isOwner || bookingStatus !== "completed") {
    return null;
  }

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
        Αξιολόγηση
      </h2>

      {existingReview ? (
        <div>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Η αξιολόγησή σας:
          </p>
          <EditableReviewCard
            reviewId={existingReview.id}
            rating={existingReview.rating}
            comment={existingReview.comment}
            reviewerName="Εσείς"
            createdAt={existingReview.created_at}
            onUpdate={() => {
              // Reload to show updated review
              window.location.reload();
            }}
            onDelete={() => {
              // Clear the existing review and refresh
              setExistingReview(null);
              window.location.reload();
            }}
          />
        </div>
      ) : (
        <div>
          {showForm ? (
            <ReviewForm
              bookingId={bookingId}
              caregiverName={caregiverName}
              onSuccess={() => {
                setShowForm(false);
                // Reload to show the new review
                window.location.reload();
              }}
            />
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Η κράτηση ολοκληρώθηκε! Θα θέλατε να αξιολογήσετε τον/την{" "}
                {caregiverName};
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Γράψτε Αξιολόγηση
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
