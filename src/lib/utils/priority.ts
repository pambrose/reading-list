export const PRIORITY_LEVELS = ["urgent", "high", "normal", "low"] as const;
export type Priority = (typeof PRIORITY_LEVELS)[number];

export const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};

// Left border color classes for bookmark card
export const PRIORITY_BORDER: Record<Priority, string> = {
  urgent: "border-l-4 border-l-red-500",
  high: "border-l-4 border-l-orange-400",
  normal: "", // falls back to unread blue or no border
  low: "border-l-4 border-l-gray-300 dark:border-l-gray-600",
};

// Badge color classes for inline text badge
export const PRIORITY_BADGE: Record<Priority, string> = {
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  normal: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  low: "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
};
