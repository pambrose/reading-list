"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "";

  const setFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("filter", value);
    } else {
      params.delete("filter");
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
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Filter:</span>
      <button onClick={() => setFilter("")} className={pillClass(!currentFilter)}>
        All
      </button>
      <button onClick={() => setFilter("unread")} className={pillClass(currentFilter === "unread")}>
        Unread
      </button>
      <button onClick={() => setFilter("read")} className={pillClass(currentFilter === "read")}>
        Read
      </button>
    </div>
  );
}
