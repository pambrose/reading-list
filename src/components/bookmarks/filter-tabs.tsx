"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRIORITY_LEVELS, PRIORITY_LABELS } from "@/lib/utils/priority";

export function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";
  const currentPriority = searchParams.get("priority") || "";
  const currentSort = searchParams.get("sort") || "";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  const pillClass = (active: boolean) =>
    `rounded-full px-3 py-1 text-sm font-medium transition-colors ${
      active
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-16 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Filter:</span>
        <button onClick={() => setParam("filter", "")} className={pillClass(!currentFilter)}>
          All
        </button>
        <button onClick={() => setParam("filter", "unread")} className={pillClass(currentFilter === "unread")}>
          Unread
        </button>
        <button onClick={() => setParam("filter", "read")} className={pillClass(currentFilter === "read")}>
          Read
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-16 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Priority:</span>
        <button onClick={() => setParam("priority", "")} className={pillClass(!currentPriority)}>
          All
        </button>
        {PRIORITY_LEVELS.map((p) => (
          <button
            key={p}
            onClick={() => setParam("priority", p)}
            className={pillClass(currentPriority === p)}
          >
            {PRIORITY_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="w-16 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Sort:</span>
        <button onClick={() => setParam("sort", "")} className={pillClass(currentSort !== "priority")}>
          Newest first
        </button>
        <button onClick={() => setParam("sort", "priority")} className={pillClass(currentSort === "priority")}>
          By priority
        </button>
      </div>
    </div>
  );
}
