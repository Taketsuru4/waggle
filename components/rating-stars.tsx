"use client";

import { useState } from "react";

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
}

export function RatingStars({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  showCount = false,
  count,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const StarIcon = ({ filled, index }: { filled: boolean; index: number }) => (
    <svg
      className={`${sizeClasses[size]} ${
        readonly
          ? "cursor-default"
          : "cursor-pointer transition-transform hover:scale-110"
      } ${
        filled
          ? "fill-yellow-400 text-yellow-400"
          : "fill-none text-zinc-300 dark:text-zinc-600"
      }`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      onMouseEnter={() => !readonly && setHoverRating(index + 1)}
      onMouseLeave={() => !readonly && setHoverRating(0)}
      onClick={() => !readonly && onRatingChange?.(index + 1)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((index) => (
          <StarIcon key={index} filled={index < displayRating} index={index} />
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
          ({count})
        </span>
      )}
    </div>
  );
}
