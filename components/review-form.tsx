"use client";

import { useState, useTransition } from "react";
import { RatingStars } from "@/components/rating-stars";
import { createReview } from "@/app/reviews/actions";

interface ReviewFormProps {
  bookingId: string;
  caregiverName: string;
  onSuccess?: () => void;
}

export function ReviewForm({
  bookingId,
  caregiverName,
  onSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Παρακαλώ επιλέξτε αξιολόγηση");
      return;
    }

    const formData = new FormData();
    formData.append("booking_id", bookingId);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    startTransition(async () => {
      const result = await createReview(formData);

      if (result.error) {
        setError(result.error);
      } else {
        // Success
        setRating(0);
        setComment("");
        onSuccess?.();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
          Αξιολογήστε τον/την {caregiverName}
        </label>
        <div className="flex items-center gap-2">
          <RatingStars rating={rating} onRatingChange={setRating} size="lg" />
          {rating > 0 && (
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {rating} {rating === 1 ? "αστέρι" : "αστέρια"}
            </span>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2"
        >
          Σχόλιο (προαιρετικό)
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Μοιραστείτε την εμπειρία σας..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
          maxLength={500}
          disabled={isPending}
        />
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {comment.length}/500 χαρακτήρες
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isPending ? "Υποβολή..." : "Υποβολή Αξιολόγησης"}
      </button>
    </form>
  );
}
