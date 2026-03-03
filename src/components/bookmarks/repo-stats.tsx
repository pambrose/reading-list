import type { Bookmark } from "@/types/database";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
}

export function RepoStats({ bookmark }: { bookmark: Bookmark }) {
  if (bookmark.repo_stars == null) return null;

  return (
    <span className="inline-flex items-center gap-2.5 text-xs text-gray-500 dark:text-gray-400">
      {/* Stars */}
      <span className="inline-flex items-center gap-0.5">
        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
        </svg>
        {formatCount(bookmark.repo_stars)}
      </span>

      {/* Forks */}
      {bookmark.repo_forks != null && (
        <span className="inline-flex items-center gap-0.5">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 0-1.5 0v.878H6.75v-.878a2.25 2.25 0 1 0-1.5 0ZM8 1.25a.75.75 0 0 0-.75.75v6.44l-.72-.72a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l2-2a.75.75 0 1 0-1.06-1.06l-.72.72V2A.75.75 0 0 0 8 1.25Z" />
          </svg>
          {formatCount(bookmark.repo_forks)}
        </span>
      )}

      {/* Language */}
      {bookmark.repo_language && (
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-current opacity-40" />
          {bookmark.repo_language}
        </span>
      )}
    </span>
  );
}
