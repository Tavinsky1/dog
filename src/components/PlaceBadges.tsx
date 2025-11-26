"use client";

// Dog size options matching Prisma enum
type DogSizeAllowed = "all" | "small_only" | "small_medium" | "large_ok";

// Badge configuration for place attributes
const BADGE_CONFIG = {
  waterBowl: {
    icon: "💧",
    label: "Water bowl",
    color: "bg-blue-100 text-blue-700",
  },
  offLeash: {
    icon: "🐕",
    label: "Off-leash OK",
    color: "bg-green-100 text-green-700",
  },
  outdoorSeating: {
    icon: "🌳",
    label: "Outdoor seating",
    color: "bg-amber-100 text-amber-700",
  },
  petFee: {
    icon: "💰",
    label: "Pet fee",
    color: "bg-purple-100 text-purple-700",
  },
} as const;

const DOG_SIZE_LABELS: Record<DogSizeAllowed, { label: string; icon: string }> = {
  all: { label: "All sizes", icon: "🐕" },
  small_only: { label: "Small dogs only", icon: "🐩" },
  small_medium: { label: "Small-Medium", icon: "🐕‍🦺" },
  large_ok: { label: "Large dogs OK", icon: "🦮" },
};

interface PlaceBadgesProps {
  hasWaterBowl?: boolean | null;
  offLeashAllowed?: boolean | null;
  hasOutdoorSeating?: boolean | null;
  petFee?: string | null;
  dogSizeAllowed?: DogSizeAllowed | null;
  maxDogsAllowed?: number | null;
  variant?: "compact" | "full";
  className?: string;
}

export default function PlaceBadges({
  hasWaterBowl,
  offLeashAllowed,
  hasOutdoorSeating,
  petFee,
  dogSizeAllowed,
  maxDogsAllowed,
  variant = "compact",
  className = "",
}: PlaceBadgesProps) {
  const badges: Array<{ icon: string; label: string; color: string }> = [];

  // Add badges based on available data
  if (hasWaterBowl) {
    badges.push(BADGE_CONFIG.waterBowl);
  }
  if (offLeashAllowed) {
    badges.push(BADGE_CONFIG.offLeash);
  }
  if (hasOutdoorSeating) {
    badges.push(BADGE_CONFIG.outdoorSeating);
  }
  if (petFee) {
    badges.push({
      ...BADGE_CONFIG.petFee,
      label: petFee,
    });
  }

  // No badges to show
  if (badges.length === 0 && !dogSizeAllowed && !maxDogsAllowed) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap gap-1.5 ${className}`}>
        {dogSizeAllowed && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
            title={DOG_SIZE_LABELS[dogSizeAllowed].label}
          >
            {DOG_SIZE_LABELS[dogSizeAllowed].icon}
          </span>
        )}
        {badges.slice(0, 3).map((badge, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}
            title={badge.label}
          >
            {badge.icon}
          </span>
        ))}
        {badges.length > 3 && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            +{badges.length - 3}
          </span>
        )}
      </div>
    );
  }

  // Full variant - show all badges with labels
  return (
    <div className={`space-y-3 ${className}`}>
      {dogSizeAllowed && (
        <div className="flex items-center gap-2">
          <span className="text-lg">{DOG_SIZE_LABELS[dogSizeAllowed].icon}</span>
          <span className="text-sm font-medium text-slate-700">
            {DOG_SIZE_LABELS[dogSizeAllowed].label}
          </span>
        </div>
      )}
      {maxDogsAllowed && (
        <div className="flex items-center gap-2">
          <span className="text-lg">🔢</span>
          <span className="text-sm font-medium text-slate-700">
            Max {maxDogsAllowed} dog{maxDogsAllowed > 1 ? "s" : ""}
          </span>
        </div>
      )}
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-lg">{badge.icon}</span>
          <span className="text-sm font-medium text-slate-700">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

// Export for use in filters
export { DOG_SIZE_LABELS, BADGE_CONFIG };
