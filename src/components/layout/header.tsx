import { SignOutButton } from "./sign-out-button";
import { ThemeToggle } from "./theme-toggle";
import { version } from "@/../package.json";

export function Header({
  userEmail,
  userName,
  avatarUrl,
}: {
  userEmail: string;
  userName?: string | null;
  avatarUrl?: string | null;
}) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reading List</h1>
          <span className="text-xs text-gray-400 dark:text-gray-500">({version})</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt=""
                className="h-7 w-7 rounded-full"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="hidden sm:block text-left">
              {userName && (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">{userName}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{userEmail}</p>
            </div>
          </div>
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
