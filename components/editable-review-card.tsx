"use client";

import { useState, useTransition } from "react";
import { RatingStars } from "@/components/rating-stars";
import { updateReview, deleteReview } from "@/app/reviews/actions";

interface EditableReviewCardProps {
  reviewId: string;
  rating: number;
  comment: string | null;
  reviewerName: string;
  createdAt: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export function EditableReviewCard({
  reviewId,
  rating: initialRating,
  comment: initialComment,
  reviewerName,
  createdAt,
  onUpdate,
  onDelete,
}: EditableReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment || "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("el-GR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initials = reviewerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    setError(null);

    if (rating === 0) {
      setError("Παρακαλώ επιλέξτε αξιολόγηση");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    startTransition(async () => {
      const result = await updateReview(reviewId, formData);

      if (result.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
        onUpdate?.();
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteReview(reviewId);

      if (result.error) {
        setError(result.error);
      } else {
        onDelete?.();
      }
    });
  };

  const handleCancel = () => {
    setRating(initialRating);
    setComment(initialComment || "");
    setError(null);
    setIsEditing(false);
  };

  if (showDeleteConfirm) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-900/20">
        <p className="mb-4 font-medium text-red-900 dark:text-red-200">
          Είστε σίγουροι ότι θέλετε να διαγράψετε την αξιολόγησή σας;
        </p>
        <p className="mb-4 text-sm text-red-700 dark:text-red-300">
          Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Διαγραφή..." : "Ναι, Διαγραφή"}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isPending}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            Ακύρωση
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-800">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
          {initials}
        </div>

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {reviewerName}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {formattedDate}
              </p>
            </div>

            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
                  title="Επεξεργασία"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                  title="Διαγραφή"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  Αξιολόγηση
                </label>
                <RatingStars
                  rating={rating}
                  onRatingChange={setRating}
                  size="md"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                  Σχόλιο (προαιρετικό)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                  maxLength={500}
                  disabled={isPending}
                />
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {comment.length}/500 χαρακτήρες
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isPending || rating === 0}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {isPending ? "Αποθήκευση..." : "Αποθήκευση"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
                >
                  Ακύρωση
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Rating */}
              <RatingStars rating={rating} readonly size="sm" />

              {/* Comment */}
              {comment && (
                <p className="text-zinc-700 dark:text-zinc-300">{comment}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
