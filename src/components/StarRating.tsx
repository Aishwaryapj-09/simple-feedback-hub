import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = "md" 
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange?.(star)}
          disabled={readonly}
          className={cn(
            "transition-all duration-200",
            !readonly && "cursor-pointer hover:scale-110",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors duration-200",
              star <= rating 
                ? "fill-accent text-accent" 
                : "fill-none text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
};
