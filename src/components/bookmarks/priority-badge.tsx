import { PRIORITY_BADGE, PRIORITY_LABELS } from "@/lib/utils/priority";
import type { Priority } from "@/lib/utils/priority";

export function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "normal") return null;
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${PRIORITY_BADGE[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
