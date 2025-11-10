import { RatingStars } from "@/components/rating-stars";

interface ReviewCardProps {
  rating: number;
  comment: string | null;
  reviewerName: string;
  createdAt: string;
}

export function ReviewCard({
  rating,
  comment,
  reviewerName,
  createdAt,
}: ReviewCardProps) {
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("el-GR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get initials for avatar
  const initials = reviewerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-800">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-900">
          {initials}
        </div>

        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {reviewerName}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Rating */}
          <RatingStars rating={rating} readonly size="sm" />

          {/* Comment */}
          {comment && (
            <p className="text-zinc-700 dark:text-zinc-300">{comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
